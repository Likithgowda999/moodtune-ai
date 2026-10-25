# 🎵 MoodTune AI

**AI-Based Facial Expression Music Recommendation System Using React.js, Node.js and YouTube API**

A full-stack web application that detects your facial expression directly in
your browser, maps it to a mood, and recommends YouTube music that matches
how you feel — with manual mood, language, and genre controls as well.

---

## 1. Technology Stack

**Frontend:** React.js (Vite), JavaScript, HTML5, CSS3, `react-webcam`, `face-api.js`
**Backend:** Node.js, Express.js, Axios, dotenv, YouTube Data API v3
**Database:** None required — this is a stateless recommendation proxy.

All facial-expression AI runs **entirely in the browser**. No Python, no
ML server, no video/image is ever uploaded anywhere.

---

## 2. Project Structure

```
emotion-music-recommender/
├── frontend/
│   ├── public/models/        ← face-api.js model weights go here (see below)
│   ├── src/
│   │   ├── components/       Camera, EmotionResult, MusicCard, MusicList,
│   │   │                     MoodSelector, LanguageSelector, GenreSelector,
│   │   │                     NowPlaying
│   │   ├── services/api.js
│   │   ├── App.jsx / App.css / main.jsx
│   │   └── ...
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── controllers/youtubeController.js
│   │   ├── routes/youtubeRoutes.js
│   │   ├── utils/queryBuilder.js
│   │   └── server.js
│   ├── .env / .env.example
│   └── package.json
└── README.md
```

---

## 3. Getting a YouTube Data API v3 Key

1. Go to https://console.cloud.google.com/
2. Create a new project (or select an existing one).
3. Go to **APIs & Services → Library**, search for **YouTube Data API v3**, and click **Enable**.
4. Go to **APIs & Services → Credentials → Create Credentials → API Key**.
5. Copy the generated key.

Open `backend/.env` and paste it in:

```env
PORT=5000
YOUTUBE_API_KEY=PASTE_YOUR_KEY_HERE
CLIENT_URL=http://localhost:5173
```

**Never put this key in the frontend.** It stays in the backend `.env`
file only, and the backend proxies all YouTube requests.

---

## 4. Downloading the face-api.js Models

The browser-based AI needs pre-trained model files that are too large to
bundle with source code. Full step-by-step instructions (with direct
download links) are in:

```
frontend/public/models/README.txt
```

Short version: download these 4 files from the official face-api.js repo
and place them in `frontend/public/models/`:
- `tiny_face_detector_model-weights_manifest.json`
- `tiny_face_detector_model-shard1`
- `face_expression_model-weights_manifest.json`
- `face_expression_model-shard1`

Without these files, the camera panel shows a friendly error, but
**everything else still works** (manual mood selection, language, genre,
YouTube search, and playback).

---

## 5. Installation & Running

### Step 1 — Install backend dependencies
```bash
cd backend
npm install
```

### Step 2 — Add your YouTube API key
Edit `backend/.env` as described in section 3 above.

### Step 3 — Start the backend
```bash
npm run dev
```
You should see: `MoodTune AI backend listening on http://localhost:5000`

### Step 4 — Test the backend (optional, in a new terminal)
```bash
curl "http://localhost:5000/api/health"
curl "http://localhost:5000/api/youtube/search?emotion=happy&language=English&genre=All"
```

### Step 5 — Install frontend dependencies (in a new terminal)
```bash
cd frontend
npm install
```

### Step 6 — Download the face-api.js models
See section 4 above.

### Step 7 — Start the frontend
```bash
npm run dev
```

### Step 8 — Open the app
```
http://localhost:5173
```

Allow camera access when prompted, or use **Manual Mood Selection** if
you'd rather not use the camera.

---

## 6. Application Flow

```
User opens website
      ↓
Camera permission requested
      ↓
Webcam starts
      ↓
Browser-based AI (face-api.js) detects face
      ↓
Facial expression is recognized + confidence shown
      ↓
Mood is mapped to a music style
      ↓
React sends the mood (not the video) to the Node.js backend
      ↓
Node.js calls the YouTube Data API v3
      ↓
YouTube results are returned to React
      ↓
React displays recommended music cards
      ↓
User clicks Play → video plays in the embedded YouTube player
```

API optimization: the frontend only calls the backend when the
*effective mood* (or language/genre) actually changes — repeated
identical detections ("happy, happy, happy...") do not trigger repeated
YouTube API calls.

---

## 7. Final-Year Project Documentation

### 7.1 Abstract
MoodTune AI is a full-stack web application that bridges affective
computing and music recommendation. Using a browser-based deep-learning
model (face-api.js), the system detects a user's facial expression in
real time through their webcam and recommends music from YouTube that
matches their emotional state. The system requires no server-side
machine learning infrastructure, keeping the architecture lightweight,
privacy-respecting, and easy to deploy.

### 7.2 Problem Statement
Music streaming platforms typically require users to manually search
for or curate playlists that match their current mood. This is a
passive, effortful process that does not adapt to how a person is
actually feeling in the moment. There is a need for a system that can
sense a user's emotional state directly and proactively recommend
suitable music without manual searching.

### 7.3 Objectives
- Detect facial expressions in real time using a browser-based model.
- Map detected expressions to appropriate music categories.
- Fetch relevant music from a real-world source (YouTube) based on mood.
- Allow manual override of mood, and selection of language and genre.
- Ensure user privacy by never transmitting video or images off-device.
- Optimize network usage by avoiding redundant API calls.

