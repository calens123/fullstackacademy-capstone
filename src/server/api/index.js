const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const client = require("../db/client"); // Ensure the client is imported

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || "supersecret";

// Test route (already exists)
router.get("/test", async (req, res, next) => {
  res.send("sample api route");
});

// Middleware: Verify Token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.error("Authorization header missing");
    return res.status(401).send({ error: "Authorization required" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Invalid token", err);
    res.status(403).send({ error: "Invalid token" });
  }
};

router.get("/auth/me", verifyToken, async (req, res) => {
  res.send(req.user);
});

// Sign-Up Route
router.post("/auth/signup", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const {
      rows: [user],
    } = await client.query(
      `
      INSERT INTO users (username, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, username, email;
      `,
      [username, email, hashedPassword]
    );

    const token = jwt.sign(
      { id: user.id, username: user.username },
      SECRET_KEY
    );
    res.status(201).send({ token, user });
  } catch (err) {
    console.error("Error during sign-up", err);
    next(err);
  }
});

// Log-In Route
router.post("/auth/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const {
      rows: [user],
    } = await client.query("SELECT * FROM users WHERE email = $1;", [email]);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      console.error("Invalid email or password");
      return res.status(401).send({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      SECRET_KEY
    );
    res.send({
      token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (err) {
    console.error("Error during login", err);
    next(err);
  }
});

// Route: Get all items
// Fetch Items with Pagination
router.get("/items", async (req, res, next) => {
  const { limit = 10, page = 1 } = req.query; // Default: 10 items per page, page 1

  const offset = (page - 1) * limit;

  try {
    const { rows: items } = await client.query(
      `
      SELECT * FROM items
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2;
      `,
      [limit, offset]
    );

    const {
      rows: [{ count }],
    } = await client.query(
      `
      SELECT COUNT(*)::int FROM items;
      `
    );

    res.send({
      items,
      total: count,
      limit: parseInt(limit),
      page: parseInt(page),
    });
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
      console.error("Item not found");
      return res.status(404).send({ error: "Item not found" });
    }
    res.send(item);
  } catch (err) {
    console.error("Error fetching item", err);
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
    console.error("Error fetching reviews", err);
    next(err);
  }
});

// Route: Add a Review
router.post("/items/:itemId/reviews", verifyToken, async (req, res, next) => {
  const { itemId } = req.params;
  const { rating, review_text } = req.body;
  const userId = req.user.id; // Extracted from JWT

  try {
    const {
      rows: [review],
    } = await client.query(
      `
      INSERT INTO reviews (item_id, user_id, rating, review_text)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
      `,
      [itemId, userId, rating, review_text]
    );
    res.status(201).send(review);
  } catch (err) {
    console.error("Error adding review", err);
    next(err);
  }
});

// Route: Edit a Review
router.put(
  "/items/:itemId/reviews/:reviewId",
  verifyToken,
  async (req, res, next) => {
    const { reviewId } = req.params;
    const { rating, review_text } = req.body;
    const userId = req.user.id;

    try {
      const {
        rows: [review],
      } = await client.query(
        `
      UPDATE reviews
      SET rating = $1, review_text = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3 AND user_id = $4
      RETURNING *;
      `,
        [rating, review_text, reviewId, userId]
      );

      if (!review) {
        console.error("Not authorized to edit this review");
        return res
          .status(403)
          .send({ error: "Not authorized to edit this review" });
      }

      res.send(review);
    } catch (err) {
      console.error("Error editing review", err);
      next(err);
    }
  }
);

// Route: Delete a Review
router.delete(
  "/items/:itemId/reviews/:reviewId",
  verifyToken,
  async (req, res, next) => {
    const { reviewId } = req.params;
    const userId = req.user.id;

    try {
      const { rowCount } = await client.query(
        "DELETE FROM reviews WHERE id = $1 AND user_id = $2",
        [reviewId, userId]
      );

      if (rowCount === 0) {
        console.error("Not authorized to delete this review");
        return res
          .status(403)
          .send({ error: "Not authorized to delete this review" });
      }

      res.status(204).send(); // No content
    } catch (err) {
      console.error("Error deleting review", err);
      next(err);
    }
  }
);

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
      console.error("Error fetching comments", err);
      next(err);
    }
  }
);

