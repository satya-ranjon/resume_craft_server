# ResumeCraft Backend Server

This repository contains the backend server for a ResumeCraft website built using a robust technology stack:

- Express.js
- Node.js
- Mongoose
- MongoDB
- Nodemailer
- Redis
- EJS

## Getting Started

### Prerequisites

- Node.js and npm (or yarn) installed on your system.

### Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/satya-ranjon/resume_craft_server.git
   ```

2. **Install Dependencies:**
   ```bash
   cd resume_craft_server
   npm install
   ```
3. **Start the Server:**
   ```bash
   npm dev
   ```
4. **Set up Environment Variables:**

- Create a `.env` file in the root directory of the project.
- Add the following environment variables to the `.env` file:

## Environment Variables Explanation

Here's a brief explanation of the environment variables required for the server:

- `PORT`: The port on which the server will run.
- `CORS_ORIGIN`: The allowed origin for Cross-Origin Resource Sharing.
- `NODE_DEV`: Environment mode (development, production, etc.).
- `DATABASE_URL`: URL for connecting to the MongoDB database.
- `REDIS_URL`: URL for connecting to the Redis server.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SERVICE`, `SMTP_MAIL`, `SMTP_PASSWORD`: Configuration for the SMTP server for sending emails.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: Configuration for Cloudinary cloud storage.
- `ACTIVATION_SECRET`, `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`: Secrets for generating tokens.
- `ACCESS_TOKEN_EXPIRE`, `REFRESH_TOKEN_EXPIRE`: Token expiration times.
- `EMAIL_VERIFY_NAVIGATE_URL`: URL for navigating after email verification.
- `SCRIBE_SECRET_KEY`: Secret key for Stripe payment integration.
