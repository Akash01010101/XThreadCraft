import { getSupabaseClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const supabase = getSupabaseClient(session?.supabaseAccessToken);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('chat_usage')
      .select('verification_count, isPaid')
      .eq('user_id', session.user.email)
      .single();

    if (error) {
      console.error('Error fetching verification count:', error);
      return NextResponse.json({ error: 'Failed to fetch verification count' }, { status: 500 });
    }

    // Check if user has exceeded verification limit
    if (data?.verification_count >= 3 && !data?.isPaid) {
      return NextResponse.json({ error: 'Verification limit exceeded' }, { status: 403 });
    }

    return NextResponse.json({ count: data?.verification_count || 0  , isPaid:data.isPaid });
  } catch (error) {
    console.error('Error in verification count endpoint:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}