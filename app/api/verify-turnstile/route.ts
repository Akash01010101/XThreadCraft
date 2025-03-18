import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY || '0x4AAAAAABAEkEqs5gzr-S6G_BbWYnMBSNA';
const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    const formData = new URLSearchParams();
    formData.append('secret', TURNSTILE_SECRET_KEY);
    formData.append('response', token);

    const result = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      body: formData,
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
    });

    const outcome = await result.json();
    
    if (outcome.success) {
      const session = await getServerSession(authOptions);

      if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const userId = session.user.email;

      // Fetch current verification count
      const { data: userData, error: fetchError } = await supabase
        .from('chat_usage')
        .select('verification_count')
        .eq('user_id', userId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // Ignore "No rows found" error
        console.error('Error fetching user data:', fetchError);
        return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
      }

      if (userData && userData.verification_count >= 2) {
        return NextResponse.json({ success: false, error: 'Verification limit reached' }, { status: 403 });
      }

      if (!userData) {
        // If user doesn't exist, insert new record with verification_count = 1
        const { error: insertError } = await supabase
          .from('chat_usage')
          .insert({
            user_id: userId,
            verification_count: 1,
            last_used: new Date().toISOString(),
          });

        if (insertError) {
          console.error('Error inserting user:', insertError);
          return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
        }
      } else {
        // If user exists, increment verification_count manually
        const newCount = userData.verification_count + 1;

        const { error: updateError } = await supabase
          .from('chat_usage')
          .update({
            verification_count: newCount,
            last_used: new Date().toISOString(),
          })
          .eq('user_id', userId);

        if (updateError) {
          console.error('Error updating verification count:', updateError);
          return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
        }
      }

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: outcome.error });
    }
  } catch (error) {
    console.error('Error verifying turnstile:', error);
    return NextResponse.json({ success: false, error: 'Server error' });
  }
}
