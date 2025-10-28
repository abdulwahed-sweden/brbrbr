import { useState, useRef, useCallback, useMemo } from 'react'
import { FileText, Trash2, Sparkles, User, Bot, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

function App() {
  const [text, setText] = useState('')
  const [fileName, setFileName] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)
  const textareaRef = useRef(null)

  // Memoized character count
  const charCount = useMemo(() => text.length, [text])
  const wordCount = useMemo(() => {
    const words = text.trim().split(/\s+/)
    return text.trim() === '' ? 0 : words.length
  }, [text])

  const handleClear = useCallback(() => {
    setText('')
    setFileName('')
    setResults(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    // Focus textarea after clear
    textareaRef.current?.focus()
  }, [])

  const handleAnalyze = useCallback(async () => {
    if (!text.trim()) return

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
  }, [text])

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileUpload = useCallback((event) => {
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
      setError('Error reading file. Please try again.')
      setFileName('')
    }
    reader.readAsText(file)
  }, [])

  // Keyboard shortcut: Ctrl/Cmd + Enter to analyze
  const handleKeyDown = useCallback((e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      handleAnalyze()
    }
  }, [handleAnalyze])

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="py-4 sm:py-6 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">brbrbr</h1>
          <p className="text-sm text-gray-500 mt-1 sr-only">AI Text Detection Tool</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-4 sm:py-8" role="main">
        <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
          {/* Text Input Area */}
          <div className="space-y-3 sm:space-y-4">
            {fileName && (
              <div
                className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg"
                role="status"
                aria-live="polite"
              >
                <FileText className="w-4 h-4 text-accent flex-shrink-0" aria-hidden="true" />
                <span className="truncate">{fileName}</span>
              </div>
            )}
            <div className="relative">
              <label htmlFor="text-input" className="sr-only">
                Enter text to analyze for AI detection
              </label>
              <textarea
                id="text-input"
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Paste or type text here to analyze..."
                className="w-full h-48 sm:h-64 p-3 sm:p-4 border-2 border-gray-300 rounded-lg resize-none focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200 transition-all text-gray-900 placeholder-gray-400 text-sm sm:text-base"
                disabled={loading}
                aria-describedby="char-count"
                maxLength={50000}
              />
              <div
                id="char-count"
                className="absolute bottom-2 right-2 text-xs text-gray-400 bg-white px-2 py-1 rounded"
                aria-live="polite"
              >
                {charCount > 0 && `${wordCount} words · ${charCount} chars`}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={handleClear}
              disabled={loading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Clear text"
              aria-label="Clear all text"
            >
              <Trash2 className="w-5 h-5 text-accent" aria-hidden="true" />
              <span>Clear</span>
            </button>

            <button
              onClick={handleAnalyze}
              disabled={!text.trim() || loading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              title={loading ? "Analyzing..." : "Analyze text (Ctrl+Enter)"}
              aria-label={loading ? "Analyzing text" : "Analyze text"}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 text-accent animate-spin" aria-hidden="true" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-accent" aria-hidden="true" />
                  <span>Analyze</span>
                </>
              )}
            </button>

            <button
              onClick={handleUploadClick}
              disabled={loading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Upload file"
              aria-label="Upload text file"
            >
              <FileText className="w-5 h-5 text-accent" aria-hidden="true" />
              <span>Upload</span>
            </button>
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.md,.csv,.json"
            onChange={handleFileUpload}
            className="sr-only"
            aria-label="File upload input"
          />

          {/* Error Message */}
          {error && (
            <div className="mt-6 sm:mt-8 animate-fadeIn" role="alert">
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-red-800 text-sm sm:text-base">{error}</p>
              </div>
            </div>
          )}

          {/* Results Section */}
          {results && (
            <div className="mt-6 sm:mt-8 animate-fadeIn" role="region" aria-label="Analysis results">
              <div className="bg-gray-50 rounded-xl p-6 sm:p-8 border-2 border-gray-200">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
                  Analysis Results
                </h2>

                {/* Percentage Bars */}
                <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
                  {/* Human Percentage */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-accent" aria-hidden="true" />
                        <span className="font-semibold text-gray-900 text-sm sm:text-base">Human</span>
                      </div>
                      <span className="text-xl sm:text-2xl font-bold text-gray-900" aria-label={`${results.humanPercentage} percent human`}>
                        {results.humanPercentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden" role="progressbar" aria-valuenow={results.humanPercentage} aria-valuemin="0" aria-valuemax="100">
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
                        <Bot className="w-5 h-5 text-accent" aria-hidden="true" />
                        <span className="font-semibold text-gray-900 text-sm sm:text-base">AI</span>
                      </div>
                      <span className="text-xl sm:text-2xl font-bold text-gray-900" aria-label={`${results.aiPercentage} percent AI`}>
                        {results.aiPercentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden" role="progressbar" aria-valuenow={results.aiPercentage} aria-valuemin="0" aria-valuemax="100">
                      <div
                        className="bg-gray-400 h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${results.aiPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Verdict Badge */}
                <div className="flex items-center justify-center">
                  <div className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-lg font-semibold text-sm sm:text-base ${
                    results.verdict === 'Human Written'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-300 text-gray-900'
                  }`} role="status" aria-label={`Verdict: ${results.verdict}`}>
                    {results.verdict === 'Human Written' ? (
                      <CheckCircle className="w-5 h-5 text-accent" aria-hidden="true" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-accent" aria-hidden="true" />
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
      <footer className="py-3 sm:py-4 px-4 text-center text-gray-500 text-xs sm:text-sm" role="contentinfo">
        AI Text Detector
      </footer>
    </div>
  )
}

export default App