// Route: Add a Comment to a Review
router.post(
  "/items/:itemId/reviews/:reviewId/comments",
  verifyToken,
  async (req, res, next) => {
    const { reviewId } = req.params;
    const { comment_text } = req.body;
    const userId = req.user.id; // Extracted from the JWT

    try {
      const {
        rows: [comment],
      } = await client.query(
        `
        INSERT INTO comments (review_id, user_id, comment_text)
        VALUES ($1, $2, $3)
        RETURNING *;
        `,
        [reviewId, userId, comment_text]
      );
      res.status(201).send(comment);
    } catch (err) {
      console.error("Error adding comment", err);
      next(err);
    }
  }
);

// Edit a Comment
router.put(
  "/items/:itemId/reviews/:reviewId/comments/:commentId",
  verifyToken,
  async (req, res, next) => {
    try {
      const { commentId } = req.params;
      const { comment_text } = req.body;

      // Verify the comment belongs to the authenticated user
      const {
        rows: [comment],
      } = await client.query(`SELECT * FROM comments WHERE id = $1`, [
        commentId,
      ]);

      if (!comment) {
        return res.status(404).send({ error: "Comment not found" });
      }

      if (comment.user_id !== req.user.id) {
        return res
          .status(403)
          .send({ error: "You do not have permission to edit this comment" });
      }

      // Update the comment
      const {
        rows: [updatedComment],
      } = await client.query(
        `
        UPDATE comments
        SET comment_text = $1, updated_at = NOW()
        WHERE id = $2
        RETURNING *;
        `,
        [comment_text, commentId]
      );

      res.send(updatedComment);
    } catch (err) {
      next(err);
    }
  }
);

// Delete a Comment
router.delete(
  "/items/:itemId/reviews/:reviewId/comments/:commentId",
  verifyToken,
  async (req, res, next) => {
    const { commentId } = req.params;
    const userId = req.user.id;

    try {
      const { rowCount } = await client.query(
        "DELETE FROM comments WHERE id = $1 AND user_id = $2",
        [commentId, userId]
      );

      if (rowCount === 0) {
        console.error("Not authorized to delete this comment");
        return res
          .status(403)
          .send({ error: "Not authorized to delete this comment" });
      }

      res.status(204).send(); // No content
    } catch (err) {
      console.error("Error deleting comment", err);
      next(err);
    }
  }
);

// Fetch User's Reviews
router.get("/users/:userId/reviews", verifyToken, async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (req.user.id !== parseInt(userId)) {
      return res
        .status(403)
        .send({ error: "You are not authorized to view these reviews." });
    }

    const { rows: reviews } = await client.query(
      `
      SELECT reviews.id, reviews.review_text, reviews.rating, items.name AS item_name
      FROM reviews
      JOIN items ON reviews.item_id = items.id
      WHERE reviews.user_id = $1
      `,
      [userId]
    );

    res.send(reviews);
  } catch (err) {
    next(err);
  }
});

// Fetch User's Comments
router.get("/users/:userId/comments", verifyToken, async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (req.user.id !== parseInt(userId)) {
      return res
        .status(403)
        .send({ error: "You are not authorized to view these comments." });
    }

    const { rows: comments } = await client.query(
      `
      SELECT comments.id, comments.comment_text, reviews.review_text AS review_text, items.name AS item_name
      FROM comments
      JOIN reviews ON comments.review_id = reviews.id
      JOIN items ON reviews.item_id = items.id
      WHERE comments.user_id = $1
      `,
      [userId]
    );

    res.send(comments);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
