# Weather App — Project Guide

A responsive weather forecasting application built with React + Vite.  
Search any city to see current weather conditions and a 5-day forecast.

---

## 📁 Project Structure

```
weather-app/
├── index.html              ← HTML entry point
├── package.json            ← Dependencies & scripts
├── vite.config.js          ← Vite configuration
├── .env.example            ← Template for API key
├── .env                    ← Your actual API key (create this!)
├── .gitignore              ← Keeps .env and node_modules out of git
└── src/
    ├── main.jsx            ← React entry point
    ├── App.jsx             ← Main component (state management)
    ├── App.css             ← All styles (design tokens, responsive)
    ├── components/
    │   ├── SearchBar.jsx       ← City search input + button
    │   ├── CurrentWeather.jsx  ← Current weather display card
    │   ├── Forecast.jsx        ← 5-day forecast section
    │   ├── WeatherCard.jsx     ← Single forecast day card
    │   ├── Loader.jsx          ← Loading spinner
    │   └── ErrorMessage.jsx    ← Error display with dismiss
    └── services/
        └── weatherApi.js       ← API fetch functions (no React code)
```

---

## 🔑 How to Add Your API Key

### Step 1: Get a Free API Key

1. Go to [https://www.weatherapi.com/](https://www.weatherapi.com/)
2. Click **Sign Up** and create a free account
3. Go to your **Dashboard** → copy your API key
4. The free tier is sufficient for this project

### Step 2: Create `.env` File

In the **project root** (same level as `package.json`), create a file named `.env`:

```env
VITE_WEATHER_API_KEY=your_actual_api_key_here
```

Replace `your_actual_api_key_here` with the key you copied.

> ⚠️ **Never commit `.env` to git.** It's already in `.gitignore`.

### How It Works

- Vite exposes environment variables prefixed with `VITE_` through `import.meta.env`
- The API service reads `import.meta.env.VITE_WEATHER_API_KEY`
- If the key is missing, the app shows a clear error message

---

## 🚀 How to Run

```bash
# 1. Install dependencies
npm install

# 2. Create your .env file with API key (see above)

# 3. Start the dev server
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

---

## 🧪 How to Test

### ✅ Valid City
- Type "London" or "New York" → click Search
- You should see current weather + 5-day forecast

### ❌ Invalid City
- Type "asdfjkl" → click Search
- You should see: `City "asdfjkl" not found. Please check the spelling.`

### 🌐 Network Error
- Disconnect from the internet → search any city
- You should see: `Network error. Please check your internet connection.`

### 🔑 Invalid API Key
- Change the key in `.env` to "invalidkey123" → restart dev server → search
- You should see: `Invalid API key. Please check your configuration.`

### 📱 Mobile Responsiveness
- Open browser DevTools → toggle device toolbar (Ctrl+Shift+M)
- Test at these widths:
  - **Desktop**: 1024px+ — dashboard layout
  - **Tablet**: 768px — adjusted grid
  - **Mobile**: 375px — stacked layout, full-width search button

---

## 🏗️ Architecture Overview

### Data Flow

```
User types city → clicks Search
     ↓
App.handleSearch() called
     ↓
Sets loading=true, error=null
     ↓
Calls weatherApi.fetchCurrentWeather() + fetchForecast() in parallel
     ↓
On success → stores data in state → components render results
On error → stores error message → ErrorMessage renders
     ↓
Sets loading=false
```

### Component Hierarchy

```
App
├── SearchBar         (user input)
├── ErrorMessage      (conditional)
├── Loader            (conditional)
├── CurrentWeather    (conditional)
│   └── weather details grid
├── Forecast          (conditional)
│   └── WeatherCard × 5
└── Default/Empty state (conditional)
```

### API Service Separation

`weatherApi.js` contains **only** fetch logic — no React code.  
This makes it easy to:
- Replace the API provider later
- Write unit tests for the API layer
- Reuse the same logic if you add more features

---

## 📋 Features Checklist

- [x] City search with input validation
- [x] Current weather display (temp, feels-like, humidity, wind, pressure, visibility)
- [x] 5-day forecast with weather icons
- [x] Loading state with spinner
- [x] Error handling (invalid city, API errors, network errors)
- [x] Default welcome state
- [x] Empty results state
- [x] Responsive design (desktop, tablet, mobile)
- [x] Environment variable for API key
- [x] Clean component structure
- [x] Separated API service layer

---

## 🔧 API Details

**Provider**: WeatherAPI.com (free tier)

| Endpoint | Purpose | URL |
|----------|---------|-----|
| Current Weather | `/v1/current.json` | City + temp + conditions |
| Forecast | `/v1/forecast.json` | Daily forecast (up to 3 days on free tier) |

**Units**: Metric (°C, km/h)

---

## 💡 Tips for Your Internship Submission

1. **Write a README.md** describing what the app does, how to run it, and what you learned
2. **Add screenshots** of the app in different states (desktop + mobile)
3. **Mention technologies used**: React, Vite, OpenWeatherMap API, CSS
4. **Highlight key decisions**: Why you separated API logic, how you handle errors, responsive approach
