const client = require("./client");

const seedData = async () => {
  try {
    await client.query(`
      INSERT INTO users (username, email, password) VALUES
        ('test_user1', 'test1@example.com', 'password123'),
        ('test_user2', 'test2@example.com', 'password123')
      ON CONFLICT DO NOTHING;

      INSERT INTO items (name, description, image_url) VALUES
        ('Item 1', 'Description for Item 1', 'https://via.placeholder.com/150'),
        ('Item 2', 'Description for Item 2', 'https://via.placeholder.com/150')
      ON CONFLICT DO NOTHING;
    `);

    console.log("Seed data inserted successfully!");
  } catch (err) {
    console.error("Error seeding data:", err);
    throw err;
  }
};

module.exports = seedData;
