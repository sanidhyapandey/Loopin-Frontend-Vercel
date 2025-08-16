# Loopin Frontend

This is the frontend for the Loopin project, built with Next.js, TypeScript, and Tailwind CSS.

## Features
- Next.js app directory structure
- TypeScript for type safety
- Tailwind CSS for styling
- Modular component structure
- API routes for authentication and emails

## Getting Started

### Prerequisites
- Node.js (v18 or above recommended)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd loopin-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Running the Development Server
```bash
npm run dev
# or
yarn dev
```
Open [http://localhost:3000](http://localhost:3000) to view the app.

### Building for Production
```bash
npm run build
npm start
# or
yarn build
yarn start
```

### Environment Variables
Create a `.env` file in the root directory and add your environment variables as needed. Example:
```
NEXT_PUBLIC_API_URL=https://api.example.com
```

## Project Structure
- `app/` - Main application pages and API routes
- `components/` - Reusable React components
- `lib/` - Utility libraries
- `types/` - TypeScript type definitions

## Scripts
- `dev` - Start development server
- `build` - Build for production
- `start` - Start production server

## License
MIT
