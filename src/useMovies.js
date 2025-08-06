import { useState, useEffect } from "react";
const KEY = "f54f7416";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );
          if (!res.ok)
            throw new Error("Something went wrong while fetching movies");
          const data = await res.json();

          if (data.Response === "False")
            throw new Error("Could not find movie");
          setMovies(data.Search);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") {
            console.error(err.message); // "err.message" where err is the error caught and message is the custom message written
            setError(err.message); // sets the custom error message to be displayed
          }
        } finally {
          // "finally" block runs whatever code in it last
          setIsLoading(false);
        }
      }

      //this stops the fucntion from fetching the movies if there's no query
      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }
      //   handleCloseMovie();
      fetchMovies();
      // Clean up function that aborts abandoned fetch requests. in this case "Keystrokes"
      return function () {
        controller.abort();
      };
    },
    [query] // this effect runs when the query changes or the component mounts
  );
  return { movies, isLoading, error };
}
