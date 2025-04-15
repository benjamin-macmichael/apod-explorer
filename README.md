```markdown
# 🌌 APOD Explorer

**APOD Explorer** is a responsive, single-page React TypeScript application that allows users to explore NASA's Astronomy Picture of the Day (APOD) using the official NASA APOD API. Users can view today's image, generate a random APOD, or search by a specific date. In addition, the app also displays news articles related to NASA, sourced from the News API. All of this is presented in a sleek, dark-themed interface with smooth navigation and a responsive design.

---

### Key Features:
- 🌠 View today’s Astronomy Picture of the Day
- 🎲 Generate a random APOD
- 📅 Search APODs by specific date
- 📰 Display NASA-related news articles using the News API
- 📱 Fully responsive with mobile hamburger menu
- 🧭 Navigation via `react-router-dom`

---

## 🛠️ Instructions to Run the Project

### 📦 Prerequisites:
- [Node.js](https://nodejs.org/en/) (v18 or higher recommended)
- npm (included with Node)

### 🧪 Run Locally:

1. **Clone the repository**
   ```bash
   git clone https://github.com/benjamin-macmichael/apod-explorer.git
   cd apod-explorer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create an `.env` file** in the project root with the following:
   ```
   REACT_APP_NASA_API_KEY=your_nasa_api_key_here
   ```

   👉 You can get a free NASA API key at: https://api.nasa.gov

4. **Run the development server**
   ```bash
   npm start
   ```

5. **Visit in your browser**
   ```
   http://localhost:3000
   ```

---

## 🔌 API Used & How Data Is Handled

### NASA Astronomy Picture of the Day (APOD) API
**Endpoint:** `https://api.nasa.gov/planetary/apod`

The app makes GET requests to the APOD API with the following parameters:
- `api_key`: Required key from your `.env` file
- `date`: Optional (for date-based search)

### News API
**Endpoint:** `https://newsapi.org/v2/everything?q=nasa`

The app fetches NASA-related news articles using the News API, making GET requests to the above endpoint with the following parameters:
- `q`: The search term for NASA-related articles (fixed to "nasa").
- `apiKey`: The required key from your `.env` file.
- `pageSize`: Limits the number of articles fetched per request (set to 12).
- `page`: Used for pagination to fetch articles across multiple pages.

### Data Handling Overview:
The application manages state for browsing APOD entries, tracking user interaction with the APOD history, and fetching news articles.

1. **APOD (Astronomy Picture of the Day)**:
   - Represents an individual APOD entry fetched from the NASA API.
   - **State structure**:
     - `title` (string): The title of the APOD.
     - `url` (string): The URL of the image or video.
     - `explanation` (string): A description of the APOD.
     - `media_type` (string): Indicates whether the content is an "image" or "video".
   - Components that use this data: `apod.tsx` and `searchapod.tsx`.

2. **APOD History**:
   - Tracks the browsing history of the user, allowing navigation between previously viewed APODs.
   - **State structure**:
     - `history` (array of ApodData): Stores previously viewed APODs.
     - `currentIndex` (number): The index of the currently displayed APOD within the history.
   - Actions:
     - `ADD_APOD`: Adds a new APOD entry to history while avoiding duplicates.
     - `GO_BACK`: Moves back in history if possible.
     - `GO_FORWARD`: Moves forward in history if possible.

3. **News Articles**:
   - Represents articles fetched from the News API related to NASA.
   - **State structure**:
     - `url` (string): The URL of the full article.
     - `urlToImage` (string or null): The URL of an article’s thumbnail image.
     - `title` (string): The title of the article.
     - `description` (string): A brief summary of the article.
   - Components that use this data:
     - `newscards`: Displays 4 news articles on the home page.
     - `newscardsall`: A dedicated route that fetches and displays more articles for browsing.

### Data Fetching:
- API responses for both the APOD and news articles are fetched using `fetch` in async functions within React components.
- TypeScript interfaces define the shape of the data for each entity.
- Responses are stored in the application state (using React state hooks), allowing users to view APOD entries and news articles, and navigate their history.
- The app uses local storage to prevent repeated API calls if the data does not need to be refreshed, ensuring that browsing history and previously fetched data persist between page reloads.


## 🌟 Additional Features Implemented

- **Local Storage**: Uses local storage to remember previously fetched APOD data, preventing unnecessary API calls when navigating between pages or refreshing the app.

- **Lambda Function for NewsAPI**: Deployed an AWS Lambda function as a proxy to fetch data from the NewsAPI, since direct requests from GitHub Pages were being blocked.
