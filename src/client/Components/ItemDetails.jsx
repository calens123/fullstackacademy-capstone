import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ReviewList from "./ReviewList";
import ReviewForm from "./ReviewForm";

const ItemDetails = ({ isAuthenticated }) => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const itemResponse = await fetch(`/api/items/${id}`);
        if (!itemResponse.ok) {
          throw new Error("Failed to fetch item");
        }
        const itemData = await itemResponse.json();
        setItem(itemData);

        const reviewsResponse = await fetch(`/api/items/${id}/reviews`);
        if (!reviewsResponse.ok) {
          throw new Error("Failed to fetch reviews");
        }
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData);
      } catch (err) {
        console.error("Error fetching item details:", err);
      }
    };

    fetchItem();
  }, [id]);

  if (!item) {
    return <p>Loading item details...</p>;
  }

  return (
    <div>
      <h2>{item.name}</h2>
      <p>{item.description}</p>
      {item.image_url && <img src={item.image_url} alt={item.name} />}
      <p>Average Rating: {item.average_rating}</p>

      <ReviewList
        reviews={reviews}
        setReviews={setReviews}
        itemId={id}
        isAuthenticated={isAuthenticated}
      />
      {isAuthenticated && <ReviewForm itemId={id} setReviews={setReviews} />}
    </div>
  );
};

export default ItemDetails;
