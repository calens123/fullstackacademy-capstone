import React, { useState, useEffect } from "react";
import { Link, Routes, Route } from "react-router-dom";
import Foo from "./Foo";
import Bar from "./Bar";
import ItemDetails from "./ItemDetails";

const App = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for error

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
        setError(err.message); // Set error state
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchItems();
  }, []);

  if (loading) {
    return <p>Loading items...</p>; // Show while loading
  }

  if (error) {
    return <p>Error fetching items: {error}</p>; // Show if error occurs
  }

  return (
    <div>
      <h1>40kReviews</h1>
      <nav>
        <Link to="/foo">Foo</Link>
        <Link to="/bar">Bar</Link>
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
        <Route path="/items/:id" element={<ItemDetails />} />
      </Routes>
    </div>
  );
};

export default App;
