import os
import re
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from textblob import TextBlob

# Initialize Flask app
app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app)

# Ensure NLTK VADER lexicon is downloaded
def init_nltk():
    try:
        nltk.data.find('sentiment/vader_lexicon.zip')
    except LookupError:
        print("Downloading NLTK vader_lexicon...")
        nltk.download('vader_lexicon', quiet=True)
    try:
        nltk.data.find('tokenizers/punkt')
    except LookupError:
        print("Downloading NLTK punkt tokenizer...")
        nltk.download('punkt', quiet=True)

init_nltk()
sia = SentimentIntensityAnalyzer()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/analyze', methods=['POST'])
def analyze_sentiment():
    try:
        data = request.get_json(silent=True)
        if not data or 'text' not in data:
            return jsonify({'error': 'Invalid request payload. Please provide text.'}), 400

        text = data.get('text', '').strip()

        # Error handling for empty input
        if not text:
            return jsonify({'error': 'Please enter a sentence or paragraph to analyze.'}), 400
        
        if len(text) > 5000:
            return jsonify({'error': 'Input text is too long (maximum 5,000 characters allowed).'}), 400

        # NLTK VADER Analysis
        vader_scores = sia.polarity_scores(text)
        compound = vader_scores['compound']
        pos = vader_scores['pos']
        neg = vader_scores['neg']
        neu = vader_scores['neu']

        # Determine sentiment classification
        if compound >= 0.05:
            sentiment = 'Positive'
            emoji = '😊'
            sentiment_class = 'positive'
            # Confidence score calculation based on compound magnitude & component weights
            confidence = round(min(100.0, max(50.0, abs(compound) * 100)), 1)
        elif compound <= -0.05:
            sentiment = 'Negative'
            emoji = '😟'
            sentiment_class = 'negative'
            confidence = round(min(100.0, max(50.0, abs(compound) * 100)), 1)
        else:
            sentiment = 'Neutral'
            emoji = '😐'
            sentiment_class = 'neutral'
            confidence = round(min(100.0, max(50.0, neu * 100)), 1)

        # TextBlob Analysis for extra NLP insight
        blob = TextBlob(text)
        tb_polarity = round(blob.sentiment.polarity, 3)
        tb_subjectivity = round(blob.sentiment.subjectivity, 3)

        # Text Statistics
        words = re.findall(r'\b\w+\b', text)
        word_count = len(words)
        char_count = len(text)
        sentence_count = len(re.split(r'[.!?]+', text)) - 1
        if sentence_count < 1:
            sentence_count = 1

        response = {
            'text': text,
            'sentiment': sentiment,
            'sentiment_class': sentiment_class,
            'emoji': emoji,
            'confidence': confidence,
            'scores': {
                'compound': round(compound, 3),
                'positive': round(pos * 100, 1),
                'negative': round(neg * 100, 1),
                'neutral': round(neu * 100, 1)
            },
            'textblob': {
                'polarity': tb_polarity,
                'subjectivity': tb_subjectivity
            },
            'stats': {
                'word_count': word_count,
                'char_count': char_count,
                'sentence_count': sentence_count
            }
        }

        return jsonify(response), 200

    except Exception as e:
        return jsonify({'error': f'An unexpected error occurred during analysis: {str(e)}'}), 500

if __name__ == '__main__':
    print("Starting Sentiment Analysis Flask Web Server...")
    app.run(host='127.0.0.1', port=5000, debug=True)
