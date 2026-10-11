import { NextResponse } from "next/server";
import { searchUnsplashPhotos } from "@/lib/unsplash";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "luxury spa skincare";
  const perPage = parseInt(searchParams.get("per_page") || "6", 10);
  const orientation = searchParams.get("orientation") || "portrait";

  try {
    const photos = await searchUnsplashPhotos(query, { perPage, orientation });
    return NextResponse.json({ success: true, photos });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch images from Unsplash" },
      { status: 500 }
    );
  }
}

