import { fetchFromTMDB } from "../services/tmdb.services.js";

export async function getTrendingMovie(req, res) {
  try {
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/trending/movie/day?language=en-US`
    );

    const randomMovie =
      data.results[Math.floor(Math.random() * data.results.length)];

    res.status(200).json({ success: true, content: randomMovie });
  } catch (error) {
    console.error("Error fetching trending movies:", error);

    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function getMovieTrailers(req, res) {
  const { id } = req.params;

  try {
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`
    );
    res.json({ success: true, trailers: data.results });
  } catch (error) {
    if (error.message.includes("404")) {
      return res.status(404).send(null);
    }
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function getMovieDetails(req, res) {
  const { id } = req.params;
  try {
    const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}?language=en-US`);
    res.status(200).json({ success: true, content: data });
  } catch (error) {
    if (error.message.includes("404")) {
      return res.status(404).send(null);
    }
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function getSimilarMovies(req, res) { 
  const { id } = req.params;
  try {
    
    const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}/similar?language=en-US&page=1`);
    res.status(200).json({ success: true, similar: data.results });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}



export async function getMoviesByCategory(req, res) {
 
  const { category } = req.params; 

  const validCategories = ["popular", "top_rated", "upcoming", "now_playing"];

  if (!validCategories.includes(category)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid category." });
  }

  try {
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/movie/${category}?language=en-US&page=1`
    );

    // Check if data exists and has results
    if (data && data.results) {
      res.status(200).json({ success: true, content: data.results });
    } else {
      res.status(404).json({ success: false, message: "No movies found." });
    }
  } catch (error) {
    console.error("Error fetching movies by category:", error); // Log the error for debugging
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
