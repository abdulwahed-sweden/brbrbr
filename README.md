# brbrbr

A minimalist AI text detection tool with a clean, Google Search-inspired interface. Analyze text to determine whether it's human-written or AI-generated using pattern-based heuristics.

## Features

- **Simple & Fast**: Clean single-page interface with instant analysis
- **File Upload Support**: Upload .txt, .md, .csv, or .json files
- **Detailed Results**: View human vs AI percentages with visual progress bars
- **Fully Responsive**: Works seamlessly on mobile, tablet, and desktop
- **Accessible**: WCAG-compliant with full keyboard navigation and screen reader support
- **Keyboard Shortcuts**: Press Ctrl/Cmd+Enter to analyze text quickly
- **Performance Optimized**: React hooks for memoization and efficient rendering

## Technology Stack

### Backend
- **Rust** (Edition 2024) - High-performance, memory-safe backend
- **Actix-web 4.x** - Fast, asynchronous web framework
- **Serde** - Serialization/deserialization

### Frontend
- **React 19.1.1** - Modern UI library with hooks
- **Vite 7.1.12** - Lightning-fast build tool
- **Tailwind CSS v4** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library

## Installation

### Prerequisites
- Rust (1.70+) - [Install Rust](https://www.rust-lang.org/tools/install)
- Node.js (18+) - [Install Node.js](https://nodejs.org/)
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd brbrbr
   ```

2. **Install backend dependencies**
   ```bash
   cargo build
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

4. **Build the frontend**
   ```bash
   npm run build
   ```
   This builds the React app and outputs to `../static/` directory.

5. **Run the application**
   ```bash
   cd ..
   cargo run
   ```

6. **Access the application**
   Open your browser and navigate to `http://localhost:8080`

## Usage

### Web Interface

1. **Enter Text**: Paste or type text into the textarea (up to 50,000 characters)
2. **Upload File**: Click the "Upload" button to load text from a file
3. **Analyze**: Click "Analyze" or press Ctrl/Cmd+Enter
4. **View Results**: See the human/AI percentages and verdict

### API Endpoints

#### Health Check
```bash
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "service": "brbrbr"
}
```

#### Analyze Text
```bash
POST /api/analyze
Content-Type: application/json
```

**Request Body:**
```json
{
  "text": "Your text to analyze here..."
}
```

**Response:**
```json
{
  "human_percentage": 65.5,
  "ai_percentage": 34.5,
  "verdict": "Human Written"
}
```

**Verdict Values:**
- `"Human Written"` - AI percentage ≤ 40%
- `"AI Generated"` - AI percentage ≥ 60%
- `"Uncertain"` - AI percentage between 40-60%

### cURL Examples

**Test the health endpoint:**
```bash
curl http://localhost:8080/health
```

**Analyze text:**
```bash
curl -X POST http://localhost:8080/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "This is a sample text to analyze."}'
```

## AI Detection Algorithm

The analyzer uses a heuristic-based approach with five weighted factors:

### 1. Sentence Length Uniformity (25% weight)
- Analyzes variance in sentence lengths
- AI text tends to have more uniform sentence lengths
- Low variance (< 200) indicates AI-like patterns

### 2. Vocabulary Diversity (20% weight)
- Calculates unique word ratio
- Higher diversity (> 0.7) suggests human writing
- Lower diversity (< 0.5) indicates potential AI generation

### 3. AI-Common Phrases (30% weight)
- Detects phrases frequently used by AI models:
  - "as an ai", "i cannot", "it's important to note"
  - "furthermore", "in conclusion", "delve into"
  - "leverage", "utilize", "facilitate"
  - "multifaceted", "paradigm shift", "cutting-edge"
- 3+ matches = 85% AI probability
- 2 matches = 70% AI probability
- 1 match = 55% AI probability

### 4. Punctuation Patterns (15% weight)
- AI text typically has:
  - Fewer exclamation marks (more formal tone)
  - Consistent comma usage (2-4% of text)

### 5. Text Structure (10% weight)
- Analyzes paragraph organization
- Well-structured paragraphs (50-150 words) suggest AI formatting

**Scoring Formula:**
```
ai_score = (uniformity × 0.25) + (diversity × 0.20) +
           (phrases × 0.30) + (punctuation × 0.15) +
           (structure × 0.10)
```

## Development

### Project Structure
```
brbrbr/
├── src/
│   ├── main.rs           # Server entry point and routes
│   └── analyzer.rs       # AI detection algorithm
├── frontend/
│   ├── src/
│   │   ├── App.jsx       # Main React component
│   │   ├── main.jsx      # React entry point
│   │   └── index.css     # Global styles and animations
│   ├── index.html        # HTML template
│   ├── vite.config.js    # Vite configuration
│   └── package.json      # Frontend dependencies
├── static/               # Built frontend files (generated)
├── Cargo.toml            # Rust dependencies
└── README.md
```

### Development Workflow

**Run backend in development:**
```bash
cargo run
```

**Run frontend with hot reload:**
```bash
cd frontend
npm run dev
```
Then access the development server (usually http://localhost:5173) with API proxy to localhost:8080.

**Run tests:**
```bash
cargo test
```

### Making Changes

1. **Backend Changes**: Edit files in `src/`, then restart `cargo run`
2. **Frontend Changes**: Edit files in `frontend/src/`, then rebuild:
   ```bash
   cd frontend
   npm run build
   cd ..
   cargo run
   ```

## Production Build

### Build Optimized Binary

```bash
# Build release binary
cargo build --release

# The optimized binary will be at:
# target/release/brbrbr.exe (Windows)
# target/release/brbrbr (Linux/macOS)
```

### Run Production Server

```bash
# Windows
.\target\release\brbrbr.exe

# Linux/macOS
./target/release/brbrbr
```

### Environment Variables

Currently, the server binds to `127.0.0.1:8080`. To customize:

Edit `src/main.rs:69`:
```rust
.bind(("0.0.0.0", 8080))?  // Listen on all interfaces
```

## Accessibility Features

- **Semantic HTML**: Proper use of `<header>`, `<main>`, `<footer>`, `<button>`
- **ARIA Labels**: All interactive elements have descriptive labels
- **Keyboard Navigation**: Full support with visible focus indicators
- **Screen Reader Support**: Live regions for dynamic content updates
- **Color Contrast**: WCAG AA compliant with grayscale palette
- **Responsive Text**: Scales appropriately on all devices

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- **Bundle Size**: ~150KB (gzipped)
- **First Contentful Paint**: < 1s
- **Time to Interactive**: < 2s
- **Backend Response Time**: < 50ms average

## License

This project is provided as-is for educational and personal use.

## Contributing

This is a learning project. Feel free to fork and experiment with the AI detection algorithm or UI improvements.

## Acknowledgments

- Design inspiration from Google Search's minimalist interface
- Icons by [Lucide](https://lucide.dev/)
- Built with modern web technologies: Rust, React, and Tailwind CSS
