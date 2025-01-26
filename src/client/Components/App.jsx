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
      <h1>40kReviews</h1>
      <nav className="flex justify-around items-center py-4 bg-primary text-white shadow-md">
        <Link to="/foo" className="hover:text-accent">
          Foo
        </Link>
        <Link to="/bar" className="hover:text-accent">
          Bar
        </Link>
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className="hover:text-accent">
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="bg-accent text-white py-1 px-3 rounded hover:bg-secondary"
            >
              Log Out
            </button>
          </>
        ) : (
          <>
            <Link to="/sign-in" className="hover:text-accent">
              Sign In
            </Link>
            <Link to="/sign-up" className="hover:text-accent">
              Sign Up
            </Link>
          </>
        )}
      </nav>

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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white shadow-lg rounded-lg p-4"
                    >
                      <h3 className="text-xl font-bold text-primary mb-2">
                        <Link
                          to={`/items/${item.id}`}
                          className="hover:text-accent"
                        >
                          {item.name}
                        </Link>
                      </h3>
                      <p className="text-sm text-gray-600">
                        {item.description}
                      </p>
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="object-cover h-48 w-full rounded mt-2"
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          }
        />
        <Route path="/foo" element={<Foo />} />
        <Route path="/bar" element={<Bar />} />
        <Route
          path="/items/:id"
          element={<ItemDetails isAuthenticated={isAuthenticated} />}
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
