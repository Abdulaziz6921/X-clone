// import axios from "axios";

// const API_KEY = import.meta.env.VITE_GNEWS_API_KEY;
// const BASE_URL = "https://gnews.io/api/v4";

// export const getTrendingNews = async () => {
//   try {
//     const response = await axios.get(`${BASE_URL}/top-headlines`, {
//       params: {
//         token: API_KEY,
//         lang: "en",
//         country: "us",
//         max: 10,
//       },
//     });
//     return response.data.articles;
//   } catch (error) {
//     console.error("Error fetching trending news:", error);
//     // Fallback if the API call fails
//     return [
//       { title: "Technology", description: "Latest in tech innovation" },
//       { title: "Sports", description: "Breaking sports news" },
//       { title: "Politics", description: "Political updates" },
//       { title: "Entertainment", description: "Entertainment buzz" },
//       { title: "Science", description: "Scientific discoveries" },
//     ];
//   }
// };

// /**
//  * Fetching news based on search query
//  */
// export const searchNews = async (query) => {
//   try {
//     const response = await axios.get(`${BASE_URL}/search`, {
//       params: {
//         token: API_KEY,
//         q: query,
//         lang: "en",
//         max: 10,
//       },
//     });
//     return response.data.articles;
//   } catch (error) {
//     console.error(`Error searching news for "${query}":`, error);
//     return [];
//   }
// };
import axios from "axios";

const API_KEY = import.meta.env.VITE_GNEWS_API_KEY;
const BASE_URL = "https://gnews.io/api/v4";
const api = axios.create({ baseURL: BASE_URL });

/**
 * Helper for API requests
 */
const fetchNews = async (endpoint, params = {}) => {
  try {
    const { data } = await api.get(endpoint, {
      params: { token: API_KEY, lang: "en", max: 10, ...params },
    });
    return data.articles || [];
  } catch (error) {
    console.error(`❌ GNews API error: ${error.message}`);
    return [];
  }
};

/**
 * Fetching trending news
 */
export const getTrendingNews = async () => {
  const articles = await fetchNews("/top-headlines", { country: "us" });

  if (!articles.length) {
    // fallback data
    return [
      { title: "Technology", description: "Latest in tech innovation" },
      { title: "Sports", description: "Breaking sports news" },
      { title: "Politics", description: "Political updates" },
      { title: "Entertainment", description: "Entertainment buzz" },
      { title: "Science", description: "Scientific discoveries" },
    ];
  }

  return articles;
};

/**
 * Searching news by query
 */
export const searchNews = (query) => {
  if (!query?.trim()) return [];
  return fetchNews("/search", { q: query });
};
