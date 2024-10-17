import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("food");
  const [jokes, setJokes] = useState([]);

  //fetch categories
  useEffect(() => {
    fetch("https://api.chucknorris.io/jokes/categories")
      .then((response) => response.json())
      .then((data) => setCategories(data));
  }, []);

  //fetch jokes
  useEffect(() => {
    if (selectedCategory) {
      // Fetch all jokes for the selected category
      fetch(
        `https://api.chucknorris.io/jokes/random?category=${selectedCategory}`
      )
        .then((response) => response.json())
        .then((data) => {
          const newJoke = {
            id: data.id,
            joke: data.value,
            category: selectedCategory,
            icon: data.icon_url,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          setJokes((prevJokes) => [...prevJokes, newJoke]);
        });

      // Fetch all jokes for the selected category to load on mount
      fetch(`https://api.chucknorris.io/jokes/search?query=${selectedCategory}`)
        .then((response) => response.json())
        .then((data) => {
          // Assuming 'result' contains the array of jokes
          const allJokes = data.result.map((joke) => ({
            id: joke.id,
            joke: joke.value,
            category: selectedCategory,
            icon: joke.icon_url,
            createdAt: joke.created_at,
            updatedAt: joke.updated_at,
          }));
          setJokes((prevJokes) => [...prevJokes, ...allJokes]);
        });
    }
  }, [selectedCategory]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setJokes([]);
  };

  return (
    <div
      className="App"
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "#e0e0e0",
        padding: "20px",
        minHeight: "100vh",
      }}
    >
      <nav
        style={{
          backgroundColor: "#e0e0e0",
          padding: "10px",
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: 1000,
        }}
      >
        <ul
          style={{
            listStyle: "none",
            display: "flex",
            alignItems: "center",
            padding: "0",
            overflowX: "auto",
            whiteSpace: "nowrap",
          }}
        >
          {categories.map((category) => (
            <li
              key={category}
              style={{
                cursor: "pointer",
                margin: "10px",
                padding: "10px",
              }}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </li>
          ))}
        </ul>
      </nav>
      <div
        style={{
          marginTop: "80px",
          width: "80%",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        {jokes.map((joke, index) => (
          <div
            key={index}
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-start",
            }}
          >
            <img
              src={joke.icon} // The icon URL from the API
              alt="joke icon"
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%", // Circle icon style
                marginRight: "20px", // Space between icon and text
              }}
            />
            <div style={{ flex: 1 }}>
              <h3 style={{ marginBottom: "10px" }}>
                {joke.category.toUpperCase()}
              </h3>
              <p style={{ fontSize: "14px", color: "#888" }}>
                <strong>Joke ID:</strong> {joke.id}
              </p>
              <p style={{ fontSize: "14px", color: "#888" }}>
                <strong>Created At:</strong> {joke.createdAt}
              </p>
              <p style={{ fontSize: "14px", color: "#888" }}>
                <strong>Updated At:</strong>{" "}
                {new Date(joke.updatedAt).toLocaleString()}
              </p>
              <p style={{ marginTop: "10px", fontSize: "16px" }}>{joke.joke}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
