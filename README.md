# Program environment


![Screenshot (95)](https://github.com/hamedaskari/MoviePlatform/assets/63067445/308fa19c-bcbe-4dfd-9c80-939027d53de9)

# Getting Started
"This version is not responsive yet, but I will soon release a responsive version of it."


Sure, here's a brief explanation of how the program works:

# 1. Inputs:
   - The program uses `useState` and `useEffect` from the React library to manage state and perform operations after rendering in the main `App` component.

# 2.`App`:
   - `useState` is used to manage various states in the program, such as user input (`query`), a list of movies (`movies`), a list of watched movies (`watched`), and more.
   - `useEffect` is used to make requests to the OMDB API based on user search (`query`) and to store the watched list in local storage.
   - Various functions are used to manage different features of the program, such as adding and deleting movies from the watched list and displaying movie details.
   - In this component, there are two main sections: searching for movies and displaying details of a movie or the watched list.

# 3. `MovieDetails`:
   - A separate component that displays details of a movie and allows adding it to the watched list.
   - Uses `useState` to manage various states related to displaying movie details and user ratings.
   - Uses `useEffect` to request movie details from the OMDB API.
   - Contains different sections for displaying images, titles, ratings, summaries, actors, and more.

# 4. `Loader`:
   - A simple component to display loading messages like "Loading..."

# To use this program on GitHub, you can follow these steps:

1. Clone or download the program code to your machine.
2. In the project directory, use the following commands:

   ```
   npm install
   npm start
   ```

   These commands will help you install the project and run it in your web browser.

By running this program, you can search for movies, view details of each movie, and add them to your watched list. Additionally, information about the watched list, including the number of movies, average IMDb rating, average user rating, and average runtime, is displayed.

# error handling
In this program, error handling has been thoughtfully implemented to enhance the user experience and robustness of the application. The following scenarios are considered and managed:

1. **API Request Errors:** When making requests to the OMDB API, the program checks for HTTP errors (e.g., 404 Not Found) and handles them gracefully. If there is an issue with the API request, an error message is displayed to the user.

2. **Empty Query:** If the user attempts to search with an empty query, the program prevents unnecessary API requests and provides a user-friendly message.

3. **Short Query:** For queries with fewer than three characters, the program responds by clearing the movie list and displaying a message to inform the user.

4. **Movie Not Found:** If the API response indicates that a movie cannot be found, the program displays an error message to alert the user.

5. **Abort Errors:** When a user navigates away from the page or cancels a pending API request, the program gracefully handles the "AbortError" and prevents any further processing.

These error-handling mechanisms ensure that users receive meaningful feedback and can interact with the application without encountering unexpected issues. This proactive approach to error management enhances the overall user experience and ensures the application's reliability.
