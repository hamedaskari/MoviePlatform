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
  // eslint-disable-next-line
  const [movies, setMovies] = useState([]);
  // eslint-disable-next-line
  const [watched, setWatched] = useState(tempWatchedData);
  const [isOpen1, setIsOpen1] = useState(true);
  const [isOpen2, setIsOpen2] = useState(true);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  const [imdbID, setImdbId] = useState("");
  function handleClickMovie(movieId) {
    setImdbId(movieId);
    return console.log(movieId);
  }

  useEffect(
    function () {
      async function getMovie() {
        try {
          if (query.length === 0) return [setMovies([]), setMessage("")];
          if (query.length < 3) return;
          setMessage("Loading...");
          setIsLoading(true);
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=37674080&s=${query}`
          );
          if (!res.ok) throw new Error("Faild Fetch ❗");
          const data = await res.json();

          if (data.Response === "False")
            throw new Error("cannot find movie ⛔");
          setMovies(data.Search);
          setIsLoading(false);
        } catch (err) {
          setMessage(err.message);
          console.error(err.message);
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
          {isOpen2 && (
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
                    <span>{avgImdbRating}</span>
                  </p>
                  <p>
                    <span>🌟</span>
                    <span>{avgUserRating}</span>
                  </p>
                  <p>
                    <span>⏳</span>
                    <span>{avgRuntime} min</span>
                  </p>
                </div>
              </div>
              <MovieDetails movieId={imdbID} isLoading={isLoading} />
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
                        <span>{movie.runtime} min</span>
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </main>
    </>
  );
}

function Loader({ children }) {
  return <p className="loader">{children}</p>;
}

function MovieDetails({ isLoading, movieId }) {
  useEffect(
    function () {
      async function getMovieById() {
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=37674080&i=${movieId}`
        );
        const data = await res.json();
        console.log(data);
      }
      getMovieById();
    },

    [movieId]
  );
  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back">&larr;</button>
            <img alt={`Poster of name movie`} />
            <div className="details-overview">
              <h2>Title</h2>
              <p>Description &bull; time</p>
              <p>ganre</p>
              <p>
                <span>⭐️</span>
                9.5 IMDb rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              <>
                <StarRating maxRating={10} size={24} />

                <button className="btn-add">+ Add to list</button>
              </>
            </div>
            <p>
              <em>kirkhar</em>
            </p>
            <p>Starring misha cross</p>
            <p>Directed by christopher nolan</p>
          </section>
        </>
      )}
    </div>
  );
}
