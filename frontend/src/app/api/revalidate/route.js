import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  try {
    // Revalidate main pages
    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath("/blogs");
    revalidatePath("/projects/[slug]");
    revalidatePath("/blogs/[slug]");

    return NextResponse.json(
      { revalidated: true, now: Date.now() },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { revalidated: false, now: Date.now(), error: err.message },
      { status: 500 }
    );
  }
}
