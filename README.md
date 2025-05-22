# Study Front End

This is a full-stack project using TypeScript, JavaScript, and npm. It includes:

- **Express Server:** A backend built with Express that listens on a configurable port and provides an API endpoint.
- **Environment Configuration:** Environment variables managed via a `.env` file and accessed in code from `src/env.ts`.
- **CORS Support:** The server uses CORS middleware to allow requests from a specified client origin.
- **React Frontend:** A React client (assumed from the provided context) that communicates with the Express server.

## Structure

- **server/**
    - **.env:** Contains environment variables such as `PORT` and `CLIENT_ORIGIN`.
    - **src/**
        - **env.ts:** Handles reading environment variables with fallback values.
        - **index.ts:** Sets up the Express server, configures middleware, and defines an API endpoint.
- **.gitignore:** Excludes common development directories like `.idea` and `node_modules`.

## Running the Project

1. **Install dependencies:**
   ```bash
   npm install
   ```
   
2. **Start the server:**
   ```bash 
    npm run start
   ```
   
3. **Access the API:**
   Open your browser and navigate to `http://localhost:PORT/api/welcome` to see the welcome message.

Notes
- The server currently uses a fallback port of 3001 if the environment variable is not set.
- Modify the .env file to change configuration settings such as the server port or client origin.

   
   
