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
