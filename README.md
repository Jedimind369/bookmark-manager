# Advanced Bookmark Manager

This project is a full-stack application for managing bookmarks with advanced features, built with React, TypeScript, and Node.js.

## Prerequisites

- Node.js (v14 or later)
- MongoDB

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/advanced-bookmark-manager.git
   cd advanced-bookmark-manager
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add the following:
   ```
   MONGODB_URI=mongodb://localhost:27017/bookmark-manager
   JWT_SECRET=your_jwt_secret_here
   PORT=3000
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. Start the development servers:
   ```
   npm run dev
   ```

This will start both the frontend and backend servers concurrently.

## Available Scripts

- `npm run dev`: Starts both frontend and backend servers
- `npm run dev:frontend`: Starts only the frontend server
- `npm run dev:backend`: Starts only the backend server
- `npm run build`: Builds the frontend for production
- `npm run lint`: Runs the linter
- `npm run preview`: Previews the production build
- `npm run test:server`: Runs a test script to check the backend health

## Project Structure

- `/src`: Frontend React application
- `/server`: Backend Node.js server
- `/public`: Static assets

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.