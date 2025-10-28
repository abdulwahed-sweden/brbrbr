import { useState, useRef } from 'react'
import { FileText, Trash2, Sparkles } from 'lucide-react'

function App() {
  const [text, setText] = useState('')
  const [fileName, setFileName] = useState('')
  const fileInputRef = useRef(null)

  const handleClear = () => {
    setText('')
    setFileName('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleAnalyze = () => {
    // Will be implemented in later phases
    console.log('Analyzing text:', text)
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setFileName(file.name)

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result
      if (typeof content === 'string') {
        setText(content)
      }
    }
    reader.onerror = () => {
      console.error('Error reading file')
      setFileName('')
    }
    reader.readAsText(file)
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
            {fileName && (
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
                <FileText className="w-4 h-4 text-accent" />
                <span>{fileName}</span>
              </div>
            )}
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
              onClick={handleUploadClick}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              title="Upload file"
            >
              <FileText className="w-5 h-5 text-accent" />
              Upload
            </button>
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.md,.csv,.json"
            onChange={handleFileUpload}
            className="hidden"
          />
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
