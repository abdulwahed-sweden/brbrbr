import { useState, useRef } from 'react'
import { FileText, Trash2, Sparkles, User, Bot, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

function App() {
  const [text, setText] = useState('')
  const [fileName, setFileName] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  const handleClear = () => {
    setText('')
    setFileName('')
    setResults(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleAnalyze = async () => {
    setLoading(true)
    setResults(null)
    setError(null)

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        throw new Error('Analysis failed. Please try again.')
      }

      const data = await response.json()

      setResults({
        humanPercentage: data.human_percentage,
        aiPercentage: data.ai_percentage,
        verdict: data.verdict
      })
    } catch (err) {
      setError(err.message || 'An error occurred during analysis')
    } finally {
      setLoading(false)
    }
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
              disabled={loading}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleClear}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Clear text"
            >
              <Trash2 className="w-5 h-5 text-accent" />
              Clear
            </button>

            <button
              onClick={handleAnalyze}
              disabled={!text.trim() || loading}
              className="flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              title="Analyze text"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 text-accent animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-accent" />
                  Analyze
                </>
              )}
            </button>

            <button
              onClick={handleUploadClick}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

          {/* Error Message */}
          {error && (
            <div className="mt-8 animate-fadeIn">
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Results Section */}
          {results && (
            <div className="mt-8 animate-fadeIn">
              <div className="bg-gray-50 rounded-xl p-8 border-2 border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Analysis Results
                </h2>

                {/* Percentage Bars */}
                <div className="space-y-6 mb-8">
                  {/* Human Percentage */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-accent" />
                        <span className="font-semibold text-gray-900">Human</span>
                      </div>
                      <span className="text-2xl font-bold text-gray-900">
                        {results.humanPercentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gray-900 h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${results.humanPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* AI Percentage */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bot className="w-5 h-5 text-accent" />
                        <span className="font-semibold text-gray-900">AI</span>
                      </div>
                      <span className="text-2xl font-bold text-gray-900">
                        {results.aiPercentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gray-400 h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${results.aiPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Verdict Badge */}
                <div className="flex items-center justify-center">
                  <div className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold ${
                    results.verdict === 'Human Written'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-300 text-gray-900'
                  }`}>
                    {results.verdict === 'Human Written' ? (
                      <CheckCircle className="w-5 h-5 text-accent" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-accent" />
                    )}
                    <span>{results.verdict}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
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
