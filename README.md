# 🏡 WanderLust – Vacation Rental Platform

WanderLust is a full-stack web application inspired by Airbnb that allows users to explore vacation rentals, create property listings, and share their experiences through reviews. It provides a platform for discovering places to stay, managing listings, and exploring destinations through an interactive map.

## ✨ Features

- **User Authentication:** Register, log in, and manage authenticated sessions.
- **Property Listings:** Create, view, edit, and delete vacation rental listings.
- **Image Management:** Display property images using image URLs.
- **Reviews & Ratings:** Add, view, and manage reviews for listings.
- **Search & Filtering:** Search for properties and filter available listings.
- **Interactive Maps:** View property locations using Mapbox.
- **Responsive UI:** Browse listings on desktop and mobile devices.
- **Form Validation:** Validate user input before processing listing and review submissions.
- **Flash Messages:** Display feedback for successful actions and errors.
- **Error Handling:** Handle application errors through centralized error-handling middleware.

## 🛠️ Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript
- EJS (Embedded JavaScript Templates)
- Bootstrap 5

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### APIs & Tools
- Mapbox for interactive maps
- Git and GitHub for version control
- npm for package management

## 📁 Project Structure

```text
MajorProject/
├── controllers/       # Application business logic
├── init/              # Database initialization scripts
├── models/            # Mongoose schemas and models
├── public/            # CSS, JavaScript, and static assets
├── routes/            # Express routes
├── utils/             # Utility functions and error handlers
├── views/             # EJS templates
├── app.js             # Main application entry point
├── middleware.js      # Custom middleware
├── schema.js          # Request validation schemas (if present)
├── package.json       # Project dependencies and scripts
├── package-lock.json  # Dependency lockfile
├── .env               # Environment variables (not committed)
└── README.md          # Project documentation
```

*Note: The directory structure may vary depending on your current implementation.*

## ⚙️ Installation & Setup

### Prerequisites

Install the following before running the project:

- [Node.js](https://nodejs.org/)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) or a MongoDB Atlas database
- [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/YakshJakharia06/wanderlust.git
```

### 2. Navigate to the Project Directory

```bash
cd wanderlust
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory and add the environment variables required by your application.

```env
ATLASDB_URL=your_mongodb_connection_string
SECRET=your_session_secret
MAP_TOKEN=your_mapbox_public_token
```

Replace the example values with your actual credentials. The variable names must match those used in your source code.

If your application uses a different MongoDB variable, such as `MONGODB_URL`, use that name instead.

**Security:** Never commit your `.env` file, database credentials, session secrets, or API tokens to GitHub.

### 5. Start the Application

Run the command configured in your `package.json`. For a typical Express application:

```bash
node app.js
```

If you have installed Nodemon, you can use:

```bash
nodemon app.js
```

Open your browser at:

```text
http://localhost:3000
```

## 🗺️ Mapbox Configuration

WanderLust uses Mapbox to display interactive maps and property locations.

1. Create an account on [Mapbox](https://www.mapbox.com/).
2. Generate an appropriate public access token.
3. Add the token to your `.env` file using the environment variable expected by your application.
4. Restart the server after changing environment variables.

Do not expose private access tokens or server-side secrets in client-side code.

## 🗄️ Database Configuration

WanderLust uses MongoDB to store application data, including property listings and reviews.

You can use either:

- **Local MongoDB:** Run MongoDB Community Server on your computer.
- **MongoDB Atlas:** Connect to a cloud-hosted MongoDB cluster.

Ensure that your connection string, database permissions, and environment variable names are configured correctly before starting the application.

## 🔒 Security

- Store secrets and credentials in environment variables.
- Keep `.env` out of version control.
- Validate user input on the server.
- Protect listing and review modification routes with authentication and authorization.
- Use secure session configuration when deploying to production.

## 🚀 Future Improvements

- Advanced location-based search and filtering.
- Sorting by price, rating, and popularity.
- Booking and reservation functionality.
- User profiles and wishlists.
- Image uploads through a cloud storage service.
- Payment gateway integration.
- Deployment with a production database and environment configuration.

## 👨‍💻 Author

**Yaksh Jakharia**

GitHub: [@YakshJakharia06](https://github.com/YakshJakharia06)

Project Repository: [WanderLust](https://github.com/YakshJakharia06/wanderlust)

## 📄 License

This project is developed for educational and portfolio purposes. Add an appropriate open-source license if you intend to distribute the project under specific reuse terms.

---

⭐ If you find this project interesting, consider giving the repository a star!