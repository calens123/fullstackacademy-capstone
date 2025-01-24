const client = require("./client");

const seedData = async () => {
  try {
    await client.query(`
      INSERT INTO users (username, email, password) VALUES
        ('test_user1', 'test1@example.com', 'password123'),
        ('test_user2', 'test2@example.com', 'password123')
      ON CONFLICT DO NOTHING;

  INSERT INTO items (name, description, image_url)
  VALUES
    ('Item 1', 'Description for Item 1', 'https://via.placeholder.com/150'),
    ('Item 2', 'Description for Item 2', 'https://via.placeholder.com/150'),
    ('Item 3', 'Description for Item 3', 'https://via.placeholder.com/150'),
    ('Item 4', 'Description for Item 4', 'https://via.placeholder.com/150'),
    ('Item 5', 'Description for Item 5', 'https://via.placeholder.com/150'),
    ('Item 6', 'Description for Item 6', 'https://via.placeholder.com/150'),
    ('Item 7', 'Description for Item 7', 'https://via.placeholder.com/150'),
    ('Item 8', 'Description for Item 8', 'https://via.placeholder.com/150'),
    ('Item 9', 'Description for Item 9', 'https://via.placeholder.com/150'),
    ('Item 10', 'Description for Item 10', 'https://via.placeholder.com/150'),
    ('Item 11', 'Description for Item 11', 'https://via.placeholder.com/150'),
    ('Item 12', 'Description for Item 12', 'https://via.placeholder.com/150'),
    ('Item 13', 'Description for Item 13', 'https://via.placeholder.com/150'),
    ('Item 14', 'Description for Item 14', 'https://via.placeholder.com/150'),
    ('Item 15', 'Description for Item 15', 'https://via.placeholder.com/150'),
    ('Item 16', 'Description for Item 16', 'https://via.placeholder.com/150'),
    ('Item 17', 'Description for Item 17', 'https://via.placeholder.com/150'),
    ('Item 18', 'Description for Item 18', 'https://via.placeholder.com/150'),
    ('Item 19', 'Description for Item 19', 'https://via.placeholder.com/150'),
    ('Item 20', 'Description for Item 20', 'https://via.placeholder.com/150')
  ON CONFLICT DO NOTHING;
`);

    console.log("Seed data inserted successfully!");
  } catch (err) {
    console.error("Error seeding data:", err);
    throw err;
  }
};

module.exports = seedData;
