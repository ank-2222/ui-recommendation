# UI Recommendation System

A local-first recommendation engine that tracks user behavior and provides personalized recommendations for posts, recipes, and products. All data is stored locally using IndexedDB—no backend required for recommendations.

## Features

- **User Selection & Recommendations**: Select users to log in; frequently used users appear in "Recommended for you"
- **Posts Recommendations**: Like posts to get tag-based recommendations
- **Recipes Recommendations**: Recommendations based on tags, cuisine, and meal type
- **Products Recommendations**: Suggestions using category and tags
- **Analytics Dashboard**: View your activity stats (likes count) for all content types
- **100% Local Storage**: All user preferences and recommendations are stored in IndexedDB on your device
- **Responsive Design**: Works seamlessly on desktop and mobile

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** - Build tool
- **React Router** - Routing
- **TanStack Query** - Data fetching & caching
- **IndexedDB** (via `idb`) - Local storage for recommendations
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **DummyJSON API** - Backend for authentication and content

## How It Works

### 1. User Selection & Login

- Select a user from the list to log in
- Each login is tracked locally (by device ID)
- Frequently used users appear in "Recommended for you" for quick access
- Authentication is handled via DummyJSON's `/auth/login` endpoint

### 2. Recommendations Engine

The recommendation system uses **affinity scoring** based on your likes:

- **Posts**: Tag-based scoring (e.g., if you like posts with tags `["history", "american"]`, you'll see more posts with those tags)
- **Recipes**: Scoring by tags, cuisine, and meal type (e.g., liking Italian recipes increases affinity for `cuisine:Italian`)
- **Products**: Scoring by category and tags (e.g., liking beauty products increases affinity for `category:beauty`)

**How scoring works:**
1. When you like an item, each tag/category/cuisine gets +1 score in your affinity map
2. Recommended items are scored by summing your affinity scores for their tags/attributes
3. Items you've already liked are excluded from recommendations
4. Top-scoring items (up to 6) appear in "Recommended for you"

### 3. Local Storage Architecture

- **IndexedDB** stores:
  - User selection history (for "recommended users")
  - Post likes + tag scores
  - Recipe likes + affinity scores (tags, cuisine, mealType)
  - Product likes + affinity scores (category, tags)
- **localStorage** stores:
  - Anonymous device ID (for user selection tracking before login)

## Project Structure

```
src/
├── API/              # API endpoints configuration
├── components/       # Reusable components (InfoNote, ProtectedRoute, UI components)
├── context/         # React contexts (AuthContext)
├── feature/         # Feature-specific hooks
│   ├── posts/       # useGetPosts, usePostLikes
│   ├── recipes/     # useGetRecipes, useRecipeLikes
│   ├── products/    # useGetProducts, useProductLikes
│   └── user/        # useGetUsers, useLogin
├── interfaces/      # TypeScript type definitions
├── lib/             # Utilities (db setup, deviceId, utils)
├── pages/           # Page components
│   ├── app/         # Dashboard
│   ├── posts/       # Posts listing + recommendations
│   ├── recipes/     # Recipes listing + recommendations
│   ├── products/    # Products listing + recommendations
│   └── user/        # User selection/login page
├── services/        # API service functions
└── store/           # IndexedDB store functions (postStore, recipeStore, productStore, userSelectionStore)
```

## Usage

1. **Login**: Select a user from the list and click "Login". The app authenticates via DummyJSON and stores your selection locally.

2. **Browse Content**: Navigate to Posts, Recipes, or Products from the dashboard.

3. **Like Items**: Click the heart icon on items you enjoy. This updates your affinity scores locally.

4. **View Recommendations**: The "Recommended for you" section shows items matching your preferences (based on tags/categories you've liked).

5. **Check Analytics**: Visit the dashboard to see your activity stats (how many posts, recipes, and products you've liked).

## Key Concepts

### Affinity Scoring

When you like an item:
- **Posts**: Each tag gets +1 score (e.g., `"history": 3` means you've liked 3 posts with the "history" tag)
- **Recipes**: Tags, cuisine (as `cuisine:Italian`), and meal types (as `meal:Dinner`) get +1 each
- **Products**: Category (as `category:beauty`) and tags get +1 each

When scoring recommendations:
- Sum your affinity scores for each item's tags/attributes
- Sort by score (descending)
- Exclude items you've already liked
- Show top 6

### Data Privacy

- All recommendation data is stored locally in IndexedDB
- No data is sent to any server (except DummyJSON for authentication and fetching content)
- Your preferences persist across sessions on the same device
- Clearing browser data will reset your recommendations

## API Endpoints Used

- `GET /users` - Fetch user list
- `POST /auth/login` - Authenticate user
- `GET /posts` - Fetch posts
- `GET /recipes` - Fetch recipes
- `GET /products` - Fetch products

All endpoints use [DummyJSON](https://dummyjson.com).

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Browser Support

- Modern browsers with IndexedDB support (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

**Note**: This is a demonstration project. For production use, consider adding:
- Token refresh logic
- Error boundaries
- Loading states
- Data persistence across browser sessions (if needed)
- User preferences export/import
