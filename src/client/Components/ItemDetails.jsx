import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ReviewList from "./ReviewList";
import ReviewForm from "./ReviewForm";

const ItemDetails = ({ isAuthenticated }) => {
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
    return <p>Loading item details...</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold text-primary mb-2">{item.name}</h2>
      <p className="text-gray-600 mb-4">{item.description}</p>
      {item.image_url && (
        <img
          src={item.image_url}
          alt={item.name}
          className="rounded-lg shadow-md mb-4 max-w-full"
        />
      )}
      <p className="text-lg font-semibold text-gray-800">
        Average Rating: {item.average_rating}
      </p>

      <h3 className="text-2xl font-semibold text-primary mt-6 mb-2">Reviews</h3>
      <ReviewList
        reviews={reviews}
        setReviews={setReviews}
        itemId={item.id}
        isAuthenticated={isAuthenticated}
      />

      {isAuthenticated && (
        <div className="mt-6">
          <h4 className="text-xl font-semibold text-primary mb-2">
            Add a Review
          </h4>
          <ReviewForm itemId={item.id} setReviews={setReviews} />
        </div>
      )}
    </div>
  );
};

export default ItemDetails;
