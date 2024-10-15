import React, { useEffect, useState } from "react";
import "../style/favourite.css";
import axios from "axios";

const Favorites = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [jokes, setJokes] = useState({ data: [] }); // Changed to an array
  const [favorites, setFavorites] = useState([]);

  // Handle search submit
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      let data = JSON.stringify({
        sSearchTerm: searchTerm,
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "http://localhost:24800/api/searchjoke",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      const response = await axios.request(config);
      console.log(response.data);
      setJokes(response.data); // Set the jokes state
    } catch (error) {
      console.error("Error fetching jokes:", error);
    }
  };

  // Handle favorite joke
  const handleFavorite = async (joke) => {
    console.log("joke: :::", joke);
    const { sJokeId } = joke; // Get the joke ID

    try {
      let data = JSON.stringify({
        sJokeId: sJokeId,
        bIsFavourite: true,
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "http://localhost:24800/api/insertupdatefavourite",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      await axios.request(config);
    } catch (error) {
      console.log("Error adding favorite:", error);
    }
  };
  const getDadJokes = async () => {
    const response = await axios.post("http://localhost:24800/api/getdadjoke");
    setJokes(response.data);
  };
  useEffect(() => {
    getDadJokes();
  }, []);

  return (
    <div className="container">
      <h1>Dad Jokes Search</h1>

      {/* Search Form */}
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search for dad jokes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-box"
        />
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </form>

      {/* Joke Results */}
      <div className="joke-gallery">
        {jokes.data.length > 0 ? (
          <>
            {jokes.data.map((joke, ind) => (
              <div key={ind} className="joke-image-container">
                <img
                  src={`https://icanhazdadjoke.com/j/${joke.sJokeId}.png`}
                  alt={joke.joke}
                  className="joke-image"
                />
                <button
                  className="btn btn-favorite"
                  onClick={() => handleFavorite(joke)}
                >
                  Favorite
                </button>
              </div>
            ))}
          </>
        ) : (
          <p>No jokes found.</p> // Provide feedback when no jokes are found
        )}
      </div>
    </div>
  );
};

export default Favorites;
