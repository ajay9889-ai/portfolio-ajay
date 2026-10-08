import { NextRequest, NextResponse } from "next/server";

// In-memory store for instantaneous reaction counts
const reactionsStore: Record<string, Record<string, number>> = {
  eldernest: { "🔥": 28, "🚀": 42, "💡": 19, "❤️": 35 },
  wisdomplay: { "🔥": 15, "🚀": 31, "💡": 24, "❤️": 18 },
  "smart-attendance-system": { "🔥": 22, "🚀": 19, "💡": 37, "❤️": 14 },
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (slug && reactionsStore[slug]) {
    return NextResponse.json({ success: true, reactions: reactionsStore[slug] });
  }

  return NextResponse.json({ success: true, reactions: reactionsStore });
}

export async function POST(req: NextRequest) {
  try {
    const { slug, emoji } = await req.json();

    if (!slug || !emoji) {
      return NextResponse.json(
        { success: false, error: "slug and emoji are required" },
        { status: 400 }
      );
    }

    if (!reactionsStore[slug]) {
      reactionsStore[slug] = { "🔥": 0, "🚀": 0, "💡": 0, "❤️": 0 };
    }

    reactionsStore[slug][emoji] = (reactionsStore[slug][emoji] || 0) + 1;

    return NextResponse.json({
      success: true,
      reactions: reactionsStore[slug],
      total: Object.values(reactionsStore[slug]).reduce((a, b) => a + b, 0),
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to record reaction" },
      { status: 500 }
    );
  }
}
