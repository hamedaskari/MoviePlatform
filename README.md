# Getting Started with Create React App
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

