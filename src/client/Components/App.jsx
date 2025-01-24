import React, { useState, useEffect } from "react";
import { Link, Routes, Route } from "react-router-dom";
import Foo from "./Foo";
import Bar from "./Bar";
import ItemDetails from "./ItemDetails";
import SignInForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import Dashboard from "./Dashboard";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    setIsAuthenticated(false);
    setCurrentUserId(null);
  };

  // Fetch authenticated user on load
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((user) => {
          setIsAuthenticated(true);
          setCurrentUserId(user.id);
        })
        .catch(() => {
          setIsAuthenticated(false);
          setCurrentUserId(null);
        });
    }
  }, []);

  // Fetch items for the homepage
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/items");
        if (!response.ok) {
          throw new Error("Failed to fetch items");
        }
        const data = await response.json();
        setItems(data.items || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  return (
    <div>
      <h1>40kReviews</h1>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/foo">Foo</Link>
        <Link to="/bar">Bar</Link>
        {isAuthenticated ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <button onClick={handleLogout}>Log Out</button>
          </>
        ) : (
          <>
            <Link to="/sign-in">Sign In</Link>
            <Link to="/sign-up">Sign Up</Link>
          </>
        )}
      </nav>

      {/* Define routes for navigation */}
      <Routes>
        {/* Homepage */}
        <Route
          path="/"
          element={
            <>
              <h2>Items</h2>
              {loading ? (
                <p>Loading items...</p>
              ) : error ? (
                <p>Error fetching items: {error}</p>
              ) : (
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
              )}
            </>
          }
        />

        {/* Other routes */}
        <Route path="/foo" element={<Foo />} />
        <Route path="/bar" element={<Bar />} />
        <Route
          path="/items/:id"
          element={<ItemDetails isAuthenticated={isAuthenticated} />}
        />
        <Route path="/sign-in" element={<SignInForm />} />
        <Route path="/sign-up" element={<SignUpForm />} />

        {/* Dashboard */}
        {isAuthenticated && (
          <Route
            path="/dashboard"
            element={
              <Dashboard
                userId={currentUserId}
                isAuthenticated={isAuthenticated}
              />
            }
          />
        )}
      </Routes>
    </div>
  );
};

export default App;
