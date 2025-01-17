const express = require("express");
const router = express.Router();
const client = require("../db/client"); // Ensure the client is imported

module.exports = router;

// Test route (already exists)
router.get("/test", async (req, res, next) => {
  res.send("sample api route");
});

// Route: Get all items
router.get("/items", async (req, res, next) => {
  try {
    const { rows: items } = await client.query("SELECT * FROM items");
    res.send(items);
  } catch (err) {
    next(err);
  }
});

// Route: Get a specific item
router.get("/items/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      rows: [item],
    } = await client.query("SELECT * FROM items WHERE id = $1", [id]);
    if (!item) {
      return res.status(404).send({ error: "Item not found" });
    }
    res.send(item);
  } catch (err) {
    next(err);
  }
});

// Route: Fetch Reviews for an Item
router.get("/items/:id/reviews", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows: reviews } = await client.query(
      "SELECT * FROM reviews WHERE item_id = $1",
      [id]
    );
    res.send(reviews);
  } catch (err) {
    next(err);
  }
});

// Route: Add a Review
router.post("/items/:id/reviews", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { user_id, rating, review_text } = req.body;
    const {
      rows: [review],
    } = await client.query(
      `
      INSERT INTO reviews (item_id, user_id, rating, review_text)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
      `,
      [id, user_id, rating, review_text]
    );
    res.status(201).send(review);
  } catch (err) {
    next(err);
  }
});

// Route: Edit a Review
router.put("/items/:itemId/reviews/:reviewId", async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { rating, review_text } = req.body;
    const {
      rows: [updatedReview],
    } = await client.query(
      `
      UPDATE reviews
      SET rating = $1, review_text = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *;
      `,
      [rating, review_text, reviewId]
    );
    if (!updatedReview) {
      return res.status(404).send({ error: "Review not found" });
    }
    res.send(updatedReview);
  } catch (err) {
    next(err);
  }
});

// Route: Delete a Review
router.delete("/items/:itemId/reviews/:reviewId", async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { rowCount } = await client.query(
      "DELETE FROM reviews WHERE id = $1",
      [reviewId]
    );
    if (rowCount === 0) {
      return res.status(404).send({ error: "Review not found" });
    }
    res.status(204).send(); // No content response
  } catch (err) {
    next(err);
  }
});

// Route: Fetch Comments for a Review
router.get(
  "/items/:itemId/reviews/:reviewId/comments",
  async (req, res, next) => {
    try {
      const { reviewId } = req.params;
      const { rows: comments } = await client.query(
        "SELECT * FROM comments WHERE review_id = $1",
        [reviewId]
      );
      res.send(comments);
    } catch (err) {
      next(err);
    }
  }
);

// Route: Add a Comment to a Review
router.post(
  "/items/:itemId/reviews/:reviewId/comments",
  async (req, res, next) => {
    try {
      const { reviewId } = req.params;
      const { user_id, comment_text } = req.body;
      const {
        rows: [comment],
      } = await client.query(
        `
      INSERT INTO comments (review_id, user_id, comment_text)
      VALUES ($1, $2, $3)
      RETURNING *;
      `,
        [reviewId, user_id, comment_text]
      );
      res.status(201).send(comment);
    } catch (err) {
      next(err);
    }
  }
);
