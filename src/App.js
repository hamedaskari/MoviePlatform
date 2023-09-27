import { useEffect, useState } from "react";
import StarRating from "./StarRating";

// Function to calculate average of an array
const average = (arr) => arr.reduce((acc, cur) => acc + cur / arr.length, 0);

export default function App() {
  // State variables
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  //Local Storage
  const [watched, setWatched] = useState(function () {
    const storedValue = localStorage.getItem("watched");
    return JSON.parse(storedValue);
  });

  // const [watched, setWatched] = useState([]);
  const [isOpen1, setIsOpen1] = useState(true);
  const [isOpen2, setIsOpen2] = useState(true);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imdbID, setImdbId] = useState("");
  // Calculate average IMDb rating, user rating, and runtime for watched movies
  const avgImdbRating = average(watched.map((movie) => movie?.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie?.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime.slice(0, 3)));

  // Function to handle click on a movie
  function handleClickMovie(movieId) {
    setImdbId(movieId);
    return;
  }

  // Function to add a movie to the watched list
  function handleAddWatched(movie) {
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
      <nav className="nav-bar">
        <div className="logo">
          <span role="img">🍿</span>
          <h1>usePopcorn</h1>
        </div>
        <input
          className="search"
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <p className="num-results">
          Found <strong>{movies.length}</strong> results
        </p>
      </nav>

      {/* Main content */}
      <main className="main">
        {/* Box 1: Movie search results */}
        <div className="box">
          <button
            className="btn-toggle"
            onClick={() => setIsOpen1((open) => !open)}
          >
            {isOpen1 ? "–" : "+"}
          </button>
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
          <button
            className="btn-toggle"
            onClick={() => setIsOpen2((open) => !open)}
          >
            {isOpen2 ? "–" : "+"}
          </button>
          {isOpen2 && imdbID === "" ? (
            <>
              {/* Display statistics for watched movies */}
              <div className="summary">
                <h2>Movies you watched</h2>
                <div>
                  <p>
                    <span>#️⃣</span>
                    <span>{watched.length} movies</span>
                  </p>
                  <p>
                    <span>⭐️</span>
                    <span>{avgImdbRating.toFixed(1)}</span>
                  </p>
                  <p>
                    <span>🌟</span>
                    <span>{avgUserRating.toFixed(1)}</span>
                  </p>
                  <p>
                    <span>⏳</span>
                    <span>{avgRuntime.toFixed(0)} min</span>
                  </p>
                </div>
              </div>

              {/* List of watched movies */}
              <ul className="list">
                {watched.map((movie) => (
                  <li key={movie.imdbID}>
                    <img src={movie.Poster} alt={`${movie.Title} poster`} />
                    <h3>{movie.Title}</h3>
                    <div>
                      <p>
                        <span>⭐️</span>
                        <span>{movie.imdbRating}</span>
                      </p>
                      <p>
                        <span>🌟</span>
                        <span>{movie.userRating}</span>
                      </p>
                      <p>
                        <span>⏳</span>
                        <span>{movie.runtime}</span>
                      </p>
                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteWatched(movie.imdbID)}
                      >
                        X
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
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

// MovieDetails component
function MovieDetails({ movieId, onAddWatched, watched, onCloseBtn }) {
  // State variables for movie details
  const [isLoading, setIsLoading] = useState(false);
  const [movieDetails, setMovieDetails] = useState("");
  const [rate, setRate] = useState(0);

  // Check if the movie is in the watched list
  const isWatched = watched.map((movie) => movie.imdbID).includes(movieId);

  // Get user rating for the watched movie
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === movieId
  )?.userRating;

  // Destructure movieDetails object for easier access
  const {
    Title: title,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movieDetails;

  // Function to add a movie to the watched list
  function handleAddWatched() {
    const watchedMovie = {
      Title: title,
      Poster: poster,
      imdbID: movieId,
      imdbRating: imdbRating,
      userRating: rate,
      runtime: runtime,
    };
    onAddWatched(watchedMovie);

    setRate(0);
  }

  // Fetch movie details by IMDb ID
  useEffect(
    function () {
      async function getMovieById() {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=37674080&i=${movieId}`
        );

        const data = await res.json();

        setMovieDetails(data);
        setIsLoading(false);
      }
      getMovieById();
    },
    [movieId]
  );

  // Handle closing the movie details view
  useEffect(
    function () {
      function callback(e) {
        if (e.code === "Escape") {
          onCloseBtn();
        }
      }

      document.addEventListener("keydown", callback);

      return function () {
        document.removeEventListener("keydown", callback);
      };
    },
    [onCloseBtn]
  );

  return (
    <div className="details">
      {isLoading ? (
        // Display loading message while fetching movie details
        <Loader>Loading...</Loader>
      ) : (
        <>
          {/* Header section with movie details */}
          <header>
            <button className="btn-back" onClick={onCloseBtn}>
              &larr;
            </button>
            <img alt={`Poster of ${movieDetails} movie`} src={poster} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {" "}
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>

          {/* Movie details section */}
          <section>
            <div className="rating">
              {!isWatched ? (
                // Display star rating component for adding a movie to watched list
                <>
                  <StarRating maxRating={10} size={24} onSetRating={setRate} />
                  {rate > 0 && (
                    <button
                      className="btn-add"
                      onClick={() => handleAddWatched()}
                    >
                      + Add to list
                    </button>
                  )}
                </>
              ) : (
                // Display user rating if the movie is already in the watched list
                <p>
                  You rated with movie {watchedUserRating} <span>⭐️</span>
                </p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}

// Loader component
function Loader({ children }) {
  return <p className="loader">{children}</p>;
}
