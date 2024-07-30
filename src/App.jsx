import { useEffect, useState } from "react";
import { Loader } from "./components/Loader";
import { MovieDetails } from "./components/MovieDetails";
import Navbar from "./components/Navbar";
import Summary from "./components/Summary";
import WatchedMovie from "./components/WatchedMovie";
import ButtonToggle from "./components/ButtonToggle";

// Function to calculate average of an array
const average = (arr) => arr?.reduce((acc, cur) => acc + cur / arr.length, 0);

export default function App() {
  // State variables
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  //Local Storage
  const [watched, setWatched] = useState(() => {
    const storedValue = localStorage.getItem("watched");
    try {
      return storedValue ? JSON.parse(storedValue) : [];
    } catch (error) {
      console.error("Error parsing JSON from localStorage:", error);
      return []; // در صورت بروز خطا، آرایه خالی برگردانید
    }
  });
  // const [watched, setWatched] = useState([]);
  const [isOpen1, setIsOpen1] = useState(true);
  const [isOpen2, setIsOpen2] = useState(true);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imdbID, setImdbId] = useState("");
  // Calculate average IMDb rating, user rating, and runtime for watched movies
  const avgImdbRating = average(watched?.map((movie) => movie?.imdbRating));
  const avgUserRating = average(watched?.map((movie) => movie?.userRating));
  const avgRuntime = average(
    watched?.map((movie) => movie.runtime.slice(0, 3))
  );

  // Function to handle click on a movie
  function handleClickMovie(movieId) {
    setImdbId(movieId);
    return;
  }
  console.log(watched);
  // Function to add a movie to the watched list
  function handleAddWatched(movie) {
    console.log(movie);
    setWatched((currentArr) => [...currentArr, movie]);
  }

  // Function to delete a movie from the watched list
  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  // Function to close the movie details view
  function handleCloseMovie() {
    setImdbId("");
  }
  //Local Storage
  useEffect(
    function () {
      localStorage.setItem("watched", JSON.stringify(watched));
    },
    [watched]
  );
  // Fetch movies based on the query
  useEffect(
    function () {
      const controller = new AbortController();

      async function getMovie() {
        try {
          if (query.length === 0)
            return [setMovies([]), setMessage(""), setImdbId("")];
          if (query.length < 3) {
            setMovies([]);
            setMessage("");
            return;
          }
          setMessage("Loading...");
          setIsLoading(true);
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=37674080&s=${query}`,
            { signal: controller.signal }
          );
          if (!res.ok) throw new Error("Failed Fetch ❗");
          const data = await res.json();

          if (data.Response === "False")
            throw new Error("Cannot find movie ⛔");
          setMovies(data.Search);
          setIsLoading(false);
        } catch (err) {
          if (err.name !== "AbortError") {
            console.log(err.message);
            setMessage(err.message);
          }

          setMovies([]);
        }
      }
      getMovie();
    },
    [query]
  );

  return (
    <>
      {/* Navigation bar */}

      <Navbar movies={movies} query={query} setQuery={setQuery} />
      {/* Main content */}
      <main className="main">
        {/* Box 1: Movie search results */}
        <div className="box">
          <ButtonToggle isOpen={isOpen1} setIsOpen={setIsOpen1} />
          {isOpen1 && (
            <>
              {isLoading && <Loader>{message}</Loader>}
              <ul className="list list-movies">
                {movies?.map((movie) => (
                  <li
                    key={movie.imdbID}
                    onClick={() => handleClickMovie(movie.imdbID)}
                  >
                    <img src={movie.Poster} alt={`${movie.Title} poster`} />
                    <h3>{movie.Title}</h3>
                    <div>
                      <p>
                        <span>🗓</span>
                        <span>{movie.Year}</span>
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* Box 2: Movie details or watched movies */}
        <div className="box">
          <ButtonToggle isOpen={isOpen2} setIsOpen={setIsOpen2} />
          {isOpen2 && imdbID === "" ? (
            <>
              {/* Display statistics for watched movies */}

              <Summary
                avgImdbRating={avgImdbRating}
                avgRuntime={avgRuntime}
                avgUserRating={avgUserRating}
                watched={watched}
              />
              {/* List of watched movies */}
              <WatchedMovie
                handleDeleteWatched={handleDeleteWatched}
                watched={watched}
              />
            </>
          ) : isOpen2 ? (
            // Display movie details when IMDb ID is set
            <MovieDetails
              onCloseBtn={handleCloseMovie}
              movieId={imdbID}
              watched={watched}
              onAddWatched={handleAddWatched}
            />
          ) : (
            false
          )}
        </div>
      </main>
    </>
  );
}
