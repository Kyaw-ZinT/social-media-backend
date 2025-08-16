# Social Media Clone (Backend)

## 🌟 Project Overview

This is the backend repository for a full-stack social media platform, built with **Node.js, Express.js, and MongoDB**. It serves as the powerful engine behind the application, providing secure and scalable **RESTful APIs** for all frontend functionalities. The architecture is designed with a clear separation of concerns, utilizing a **Service-Controller pattern** for better code organization and maintainability.

## ✨ Key Features

- **Robust RESTful APIs:** A complete set of endpoints for user, post, and interaction management.
- **Secure User Authentication:** Implemented with **JSON Web Tokens (JWT)** for stateless and secure user sessions.
- **Password Hashing:** Passwords are securely hashed using `bcryptjs` before being stored in the database.
- **Cloud-based Image Storage:** Integrates with **Cloudinary** for efficient and reliable image uploads and delivery.
- **Scalable Database Design:** Uses **MongoDB** and **Mongoose** with relational schemas to efficiently handle user profiles, posts, comments, and follower relationships.
- **Clean Architecture:** Code is organized into `controllers`, `services`, `middleware`, and `models` for enhanced readability and future development.

## 🚀 Technologies Used

- **Node.js:** A JavaScript runtime for building the server-side application.
- **Express.js:** A minimal and flexible Node.js web application framework.
- **MongoDB:** A NoSQL database for efficient and flexible data storage.
- **Mongoose:** An elegant MongoDB object modeling tool for Node.js.
- **JWT (json-webtoken):** For creating and verifying secure tokens for authentication.
- **bcryptjs:** A library for hashing passwords.
- **Cloudinary:** A cloud-based service for image and video management.
- **Nodemon:** A development tool that automatically restarts the server on file changes.

## ⚙️ How to Run Locally

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/social-media-backend.git](https://github.com/your-username/social-media-backend.git)
    cd social-media-backend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
    
3.  **Run the server:**
    ```bash
    npm run dev # or nodemon server.js if you don't have a 'dev' script
    ```
    _The server will run on port `5003` (or the port specified in your `.env` file)._

## 🔗 Live Demo

- **Live API URL:** [https://social-media-backend-ibrq.onrender.com]

_Replace the URL with your actual Render deployment link._

## 📝 API Endpoints (Quick Reference)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Log in and get a JWT token |
| `GET` | `/api/posts` | Get all posts (with pagination) |
| `POST` | `/api/posts` | Create a new post |
| `PUT` | `/api/posts/:id/like` | Like or unlike a post |
| `GET` | `/api/users/:username` | Get a user's profile |
| `PUT` | `/api/users/:username/follow` | Follow or unfollow a user |
| `GET` | `/api/search?q=<query>` | Search for users and posts |

---
_This README is tailored for backend developers and highlights your expertise in building secure, well-structured, and scalable server-side applications._