### 7.4 Existing System
Existing music platforms rely on explicit user input: typed searches,
manually created playlists, or collaborative-filtering recommendations
based on listening history. None of these react to a user's real-time
emotional state, and most require an account and prior listening
history to generate meaningful recommendations.

### 7.5 Proposed System
MoodTune AI captures the user's facial expression via webcam, processes
it locally in the browser using a pre-trained convolutional neural
network (face-api.js), and classifies it into one of seven expressions.
This is combined with optional language and genre preferences to build
a search query sent to a lightweight Node.js backend, which securely
queries the YouTube Data API v3 and returns a curated list of music
videos for immediate playback — all without any server-side storage of
personal data.

### 7.6 Advantages
- No manual searching required — recommendations follow the user's mood.
- Fully client-side AI processing protects user privacy.
- No dedicated ML server or GPU infrastructure needed.
- Lightweight backend acts purely as a secure API proxy.
- Manual override, language, and genre filters give the user full control.
- API-call optimization reduces cost and latency.

### 7.7 System Architecture
```
┌─────────────────────┐        HTTPS (emotion only)      ┌──────────────────────┐
│   React Frontend     │ ───────────────────────────────▶ │   Node.js Backend     │
│  (Browser + Webcam)   │                                  │  (Express + Axios)    │
│  - react-webcam       │ ◀─────────────────────────────── │  - Query Builder      │
│  - face-api.js (AI)   │        JSON music results         │  - YouTube API Proxy  │
└─────────────────────┘                                  └──────────┬────────────┘
                                                                       │
                                                                       ▼
                                                          ┌──────────────────────┐
                                                          │  YouTube Data API v3  │
                                                          └──────────────────────┘
```

### 7.8 Data Flow
1. Webcam frame captured in-browser (never leaves the device).
2. face-api.js extracts facial features and classifies expression + confidence.
3. Expression (or manual mood) + language + genre are combined into a mood key.
4. If the mood key changed since the last request, React calls the backend.
5. Backend builds a YouTube search query and calls the YouTube Data API v3.
6. Backend returns simplified video data (id, title, channel, thumbnail).
7. React renders the results and lets the user play a track in an embedded player.

### 7.9 Module Description
- **Camera Module** — manages webcam access, permission errors, and
  runs periodic facial-expression detection.
- **Emotion Detection Module** — face-api.js models (TinyFaceDetector +
  FaceExpressionNet) classify expressions and confidence scores.
- **Recommendation Engine** — maps an expression/mood to a music
  descriptor and combines it with language/genre into a search query.
- **YouTube Integration Module** — Node.js backend that securely calls
  the YouTube Data API v3 and returns curated results.
- **Music Display Module** — renders recommendation cards with
  thumbnails, titles, and channel names.
- **Playback Module** — embeds a YouTube iframe player for the selected track.
- **Manual Controls Module** — mood override, language, and genre selectors.

### 7.10 Functional Requirements
- The system shall request camera permission and display a live webcam feed.
- The system shall detect facial expressions and display a label with confidence.
- The system shall allow manual mood selection that overrides detection.
- The system shall allow language and genre selection.
- The system shall fetch and display 10–12 relevant YouTube results.
- The system shall allow the user to play a selected video in an embedded player.
- The system shall avoid redundant YouTube API calls for unchanged moods.

### 7.11 Non-Functional Requirements
- **Performance:** Expression detection should run at least once per second without noticeably lagging the UI.
- **Privacy:** No video, image, or biometric data is stored or transmitted.
- **Usability:** Responsive layout usable on both desktop and mobile browsers.
- **Reliability:** Graceful error handling for camera, model, and API failures.
- **Security:** YouTube API key never exposed to the client.

### 7.12 Software Requirements
- Node.js (v18 or later)
- npm
- A modern browser with webcam and WebGL support (Chrome, Edge, Firefox)
- A Google Cloud account with YouTube Data API v3 enabled

### 7.13 Hardware Requirements
- A computer or laptop with a functioning webcam
- Minimum 4GB RAM (8GB recommended for smooth in-browser inference)
- Stable internet connection (for YouTube search and playback)

### 7.14 Future Enhancements
- Add user accounts to save favorite tracks and mood history.
- Support Spotify or Apple Music as alternate music sources.
- Use a more advanced emotion model for higher detection accuracy.
- Add mood trend analytics over time.
- Support offline/cached recommendations for weak connections.

### 7.15 Conclusion
MoodTune AI demonstrates a practical, privacy-conscious approach to
affective music recommendation using only client-side AI and a thin,
secure backend. It shows how modern browser-based machine learning can
replace heavier server-side ML infrastructure for real-time, personal,
interactive applications — making it a strong showcase of full-stack
and applied-AI skills suitable for a final-year project.

---

## 8. Error Handling Summary

| Situation | User sees |
|---|---|
| Camera permission denied | "Camera access is required for facial-expression detection." |
| No face in frame | "No face detected. Please position your face inside the camera." |
| Models still loading | "Loading AI models..." |
| YouTube API/network failure | "Unable to load music recommendations. Please try again." |
| Missing API key on backend | Clear 500 error explaining `.env` setup is needed |

---

## 9. Privacy Notes

- The webcam feed never leaves the browser.
- No frames, images, or recordings are uploaded to the backend.
- The backend only ever receives: an emotion keyword, a language, and a genre — plain strings, not personal data.
