import { useEffect, useState } from "react";
import StarRating from "./StarRating";

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isOpen1, setIsOpen1] = useState(true);
  const [isOpen2, setIsOpen2] = useState(true);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime.slice(0, 3)));
  const [imdbID, setImdbId] = useState("");
  console.log(imdbID);
  function handleClickMovie(movieId) {
    setImdbId(movieId);
    return console.log(movieId);
  }
  function handleAddWatched(movie) {
    setWatched((currentArr) => [...currentArr, movie]);
  }
  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }
  function handleCloseMovie() {
    setImdbId("");
  }
  console.log(watched);
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
          if (!res.ok) throw new Error("Faild Fetch ❗");
          const data = await res.json();

          if (data.Response === "False")
            throw new Error("cannot find movie ⛔");
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

      <main className="main">
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

        <div className="box">
          <button
            className="btn-toggle"
            onClick={() => setIsOpen2((open) => !open)}
          >
            {isOpen2 ? "–" : "+"}
          </button>
          {isOpen2 && imdbID === "" ? (
            <>
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

function MovieDetails({ movieId, onAddWatched, watched, onCloseBtn }) {
  const [isLoading, setIsLoading] = useState(false);
  const [movieDetails, setMovieDetails] = useState("");
  const [rate, setRate] = useState(0);
  const [isUserRated, setIsUserRated] = useState(false);
  const isWatched = watched.map((movie) => movie.imdbID).includes(movieId);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === movieId
  )?.userRating;
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movieDetails;

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
    setIsUserRated(true);
    setRate(0);
  }
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
        <Loader>Loading...</Loader>
      ) : (
        <>
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
          {console.log(isUserRated)}
          <section>
            <div className="rating">
              {!isWatched ? (
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
function Loader({ children }) {
  return <p className="loader">{children}</p>;
}
