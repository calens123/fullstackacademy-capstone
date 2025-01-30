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
  const [sortOrder, setSortOrder] = useState("desc"); // Default to newest first

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
  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/items?sort=${sortOrder}`);
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

  useEffect(() => {
    fetchItems();
  }, [sortOrder]);

  return (
    <div>
      <div className="bg-primary text-white shadow-md py-4">
        <div className="container mx-auto flex justify-between items-center px-6">
          <Link
            to="/"
            className="text-4xl font-bold text-accent hover:text-accent-light transition duration-300"
          >
            40kReviews
          </Link>
          <nav className="flex space-x-4">
            <Link to="/foo" className="hover:underline">
              Foo
            </Link>
            <Link to="/bar" className="hover:underline">
              Bar
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="hover:underline">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="hover:underline bg-secondary px-4 py-2 rounded-md text-white"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link to="/sign-in" className="hover:underline">
                  Sign In
                </Link>
                <Link to="/sign-up" className="hover:underline">
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>

      <Routes>
        <Route
          path="/"
          element={
            <>
              <h2>Items</h2>
              <label>
                Sort by:
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="desc">Newest to Oldest</option>
                  <option value="asc">Oldest to Newest</option>
                </select>
              </label>
              {loading ? (
                <p>Loading items...</p>
              ) : error ? (
                <p>Error fetching items: {error}</p>
              ) : (
                <ul className="item-grid">
                  {items.map((item) => (
                    <li key={item.id} className="item-card">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="item-thumbnail"
                      />
                      <h3 className="item-title">
                        <Link
                          to={`/items/${item.id}`}
                          className="hover:text-accent"
                        >
                          {item.name}
                        </Link>
                      </h3>
                      <p className="item-description">{item.description}</p>
                    </li>
                  ))}
                </ul>
              )}
            </>
          }
        />
        <Route path="/foo" element={<Foo />} />
        <Route path="/bar" element={<Bar />} />
        <Route
          path="/items/:id"
          element={
            <ItemDetails
              isAuthenticated={isAuthenticated}
              currentUserId={currentUserId} // ✅ Pass currentUserId
            />
          }
        />

        <Route
          path="/sign-in"
          element={
            <SignInForm
              setIsAuthenticated={setIsAuthenticated}
              setCurrentUserId={setCurrentUserId}
            />
          }
        />

        <Route path="/sign-up" element={<SignUpForm />} />
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
