import { useEffect, useState } from "react";
import { Loader } from "./Loader";
import StarRating from "../StarRating";

// MovieDetails component
export function MovieDetails({ movieId, onAddWatched, watched, onCloseBtn }) {
  // State variables for movie details
  const [isLoading, setIsLoading] = useState(false);
  const [movieDetails, setMovieDetails] = useState("");
  const [rate, setRate] = useState(0);

  // Check if the movie is in the watched list
  const isWatched = watched?.map((movie) => movie.imdbID).includes(movieId);

  // Get user rating for the watched movie
  const watchedUserRating = watched?.find(
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
