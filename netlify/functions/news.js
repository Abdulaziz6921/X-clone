import fetch from "node-fetch";

export async function handler(event) {
  const API_KEY = process.env.VITE_GNEWS_API_KEY;
  const BASE_URL = "https://gnews.io/api/v4/top-headlines";

  try {
    const response = await fetch(
      `${BASE_URL}?token=${API_KEY}&lang=en&country=us&max=10`
    );
    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Error fetching news:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to fetch news",
        details: error.message,
      }),
    };
  }
}
