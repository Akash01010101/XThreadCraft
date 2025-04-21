import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

interface ThreadContent {
  content: string;
  imageBase64?: string;
}

interface ThreadData {
  userId: string;
  title: string;
  content: ThreadContent[];
  scheduledAt?: string;
  accessToken?: string;
  accessSecret?: string;
}

// Log environment variables at startup
console.log('Checking Supabase environment variables...');
console.log('PUBLIC_SUPABASE_URL:', process.env.PUBLIC_SUPABASE_URL ? 'Present' : 'Missing');
console.log('PUBLIC_SUPABASE_ANON_KEY:', process.env.PUBLIC_SUPABASE_ANON_KEY ? 'Present' : 'Missing');

if (!process.env.PUBLIC_SUPABASE_URL || !process.env.PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Supabase environment variables are not configured');
}

const supabase = createClient(
  process.env.PUBLIC_SUPABASE_URL,
  process.env.PUBLIC_SUPABASE_ANON_KEY
);

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const threadId = url.searchParams.get('threadId');

    if (!threadId) {
      return NextResponse.json({ error: "Thread ID is required" }, { status: 400 });
    }

    const { error } = await supabase
      .from("threads")
      .delete()
      .eq("id", threadId);

    if (error) {
      console.error("Error deleting thread:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    }
  }
};

export async function POST(request: Request) {
  try {
    const body = await request.json() as ThreadData;
    console.log("Incoming Request Body:", body);

    const { userId, title, content, scheduledAt, accessToken, accessSecret } = body;

    if (!userId || !title || !Array.isArray(content)) {
      console.error("Missing required fields: userId or title");
      return NextResponse.json({ error: "User ID and Title are required" }, { status: 400 });
    }

    let scheduledTime = null;
    if (scheduledAt) {
      const parsedDateTime = new Date(scheduledAt);
      if (isNaN(parsedDateTime.getTime())) {
        console.error("Invalid scheduledAt value:", scheduledAt);
        return NextResponse.json({ error: "Invalid date/time format" }, { status: 400 });
      }
      scheduledTime = parsedDateTime.toISOString();
    }

    console.log("Checking for existing thread...");
    const { data: existingThread, error: fetchError } = await supabase
      .from("threads")
      .select("id")
      .eq("user_id", userId)
      .eq("title", title)
      .single();

    console.log("Existing Thread Check Result:", existingThread, "Fetch Error:", fetchError);

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Error checking for existing thread:", fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    let data, error;

    if (existingThread) {
      console.log("Updating existing thread...");
      ({ data, error } = await supabase
        .from("threads")
        .update({ content, scheduled_time: scheduledTime, is_posted: false })
        .eq("id", existingThread.id)
        .eq("user_id", userId)
        .select());
    } else {
      console.log("Inserting new thread...");
      ({ data, error } = await supabase
        .from("threads")
        .insert([
          {
            user_id: userId,
            title,
            content,
            scheduled_time: scheduledTime,
            accessToken,
            accessSecret,
            is_posted: false,
          },
        ])
        .select());
    }

    if (error) {
      console.error("Error saving thread:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("Thread saved successfully:", data);
    if (!data || data.length === 0) {
      return NextResponse.json({ success: false, error: "No data returned from database" }, { status: 500 });
    }
    return NextResponse.json({ success: true, thread: data[0] });

  } catch (error) {
    console.error("Unexpected Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const { data: threads, error } = await supabase
      .from('threads')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching threads:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ threads });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}