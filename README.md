# NLP Sentiment Analysis Web Application

A clean, modern full-stack web application for Sentiment Analysis built with **Python Flask**, **NLTK VADER**, and **TextBlob**. Designed specifically for college NLP lab experiments, demonstrations, and practical submissions.

---

## 🌟 Key Features

1. **Intuitive & Sleek UI**: Dark mode glassmorphism interface with custom ambient glow, modern typography, and smooth micro-animations.
2. **Text Input & Sample Test Suite**:
   - Large text input box supporting up to 5,000 characters.
   - Quick-select sample buttons (Positive, Negative, Neutral, Mixed/Sarcastic) for instant testing during lab presentations.
   - Real-time word count and character count.
3. **Sentiment Classification & Confidence Score**:
   - Classifies input into **Positive** (😊), **Negative** (😟), or **Neutral** (😐).
   - Dynamic **Confidence Score Gauge (%)** reflecting VADER compound polarity intensity.
4. **Detailed NLP Metrics**:
   - **VADER Component Scores**: Positive %, Neutral %, Negative %, and Normalized Compound score (-1.0 to +1.0).
   - **TextBlob Metrics**: Polarity (-1.0 to +1.0) and Subjectivity (0.0 objective to 1.0 subjective).
5. **Robust Error Handling**:
   - Visual alert for empty or whitespace-only inputs.
   - Clear feedback on server errors or connectivity issues.

---

## 📁 Project Structure

```text
TSA1/
├── app.py                  # Flask web backend & NLP model API
├── requirements.txt        # Python dependencies (Flask, NLTK, TextBlob)
├── README.md               # Project documentation & execution guide
├── venv/                   # Virtual environment directory
├── static/
│   ├── css/
│   │   └── style.css       # Custom responsive design system
│   └── js/
│       └── main.js         # Frontend controller & API fetch logic
└── templates/
    └── index.html          # HTML5 application template
```

---

## 🛠️ How to Setup & Run

### Prerequisites
- Python 3.8+ installed on your system.

### Step 1: Clone / Navigate to Project Directory
```bash
cd c:\Users\kirlo\Desktop\TSA1
```

### Step 2: Activate Virtual Environment
- **Windows (PowerShell)**:
  ```powershell
  .\venv\Scripts\Activate.ps1
  ```
- **Windows (CMD)**:
  ```cmd
  .\venv\Scripts\activate.bat
  ```
- **Linux/macOS**:
  ```bash
  source venv/bin/activate
  ```

*(Note: Dependencies `flask`, `flask-cors`, `nltk`, and `textblob` are already pre-installed in the virtual environment).*

### Step 3: Launch the Flask Backend Server
```bash
python app.py
```

### Step 4: Open in Web Browser
Open your browser and navigate to:
```
http://127.0.0.1:5000
```

---

## 🔬 NLP Sentiment Analysis Methodology (For Lab Viva / Reports)

### 1. NLTK VADER (Valence Aware Dictionary and sEntiment Reasoner)
- **VADER** is a rule-based sentiment analysis model specifically tuned for social media, reviews, and general text.
- It considers word sentiment intensity, punctuation (e.g. "good!" vs "good"), capitalization (e.g. "GREAT"), degree modifiers (e.g. "very bad"), and contrastive conjunctions ("but").
- **Compound Score Formula**:
  - `compound >= 0.05` &rarr; **Positive**
  - `compound <= -0.05` &rarr; **Negative**
  - `-0.05 < compound < 0.05` &rarr; **Neutral**

### 2. Confidence Score Calculation
$$\text{Confidence (\%)} = \min\left(100, \max\left(50, |\text{Compound Score}| \times 100\right)\right)$$

### 3. TextBlob Integration
- **Polarity**: Measures text positivity/negativity on a scale of -1.0 (very negative) to +1.0 (very positive).
- **Subjectivity**: Measures opinion vs fact on a scale of 0.0 (very objective/factual) to 1.0 (very subjective/opinionated).
