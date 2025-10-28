import { useState } from 'react'
import { FileText, Trash2, Sparkles } from 'lucide-react'

function App() {
  const [text, setText] = useState('')

  const handleClear = () => {
    setText('')
  }

  const handleAnalyze = () => {
    // Will be implemented in later phases
    console.log('Analyzing text:', text)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="py-6 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900">brbrbr</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Text Input Area */}
          <div className="space-y-4">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste or type text here to analyze..."
              className="w-full h-64 p-4 border-2 border-gray-300 rounded-lg resize-none focus:outline-none focus:border-gray-500 transition-colors text-gray-900 placeholder-gray-400"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleClear}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              title="Clear text"
            >
              <Trash2 className="w-5 h-5 text-accent" />
              Clear
            </button>

            <button
              onClick={handleAnalyze}
              disabled={!text.trim()}
              className="flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              title="Analyze text"
            >
              <Sparkles className="w-5 h-5 text-accent" />
              Analyze
            </button>

            <button
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              title="Upload file"
            >
              <FileText className="w-5 h-5 text-accent" />
              Upload
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 px-4 text-center text-gray-500 text-sm">
        AI Text Detector
      </footer>
    </div>
  )
}

export default App
