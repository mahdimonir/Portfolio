import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    const tag = searchParams.get("tag");

    // 1. Verify the signature/token
    if (token !== process.env.REVALIDATION_TOKEN) {
      return NextResponse.json(
        { message: "Invalid signature/token" },
        { status: 401 }
      );
    }

    // 2. Validate tag presence
    if (!tag) {
      return NextResponse.json(
        { message: "Missing tag parameter" },
        { status: 400 }
      );
    }

    // 3. Trigger revalidation
    revalidateTag(tag);

    console.log(`[Revalidate] Tag: ${tag} | Time: ${new Date().toISOString()}`);

    return NextResponse.json({ 
      revalidated: true, 
      tag,
      now: Date.now() 
    });
  } catch (err) {
    console.error("[Revalidate] Error:", err);
    return NextResponse.json(
      { message: "Error revalidating" },
      { status: 500 }
    );
  }
}
