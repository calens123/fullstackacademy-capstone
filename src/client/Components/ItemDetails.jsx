import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Import useParams
import ReviewList from "./ReviewList";
import ReviewForm from "./ReviewForm";

const ItemDetails = ({ isAuthenticated }) => {
  const { id } = useParams(); // Extract id from the route parameters
  const [item, setItem] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchItemAndReviews = async () => {
      try {
        const itemResponse = await fetch(`/api/items/${id}`);
        const itemData = await itemResponse.json();
        setItem(itemData);

        const reviewsResponse = await fetch(`/api/items/${id}/reviews`);
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData);
      } catch (err) {
        console.error("Error fetching item details and reviews:", err);
      }
    };

    fetchItemAndReviews();
  }, [id]); // Include id in the dependency array

  if (!item) {
    return <p>Loading item details...</p>;
  }

  return (
    <div>
      <h2>{item.name}</h2>
      <p>{item.description}</p>
      {item.image_url && <img src={item.image_url} alt={item.name} />}
      <p>Average Rating: {item.average_rating}</p>

      <h3>Reviews</h3>
      <ReviewList
        reviews={reviews}
        setReviews={setReviews}
        itemId={item.id}
        isAuthenticated={isAuthenticated}
      />

      {isAuthenticated && (
        <ReviewForm itemId={item.id} setReviews={setReviews} />
      )}
    </div>
  );
};

export default ItemDetails;
