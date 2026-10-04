/* ==========================================================================
   NLP Sentiment Analyzer - Frontend JavaScript Controller
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const form = document.getElementById('sentimentForm');
    const inputText = document.getElementById('inputText');
    const clearBtn = document.getElementById('clearBtn');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const btnTextContent = analyzeBtn.querySelector('.btn-text-content');
    const spinner = analyzeBtn.querySelector('.spinner');
    
    const wordCountSpan = document.getElementById('wordCount');
    const charCountSpan = document.getElementById('charCount');
    
    const errorAlert = document.getElementById('errorAlert');
    const errorMessage = document.getElementById('errorMessage');
    
    const placeholderState = document.getElementById('placeholderState');
    const resultContent = document.getElementById('resultContent');
    
    const sentimentBanner = document.getElementById('sentimentBanner');
    const sentimentEmoji = document.getElementById('sentimentEmoji');
    const sentimentLabel = document.getElementById('sentimentLabel');
    const confidenceValue = document.getElementById('confidenceValue');
    
    const confidenceBarFill = document.getElementById('confidenceBarFill');
    const confidenceBarText = document.getElementById('confidenceBarText');
    
    const posScore = document.getElementById('posScore');
    const neuScore = document.getElementById('neuScore');
    const negScore = document.getElementById('negScore');
    
    const compoundScore = document.getElementById('compoundScore');
    const tbPolarity = document.getElementById('tbPolarity');
    const tbSubjectivity = document.getElementById('tbSubjectivity');
    
    const statWords = document.getElementById('statWords');
    const statChars = document.getElementById('statChars');
    const statSentences = document.getElementById('statSentences');

    // Pre-defined Sample Texts for Testing
    const sampleTexts = {
        positive: "This product exceeded all my expectations! The build quality is top notch, performance is silky smooth, and the customer support team was extremely helpful and polite.",
        negative: "The service was terribly slow and the food tasted awful. I am very disappointed with the poor quality and will definitely never return to this restaurant.",
        neutral: "The package arrived at 3 PM on Tuesday. The cardboard box contained the requested hardware components, user manual, and invoice documents.",
        mixed: "The screen display quality is absolutely stunning with vibrant colors, but the battery life is surprisingly short and the device gets uncomfortably warm during heavy usage."
    };

    // 1. Sample Chip Button Handler
    document.querySelectorAll('.chip').forEach(button => {
        button.addEventListener('click', () => {
            const sampleType = button.getAttribute('data-sample');
            if (sampleTexts[sampleType]) {
                inputText.value = sampleTexts[sampleType];
                updateTextCounts();
                hideError();
                // Trigger auto analyze for immediate feedback
                submitAnalysis();
            }
        });
    });

    // 2. Real-time Word & Character Count
    function updateTextCounts() {
        const text = inputText.value;
        const charLen = text.length;
        // Count non-empty words
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        
        charCountSpan.textContent = `${charLen}/5000 chars`;
        wordCountSpan.textContent = `${words} ${words === 1 ? 'word' : 'words'}`;
    }

    inputText.addEventListener('input', () => {
        updateTextCounts();
        if (inputText.value.trim().length > 0) {
            hideError();
        }
    });

    // 3. Clear Button Handler
    clearBtn.addEventListener('click', () => {
        inputText.value = '';
        updateTextCounts();
        hideError();
        showPlaceholder();
        inputText.focus();
    });

    // 4. Form Submission & API Request
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        submitAnalysis();
    });

    function submitAnalysis() {
        const rawText = inputText.value;
        const trimmedText = rawText.trim();

        // Front-end Validation for Empty Input
        if (!trimmedText) {
            showError('Please enter a sentence or paragraph to analyze.');
            inputText.focus();
            return;
        }

        hideError();
        setLoading(true);

        fetch('/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: trimmedText })
        })
        .then(response => {
            return response.json().then(data => ({
                status: response.status,
                ok: response.ok,
                data: data
            }));
        })
        .then(res => {
            setLoading(false);
            if (!res.ok) {
                showError(res.data.error || 'An error occurred during analysis.');
                return;
            }
            displayResults(res.data);
        })
        .catch(err => {
            setLoading(false);
            console.error('Fetch error:', err);
            showError('Failed to connect to Flask backend server. Please make sure app.py is running.');
        });
    }

    // 5. Update UI with Analysis Results
    function displayResults(data) {
        // Hide placeholder and show content container
        placeholderState.style.display = 'none';
        resultContent.style.display = 'flex';

        // Update Banner class, emoji, label, and confidence pill
        sentimentBanner.className = `sentiment-banner ${data.sentiment_class}`;
        sentimentEmoji.textContent = data.emoji;
        sentimentLabel.textContent = data.sentiment;
        confidenceValue.textContent = `${data.confidence}%`;

        // Update Meter Fill & Text
        confidenceBarFill.style.width = `${data.confidence}%`;
        confidenceBarText.textContent = `${data.confidence}%`;

        // Color gauge bar according to sentiment
        if (data.sentiment_class === 'positive') {
            confidenceBarFill.style.background = 'linear-gradient(90deg, #10b981, #059669)';
        } else if (data.sentiment_class === 'negative') {
            confidenceBarFill.style.background = 'linear-gradient(90deg, #ef4444, #dc2626)';
        } else {
            confidenceBarFill.style.background = 'linear-gradient(90deg, #f59e0b, #d97706)';
        }

        // Update Scores Grid
        posScore.textContent = `${data.scores.positive}%`;
        neuScore.textContent = `${data.scores.neutral}%`;
        negScore.textContent = `${data.scores.negative}%`;

        // Update Detailed NLP Metrics
        const comp = data.scores.compound;
        compoundScore.textContent = (comp >= 0 ? `+${comp.toFixed(3)}` : comp.toFixed(3));
        
        const pol = data.textblob.polarity;
        tbPolarity.textContent = (pol >= 0 ? `+${pol.toFixed(3)}` : pol.toFixed(3));
        tbSubjectivity.textContent = data.textblob.subjectivity.toFixed(3);

        // Update Stats
        statWords.textContent = data.stats.word_count;
        statChars.textContent = data.stats.char_count;
        statSentences.textContent = data.stats.sentence_count;
    }

    // Helper Functions
    function showError(msg) {
        errorMessage.textContent = msg;
        errorAlert.style.display = 'flex';
    }

    function hideError() {
        errorAlert.style.display = 'none';
    }

    function showPlaceholder() {
        resultContent.style.display = 'none';
        placeholderState.style.display = 'flex';
    }

    function setLoading(isLoading) {
        if (isLoading) {
            analyzeBtn.disabled = true;
            btnTextContent.style.display = 'none';
            spinner.style.display = 'block';
        } else {
            analyzeBtn.disabled = false;
            btnTextContent.style.display = 'inline-flex';
            spinner.style.display = 'none';
        }
    }
});
