export async function handler(event) {
  const API_KEY = process.env.VITE_GNEWS_API_KEY;
  const BASE_URL = "https://gnews.io/api/v4";

  // Get all query parameters, not just q
  const params = new URLSearchParams(event.queryStringParameters || {});
  const q = params.get("q");

  // Decide endpoint
  const endpoint = q ? "/search" : "/top-headlines";

  // Build the full URL dynamically
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.search = params.toString(); // includes q, country, etc.
  url.searchParams.set("token", API_KEY);
  url.searchParams.set("lang", "en");
  url.searchParams.set("max", "10");
  if (!q) url.searchParams.set("country", "us");

  try {
    const response = await fetch(url.toString());
    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
      headers: {
        "Access-Control-Allow-Origin": "*",
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
