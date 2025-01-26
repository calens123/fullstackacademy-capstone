const client = require("../client");

const seedData = async () => {
  try {
    // Clear reviews and comments only (keep items intact)
    await client.query("DELETE FROM reviews;");
    await client.query("DELETE FROM comments;");

    // Reset ID sequences for reviews and comments
    await client.query("ALTER SEQUENCE reviews_id_seq RESTART WITH 1;");
    await client.query("ALTER SEQUENCE comments_id_seq RESTART WITH 1;");

    // Seed users
    await client.query(`
      INSERT INTO users (id, username, email, password) VALUES
        (1, 'user1', 'user1@example.com', 'password123'),
        (2, 'user2', 'user2@example.com', 'password123'),
        (3, 'user3', 'user3@example.com', 'password123')
      ON CONFLICT (id) DO NOTHING;
    `);

    console.log("Users seeded successfully!");

    // Seed reviews for existing items
    await client.query(`
      INSERT INTO reviews (item_id, user_id, rating, review_text) VALUES
        (359, 1, 5, 'This is the best Space Marine I have ever seen!'),
        (360, 2, 4, 'A great Ork figure, very detailed.'),
        (361, 3, 3, 'The Necron is okay but could use more highlights.'),
        (362, 1, 4, 'Eldar warrior looks amazing!'),
        (363, 2, 5, 'The Chaos Marine is incredible!');
    `);

    console.log("Reviews seeded successfully!");

    // Seed comments for the reviews
    await client.query(`
      INSERT INTO comments (review_id, user_id, comment_text) VALUES
        (1, 2, 'I totally agree, it looks fantastic!'),
        (1, 3, 'Amazing detail on this figure.'),
        (2, 1, 'The green really pops on this Ork!'),
        (3, 2, 'I think the highlights look fine.'),
        (4, 3, 'The Eldar is so sleek.'),
        (5, 1, 'The Chaos Marine looks menacing!');
    `);

    console.log("Comments seeded successfully!");
  } catch (err) {
    console.error("Error seeding data:", err);
    throw err;
  }
};

module.exports = seedData;
