import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";

export async function POST() {
  try {
    const session = await getServerSession();
    console.log(session)
    const supabase = getSupabaseClient(session?.supabaseAccessToken);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { error } = await supabase
      .from("chat_usage")
      .update({ tos_timestamp: new Date().toISOString() })
      .eq("user_id", session.user.email);

    if (error) {
      console.error("Error updating tos_timestamp:", error);
      return NextResponse.json(
        { error: "Failed to update terms acceptance" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in update-tos API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}