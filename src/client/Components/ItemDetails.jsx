import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ReviewList from "./ReviewList";
import ReviewForm from "./ReviewForm";

const ItemDetails = ({ isAuthenticated, currentUserId }) => {
  const { id } = useParams();
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
  }, [id]);

  if (!item) {
    return <p className="text-white">Loading item details...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-bold text-primary mb-2">{item.name}</h2>
      <p className="text-gray-400 mb-4">{item.description}</p>
      {item.image_url && (
        <img
          src={item.image_url}
          alt={item.name}
          className="rounded-lg shadow-md mb-4 max-w-full"
        />
      )}
      <p className="text-lg font-semibold text-gray-300">
        Average Rating:{" "}
        <span className="text-yellow-400">{item.average_rating || "N/A"}</span>
      </p>

      <h3 className="text-2xl font-semibold text-blue-400 mt-6 mb-2">
        Reviews
      </h3>
      <ReviewList
        reviews={reviews}
        setReviews={setReviews}
        // Important: parseInt in case `id` is a string
        itemId={parseInt(id)}
        isAuthenticated={isAuthenticated}
        currentUserId={currentUserId}
      />

      {isAuthenticated && (
        <div className="mt-6">
          <h4 className="text-xl font-semibold text-primary mb-2">
            Add a Review
          </h4>
          <ReviewForm itemId={parseInt(id)} setReviews={setReviews} />
        </div>
      )}
    </div>
  );
};

export default ItemDetails;
