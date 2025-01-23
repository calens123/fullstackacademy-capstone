import React, { useState, useEffect } from "react";
import { Link, Routes, Route } from "react-router-dom";
import Foo from "./Foo";
import Bar from "./Bar";
import ItemDetails from "./ItemDetails";
import SignUpForm from "./SignUpForm";
import LoginForm from "./LoginForm";

const App = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!sessionStorage.getItem("token")
  );

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    setIsAuthenticated(false);
    alert("You have been logged out.");
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("/api/items");
        if (!response.ok) {
          throw new Error("Failed to fetch items");
        }
        const data = await response.json();
        setItems(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) {
    return <p>Loading items...</p>;
  }

  if (error) {
    return <p>Error fetching items: {error}</p>;
  }

  return (
    <div>
      <h1>40kReviews</h1>
      <nav>
        <Link to="/foo">Foo</Link>
        <Link to="/bar">Bar</Link>
        {isAuthenticated ? (
          <>
            <button onClick={handleLogout}>Log Out</button>
          </>
        ) : (
          <>
            <Link to="/signup">Sign Up</Link>
            <Link to="/login">Log In</Link>
          </>
        )}
      </nav>
      <h2>Items</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <h3>
              <Link to={`/items/${item.id}`}>{item.name}</Link>
            </h3>
            <p>{item.description}</p>
          </li>
        ))}
      </ul>
      <Routes>
        <Route path="/foo" element={<Foo />} />
        <Route path="/bar" element={<Bar />} />
        <Route
          path="/items/:id"
          element={<ItemDetails isAuthenticated={isAuthenticated} />}
        />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/login" element={<LoginForm />} />
      </Routes>
    </div>
  );
};

export default App;
