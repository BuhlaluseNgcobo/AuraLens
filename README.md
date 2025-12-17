

# 🌈 AuraLens  
An AI‑powered **sentiment analysis** application built with **TypeScript**, **Vite**, and **Google Gemini**.

## 📌 Overview  
AuraLens analyzes text input and determines the emotional tone behind it—positive, negative, or neutral. It provides a clean UI, fast performance, and a modular architecture suitable for expanding into dashboards or analytics tools.

The app is also linked to an AI Studio deployment:


## ✨ Features  
- 🤖 **AI‑powered sentiment analysis** using Gemini  
- ⚡ **Fast Vite + TypeScript development environment**  
- 🎨 **Simple, clean UI**  
- 🧩 **Component‑based architecture**  
- 🔑 **Environment‑based API key configuration**  
- 📊 Optional Python dashboard (`pinkanalysisdashboard.py`)  

## 🛠️ Tech Stack  
| Technology | Purpose |
|-----------|---------|
| **TypeScript** | Core logic & type safety |
| **Vite** | Build tool & dev server |
| **React** | UI components |
| **Gemini API** | Sentiment analysis |
| **Python** | Optional analytics dashboard |
| **HTML / CSS** | Layout & styling |

## 📁 Project Structure  
```
AuraLens/
│
├── components/              # UI components
├── services/                # Gemini API service logic
├── App.tsx                  # Main application component
├── index.tsx                # App entry point
├── index.html               # Root HTML file
├── metadata.json            # App metadata
├── types.ts                 # TypeScript types
├── pinkanalysisdashboard.py # Optional Python dashboard
├── requirements.txt         # Python dependencies
├── package.json             # JS dependencies & scripts
├── tsconfig.json            # TypeScript config
└── vite.config.ts           # Vite configuration
```

## ▶️ Getting Started

### 1. Clone the repository  
```bash
git clone https://github.com/BuhlaluseNgcobo/AuraLens
cd AuraLens
```

### 2. Install dependencies  
```bash
npm install
```

### 3. Add your Gemini API key  
Create a `.env.local` file:

```
GEMINI_API_KEY=your_key_here
```

### 4. Run the development server  
```bash
npm run dev
```

Your app will be available at a local development URL.

---

## 🐍 Optional: Run the Python Dashboard  
If you want to use the sentiment‑analysis dashboard:

### Install Python dependencies  
```bash
pip install -r requirements.txt
```

### Run the dashboard  
```bash
python pinkanalysisdashboard.py
```

---

## 🚀 Deployment  
This project can be deployed to any static hosting provider (Vercel, Netlify, GitHub Pages, etc.).

Build the production bundle:

```bash
npm run build
```

Then deploy the `dist/` folder.

---

## 📌 Future Enhancements  
- Add visual sentiment charts  
- Add batch text analysis  
- Add user history tracking  
- Add dark mode  
- Add multilingual sentiment support  

---

## 🤝 Contributing  
Contributions are welcome. Feel free to fork the repo and submit pull requests.

---

