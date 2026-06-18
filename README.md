# WanderIndia MERN Project

This is a MERN stack travel and tourism website where users can explore popular destinations across India, search for travel packages, view destination details, and submit a booking enquiry.

## Features

- **Search Destinations**: Real-time search by destination name
- **Filter by Category**: Filter destinations by Beach, Mountain, Heritage, or Adventure
- **Destination Detail Page**: Full info with best time to visit, things to do, rating
- **Package Listing**: Tour packages with price, duration, inclusions
- **Booking Form**: Enquiry form with full validation
- **Loading Spinner**: Shows while data is loading
- **Error Handling**: Friendly messages if data fails to load
- **Dark/Light Mode**: Toggle theme using Context API
- **Responsive Design**: Works on mobile, tablet, and desktop

## Tech Stack

- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Frontend**: React.js, React Router, Axios, Context API
- **Styling**: CSS with responsive design

## Project Structure

```
wanderindia/
├── backend/
│   ├── models/
│   │   ├── destination.js
│   │   ├── package.js
│   │   └── booking.js
│   ├── routes/
│   │   ├── destinations.js
│   │   ├── packages.js
│   │   └── bookings.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── DestinationCard.jsx
│   │   │   ├── PackageCard.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── DestinationsPage.jsx
│   │   │   ├── DestinationDetailPage.jsx
│   │   │   ├── PackagesPage.jsx
│   │   │   ├── PackageDetailPage.jsx
│   │   │   ├── BookNowPage.jsx
│   │   │   └── AboutPage.jsx
│   │   ├── context/
│   │   │   └── ThemeContext.jsx
│   │   ├── hooks/
│   │   │   ├── useFetch.js
│   │   │   └── useLocalStorage.js
│   │   ├── data/
│   │   │   ├── destinations.js
│   │   │   └── packages.js
│   │   ├── App.jsx
│   │   ├── index.js
│   │   └── index.css
│   ├── public/
│   │   └── index.html
│   └── package.json
├── .github/
│   └── copilot-instructions.md
└── README.md
```

## Setup

1. **Install Backend Dependencies**:
   ```
   cd backend
   npm install
   ```

2. **Install Frontend Dependencies**:
   ```
   cd frontend
   npm install
   ```

3. **Start MongoDB**:
   Ensure MongoDB is running locally on default port (27017).

4. **Start Backend Server**:
   ```
   cd backend
   npm run dev
   ```
   Server runs on http://localhost:5000

5. **Start Frontend**:
   ```
   cd frontend
   npm start
   ```
   App runs on http://localhost:3000

## API Endpoints

- `GET /api/destinations` - Get all destinations
- `GET /api/destinations/:id` - Get destination by ID
- `GET /api/packages` - Get all packages
- `GET /api/packages/:id` - Get package by ID
- `POST /api/bookings` - Submit booking enquiry

## Pages

1. **Home Page** (`/`): Hero banner, featured destinations, why choose us
2. **Destinations Page** (`/destinations`): All destinations with search and filter
3. **Destination Detail** (`/destinations/:id`): Full info, best time to visit, things to do, rating
4. **Packages Page** (`/packages`): Tour packages with price, duration, inclusions
5. **Package Detail** (`/packages/:id`): Full package detail with day-by-day itinerary
6. **Book Now Page** (`/book`): Booking enquiry form with validation
7. **About Us Page** (`/about`): Company story, team section, contact information