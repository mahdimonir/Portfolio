import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    const tag = searchParams.get("tag");

    if (token !== process.env.REVALIDATION_TOKEN) {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      );
    }

    if (!tag) {
      return NextResponse.json(
        { message: "Missing tag param" },
        { status: 400 }
      );
    }

    revalidateTag(tag);

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    return NextResponse.json(
      { message: "Error revalidating" },
      { status: 500 }
    );
  }
}
