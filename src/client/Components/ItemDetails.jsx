import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ItemDetails = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: "", review_text: "" });

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
        console.error(err);
      }
    };

    fetchItemAndReviews();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/items/${id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: 1, // Replace with actual user ID in future
          ...newReview,
        }),
      });
      const createdReview = await response.json();
      setReviews((prev) => [...prev, createdReview]);
      setNewReview({ rating: "", review_text: "" }); // Reset form
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {item ? (
        <>
          <h2>{item.name}</h2>
          <p>{item.description}</p>
          {item.image_url && <img src={item.image_url} alt={item.name} />}
          <p>Average Rating: {item.average_rating}</p>

          <h3>Reviews</h3>
          <ul>
            {reviews.map((review) => (
              <li key={review.id}>
                <p>Rating: {review.rating}</p>
                <p>{review.review_text}</p>
              </li>
            ))}
          </ul>

          <h3>Add a Review</h3>
          <form onSubmit={handleSubmit}>
            <label>
              Rating (1-5):
              <input
                type="number"
                value={newReview.rating}
                onChange={(e) =>
                  setNewReview({ ...newReview, rating: e.target.value })
                }
                min="1"
                max="5"
                required
              />
            </label>
            <br />
            <label>
              Review:
              <textarea
                value={newReview.review_text}
                onChange={(e) =>
                  setNewReview({ ...newReview, review_text: e.target.value })
                }
                required
              />
            </label>
            <br />
            <button type="submit">Submit Review</button>
          </form>
        </>
      ) : (
        <p>Loading item details...</p>
      )}
    </div>
  );
};

export default ItemDetails;
