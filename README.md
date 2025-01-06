# Setup

- create database uni_fullstack_template_db
- npm install
- npm run dev

---

# Deployment

- set DATABASE_URL as environment variable
- set SYNC to TRUE as environment variable in order to sync and seed database
- set NODE_VERSION to 19.8.1

- build command
  - npm install && npm run build
- start command
  - npm run start

---

![schema](https://github.com/user-attachments/assets/d337c821-2318-44de-b68e-c3a6c365d7ee)

# Project Plan

Day 1-2: Planning & Setup

    Create GitHub Repository: Initialize the project and set up a Kanban board for tracking progress.
    Design Database Schema: Map out your database tables and relationships (see below).
    Seed Database: Generate mock data for users, items, reviews, and comments.
    Set Up Backend:
        Create the Express app.
        Set up routes for Tier 1 requirements.
        Implement authentication (JWT-based).

Day 3-6: Backend Functionality

    User Management: Sign-up, log-in, and account management endpoints.
    Item Routes: Endpoints to fetch items, search for items, and fetch specific item details.
    Review Routes:
        Create, edit, delete reviews.
        Enforce "one review per item per user" constraint.
    Comment Routes:
        Add, edit, delete comments.
        Link comments to reviews and users.
    Test API: Use Postman to test all endpoints.

Day 7-11: Frontend Setup

    Set Up React App: Configure the project structure.
    Build Pages:
        Home: Browse items and reviews.
        Item Details: View item-specific reviews and details.
        Login/Signup: Forms for authentication.
        User Dashboard: Display user’s reviews and comments.
    Connect to Backend: Use axios or fetch for API calls.

Day 12-14: Testing & Deployment

    Test Frontend: Verify full-stack integration.
    Bug Fixing: Debug and ensure stability.
    Deploy: Use Netlify for the frontend and Render/Heroku for the backend.

---

# Database Schema

    Users
        id: Primary Key
        username: Unique, String
        email: Unique, String
        password: Hashed, String
        created_at: Timestamp

    Items
        id: Primary Key
        name: String
        description: Text
        image_url: String
        average_rating: Float
        created_at: Timestamp

    Reviews
        id: Primary Key
        item_id: Foreign Key → Items.id
        user_id: Foreign Key → Users.id
        rating: Integer (1-5)
        review_text: Text
        created_at: Timestamp
        updated_at: Timestamp

    Comments
        id: Primary Key
        review_id: Foreign Key → Reviews.id
        user_id: Foreign Key → Users.id
        comment_text: Text
        created_at: Timestamp
        updated_at: Timestamp

    Seeds
        Users: At least 10 users with hashed passwords.
        Items: 50+ items (painted miniatures).
        Reviews: 100+ reviews tied to various items and users.
        Comments: 200+ comments tied to reviews.

## ![output(1)](https://github.com/user-attachments/assets/b1b18db3-e1fe-4a3d-968e-28a58c1f1f7a)

# Project board data:

Columns:

    Backlog: Tasks to be addressed in the future.
    To Do: Tasks planned for immediate work.
    In Progress: Tasks currently being worked on.
    In Review: Completed tasks pending review.
    Done: Completed and approved tasks.

Tasks:

    Task: Initialize GitHub Repository
        Summary: Set up the project repository and Kanban board.
        Done Criteria:
            Repository created.
            Kanban board set up with columns: Backlog, To Do, In Progress, In Review, Done.

    Task: Design Database Schema
        Summary: Create the database schema for the application.
        Done Criteria:
            ER diagram created.
            Schema reviewed and approved.

    Task: Seed Database
        Summary: Populate the database with mock data.
        Done Criteria:
            Database seeded with users, items, reviews, and comments.
            Verified data integrity.

    Task: Set Up Express Backend
        Summary: Initialize the Express application.
        Done Criteria:
            Express app created.
            Basic routes established.

    Task: Implement User Authentication
        Summary: Add JWT-based authentication.
        Done Criteria:
            Sign-up and log-in endpoints functional.
            JWT tokens issued upon authentication.

    Task: Develop User Management Endpoints
        Summary: Create endpoints for user account management.
        Done Criteria:
            Endpoints for user profile retrieval and updates implemented.
            Tested with Postman.

    Task: Create Item Routes
        Summary: Develop endpoints for item operations.
        Done Criteria:
            Endpoints for fetching, searching, and viewing item details implemented.
            Tested with Postman.

    Task: Implement Review Functionality
        Summary: Develop review-related endpoints.
        Done Criteria:
            Endpoints for creating, editing, deleting reviews implemented.
            "One review per item per user" constraint enforced.

    Task: Implement Comment Functionality
        Summary: Develop comment-related endpoints.
        Done Criteria:
            Endpoints for adding, editing, deleting comments implemented.
            Comments linked to reviews and users.

    Task: Set Up React Frontend
        Summary: Initialize the React application.
        Done Criteria:
            React app created.
            Project structure configured.

    Task: Build Home Page
        Summary: Develop the home page for browsing items and reviews.
        Done Criteria:
            Home page UI implemented.
            Integrated with backend to display data.

    Task: Build Item Details Page
        Summary: Develop the item details page.
        Done Criteria:
            Item details UI implemented.
            Displays item-specific reviews and information.

    Task: Build Authentication Pages
        Summary: Develop login and signup pages.
        Done Criteria:
            Login and signup forms implemented.
            Integrated with authentication endpoints.

    Task: Build User Dashboard
        Summary: Develop the user dashboard.
        Done Criteria:
            Dashboard UI implemented.
            Displays user's reviews and comments.

    Task: Connect Frontend to Backend
        Summary: Integrate frontend with backend APIs.
        Done Criteria:
            API calls implemented using axios or fetch.
            Data flows correctly between frontend and backend.

    Task: Test Full-Stack Integration
        Summary: Ensure frontend and backend work seamlessly together.
        Done Criteria:
            End-to-end testing completed.
            Identified issues resolved.

    Task: Deploy Application
        Summary: Deploy the application to production.
        Done Criteria:
            Frontend deployed on Netlify.
            Backend deployed on Render/Heroku.
            Application accessible via the internet.

Implementation Steps:

    Create Issues: For each task, create an issue in your GitHub repository with the summary and done criteria.
    Assign Tasks: Assign each issue to team members as appropriate.
    Set Milestones: Group related tasks into milestones corresponding to project phases.
    Track Progress: Move issues across the Kanban board as work progresses.
