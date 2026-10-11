const UNSPLASH_ACCESS_KEY: string =
  process.env.UNSPLASH_ACCESS_KEY ||
  process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY ||
  "";

export interface UnsplashPhotoResult {
  id: string;
  url: string;
  thumb: string;
  description: string;
  photographer: string;
}

export interface UnsplashSearchOptions {
  perPage?: number;
  orientation?: "portrait" | "landscape" | "squarish";
}

export async function searchUnsplashPhotos(
  query: string,
  { perPage = 10, orientation = "portrait" }: UnsplashSearchOptions = {}
): Promise<UnsplashPhotoResult[]> {
  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        query
      )}&per_page=${perPage}&orientation=${orientation}`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) {
      console.error("Unsplash API error:", res.status, res.statusText);
      return [];
    }

    const data = await res.json();
    return (data.results || []).map((img: any) => ({
      id: img.id,
      url: img.urls?.regular || "",
      thumb: img.urls?.small || "",
      description: img.alt_description || img.description || "Maison Aurelle",
      photographer: img.user ? img.user.name : "Unsplash Creator",
    }));
  } catch (err) {
    console.error("Error fetching from Unsplash:", err);
    return [];
  }
}

