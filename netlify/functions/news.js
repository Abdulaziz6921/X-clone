export async function handler(event) {
  const API_KEY = process.env.VITE_GNEWS_API_KEY;
  const BASE_URL = "https://gnews.io/api/v4";

  // Extract query params (like ?q=elon)
  const { q } = event.queryStringParameters;

  // Decide which endpoint to use
  const endpoint = q ? "/search" : "/top-headlines";

  // Build final URL
  const url = q
    ? `${BASE_URL}${endpoint}?q=${encodeURIComponent(
        q
      )}&lang=en&max=10&token=${API_KEY}`
    : `${BASE_URL}${endpoint}?lang=en&country=us&max=10&token=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
      headers: {
        "Access-Control-Allow-Origin": "*", // ✅ CORS fix
        "Access-Control-Allow-Methods": "GET",
      },
    };
  } catch (error) {
    console.error("❌ Error fetching news:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to fetch news",
        details: error.message,
      }),
    };
  }
}
