## 🎯 What I Created

A custom tokenizer in JavaScript that learns vocab from text, supports ENCODE/DECODE and handles special tokens.

## 📁 Project Structure

```
src/
├── types/index.ts          # TypeScript type definitions
├── utils/tokenizer.ts      # Core tokenizer logic
├── components/
│   ├── TrainingSection.tsx # Training interface
│   ├── TestingSection.tsx  # Encoding/decoding interface  
│   └── VocabSection.tsx    # Vocabulary explorer
├── App.tsx                 # Main application
├── index.tsx              # React entry point
└── index.css              # Tailwind CSS styles
```

## 🔧 Core Features

### 1. **Custom Tokenizer Engine**
- **Vocabulary Learning**: Builds vocabulary from training text
- **Frequency-based Selection**: Prioritizes most common words
- **Special Token Support**: Handles ``, ``, ``, ``
- **Text Preprocessing**: Converts text to lowercase, removes punctuation
- **Configurable Size**: Adjustable vocabulary size limits

### 2. **Three Main Sections**

#### 📚 **Training Section**
- Text input for training data
- Sample data loader
- Real-time training feedback
- Vocabulary statistics display

#### 🧪 **Testing Section** 
- Text encoding to token IDs
- Token ID decoding back to text
- Visual token breakdown with color coding
- Round-trip validation

#### 📖 **Vocabulary Section**
- Statistics view (vocab size, token counts)
- Complete vocabulary browser
- Special vs regular token separation
- Tabbed interface for organization

## ⚙️ How It Works

### **Step 1: Training Process**
```typescript
// User enters training text like:
"Hello world this is a test"
"JavaScript is a programming language"

// Tokenizer processes:
1. Splits into words: ["hello", "world", "this", "is", "a", "test", ...]
2. Counts frequencies: {"hello": 1, "world": 1, "is": 2, ...}
3. Sorts by frequency and builds vocabulary
4. Assigns unique IDs: {"": 0, "": 1, "": 2, "is": 3, ...}
```

### **Step 2: Encoding Process**
```typescript
// Input: "Hello world"
// Process:
1. Tokenize: ["hello", "world"]
2. Map to IDs: [5, 12] (from vocabulary)
3. Add special tokens: [0, 5, 12, 1] (, hello, world, )
// Output: [0, 5, 12, 1]
```

### **Step 3: Decoding Process**
```typescript
// Input: [0, 5, 12, 1]
// Process:
1. Map IDs back to tokens: ["", "hello", "world", ""]
2. Filter out special tokens: ["hello", "world"]
3. Join with spaces: "hello world"
// Output: "hello world"
```

## 🔄 Data Flow

```
1. User Input (Training Text)
   ↓
2. Tokenizer.learnVocab()
   ↓
3. Vocabulary Created
   ↓
4. User Input (Test Text)
   ↓
5. Tokenizer.encode()
   ↓
6. Token IDs Generated
   ↓
7. Tokenizer.decode()
   ↓
8. Original Text Recovered
```

## 🚀 How to Use

1. **Train**: Enter training text → Click "Train Tokenizer"
2. **Test**: Enter test text → Click "Encode" → Click "Decode"
3. **Explore**: View statistics and vocabulary in the third section
4. **Demo**: Click "Run Demo" for a quick demonstration