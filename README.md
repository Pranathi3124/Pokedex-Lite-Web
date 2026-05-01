# Pokédex Lite

A modern, responsive Pokédex web application built for the Frontend Developer Assignment. It allows users to browse, search, filter, and favorite Pokémon using data from the public [PokéAPI](https://pokeapi.co/).

## Features
- **Browse & Paginate:** View all Pokémon in a paginated grid.
- **Search:** Instantly search for Pokémon by name.
- **Filter:** Filter Pokémon by their elemental types.
- **Favorites:** Mark your favorite Pokémon and have them persist across reloads (via LocalStorage).
- **Detail View:** Click on any Pokémon to view a detailed modal containing high-resolution images, exact physical dimensions, and base stats.
- **Responsive Design:** Beautiful dark-mode UI that works seamlessly on mobile, tablet, and desktop devices.
- **Subtle Animations:** Smooth hover effects and modal transitions for a premium feel.

## Technologies Used
- **Framework:** [Next.js (App Router)](https://nextjs.org/) & React
- **Language:** JavaScript
- **Styling:** Vanilla CSS Modules (No external UI frameworks like Tailwind used, ensuring full customizability and clean markup).
- **Data Fetching:** Native `fetch` API against PokéAPI.

### Why this stack?
Next.js was chosen to provide a robust, scalable architecture with built-in routing and optimizations. Using standard CSS Modules allowed for creating a highly custom "glassmorphic" dark theme without bloating the bundle with utility classes, demonstrating core styling fundamentals. 

## How to Run Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation
1. Clone the repository:
   ```bash
   git clone <your-repository-url>
   cd pokedex-lite
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production
```bash
npm run build
npm run start
```

## Challenges & Solutions
**Challenge:** The PokéAPI does not natively support server-side pagination combined with arbitrary text search and type filtering. If we relied solely on the server, searching would only filter the current page of 20 items.
**Solution:** To create an "instant" feel, the app fetches a lightweight list of *all* Pokémon names and URLs (~100KB) on initial load. The searching, filtering, and pagination logic is then handled entirely on the client side. Detailed data (like images and stats) is only fetched lazily for the 20 Pokémon currently visible on the page. This guarantees a blazing fast user experience while keeping network payload minimal.
