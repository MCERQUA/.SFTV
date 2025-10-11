"use client";

import { useState, useEffect, useRef } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, Plus, Send, Image as ImageIcon, Trash2, MessageSquare, History, Images, Video, ChevronLeft, ChevronRight, LogOut } from "lucide-react"
import { AuthForm } from "@/components/auth-form"
import { useAuth } from "@/hooks/use-auth"

interface ChatMessage {
  id: string
  type: 'user' | 'assistant'
  content: string
  image?: string
  video?: string
  timestamp: Date
}

interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: Date
  updatedAt: Date
}

export default function AIVideoPage() {
  const { user, loading, login, logout, isAuthenticated } = useAuth()
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [prompt, setPrompt] = useState("")
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState<'history' | 'images' | 'videos'>('history')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load sessions from localStorage on mount and set initial sidebar state
  useEffect(() => {
    const savedSessions = localStorage.getItem('ai-video-sessions')
    if (savedSessions) {
      const parsedSessions = JSON.parse(savedSessions).map((session: any) => ({
        ...session,
        createdAt: new Date(session.createdAt),
        updatedAt: new Date(session.updatedAt),
        messages: session.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }))
      setSessions(parsedSessions)
    }

    // Close sidebar on mobile by default
    const checkMobile = () => {
      setSidebarOpen(window.innerWidth >= 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Save sessions to localStorage whenever sessions change
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('ai-video-sessions', JSON.stringify(sessions))
    }
  }, [sessions])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const createNewSession = () => {
    const newSessionId = Date.now().toString()
    const newSession: ChatSession = {
      id: newSessionId,
      title: "New Video Chat",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
    setSessions(prev => [newSession, ...prev])
    setCurrentSessionId(newSessionId)
    setMessages([])
    setSelectedImage(null)
    setImagePreview(null)
  }

  const loadSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId)
    if (session) {
      setCurrentSessionId(sessionId)
      setMessages(session.messages)
    }
  }

  const deleteSession = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId))
    if (currentSessionId === sessionId) {
      setCurrentSessionId(null)
      setMessages([])
    }
  }

  const updateSessionTitle = (sessionId: string, title: string) => {
    setSessions(prev => prev.map(session =>
      session.id === sessionId
        ? { ...session, title, updatedAt: new Date() }
        : session
    ))
  }

  const addMessage = (message: ChatMessage) => {
    const newMessages = [...messages, message]
    setMessages(newMessages)

    if (currentSessionId) {
      setSessions(prev => prev.map(session =>
        session.id === currentSessionId
          ? {
              ...session,
              messages: newMessages,
              updatedAt: new Date(),
              title: session.title === "New Video Chat" && message.type === 'user'
                ? message.content.slice(0, 30) + (message.content.length > 30 ? '...' : '')
                : session.title
            }
          : session
      ))
    }
  }

  const pollJobStatus = async (jobId: string, prompt: string): Promise<void> => {
    const pollInterval = 2000 // Poll every 2 seconds
    const maxPolls = 150 // Maximum 5 minutes of polling

    let pollCount = 0

    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          pollCount++

          const response = await fetch(`/api/video-jobs?id=${jobId}`)
          if (!response.ok) {
            throw new Error('Failed to check job status')
          }

          const jobData = await response.json()

          // Update progress
          setProgress(jobData.progress || 0)

          if (jobData.status === 'completed') {
            setProgress(100)

            // Add assistant message with video
            const assistantMessage: ChatMessage = {
              id: (Date.now() + 1).toString(),
              type: 'assistant',
              content: `Generated video for: "${prompt}"`,
              video: jobData.result,
              timestamp: new Date()
            }
            addMessage(assistantMessage)
            resolve()

          } else if (jobData.status === 'failed') {
            throw new Error(jobData.error || 'Video generation failed')

          } else if (pollCount >= maxPolls) {
            throw new Error('Video generation timed out after 5 minutes')

          } else {
            // Continue polling
            setTimeout(poll, pollInterval)
          }

        } catch (error) {
          reject(error)
        }
      }

      poll()
    })
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a video prompt")
      return
    }

    if (!selectedImage) {
      setError("Please upload an input image")
      return
    }

    // Create new session if none exists
    if (!currentSessionId) {
      createNewSession()
    }

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: prompt,
      image: imagePreview || undefined,
      timestamp: new Date()
    }
    addMessage(userMessage)

    // Clear input
    const currentPrompt = prompt
    setPrompt("")
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }

    setIsGenerating(true)
    setError(null)
    setProgress(0)

    try {
      const formData = new FormData()
      formData.append('prompt', currentPrompt)
      formData.append('image', selectedImage!)

      // Start the job
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        let errorMessage = 'Failed to start video generation'
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch (parseError) {
          if (response.status === 504) {
            errorMessage = 'Request timed out. Please try again.'
          }
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()

      if (data.async && data.jobId) {
        // Poll for job completion
        await pollJobStatus(data.jobId, currentPrompt)
      } else {
        // Fallback to old sync response format
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: `Generated video for: "${currentPrompt}"`,
          video: data.videoUrl,
          timestamp: new Date()
        }
        addMessage(assistantMessage)
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate video')
      // Add error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `Error: ${err instanceof Error ? err.message : 'Failed to generate video'}`,
        timestamp: new Date()
      }
      addMessage(errorMessage)
      setProgress(0)
    } finally {
      setIsGenerating(false)
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-64px)] p-4">
          <AuthForm onSuccess={login} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="flex h-[calc(100vh-64px)] bg-background text-foreground relative">
        {/* Sidebar */}
        <div className={`${
          sidebarOpen ? 'w-80' : 'w-0'
        } bg-card border-r border-border flex flex-col transition-all duration-300 overflow-hidden relative`}>

          {/* Tab Icons Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant={activeTab === 'history' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('history')}
                  className="h-8 w-8 p-0"
                >
                  <History className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={activeTab === 'images' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('images')}
                  className="h-8 w-8 p-0"
                >
                  <Images className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={activeTab === 'videos' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('videos')}
                  className="h-8 w-8 p-0"
                >
                  <Video className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {activeTab === 'history' && (
              <Button
                onClick={createNewSession}
                className="w-full justify-start gap-2"
                variant="outline"
              >
                <Plus className="h-4 w-4" />
                New Video Chat
              </Button>
            )}
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-2">
            {activeTab === 'history' && (
              <div className="space-y-1">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className={`group flex items-center gap-2 p-3 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                      currentSessionId === session.id ? 'bg-muted' : ''
                    }`}
                    onClick={() => loadSession(session.id)}
                  >
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{session.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {session.updatedAt.toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteSession(session.id)
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'images' && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Image Assets</h3>
                <div className="grid grid-cols-2 gap-2">
                  {/* Placeholder for future image gallery */}
                  <div className="aspect-square bg-muted/30 rounded-lg flex items-center justify-center">
                    <Images className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="aspect-square bg-muted/30 rounded-lg flex items-center justify-center">
                    <Images className="h-6 w-6 text-muted-foreground" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Uploaded images will appear here</p>
              </div>
            )}

            {activeTab === 'videos' && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Video Assets</h3>
                <div className="space-y-2">
                  {/* Placeholder for future video gallery */}
                  <div className="aspect-video bg-muted/30 rounded-lg flex items-center justify-center">
                    <Video className="h-6 w-6 text-muted-foreground" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Generated videos will appear here</p>
              </div>
            )}
          </div>

          {/* App Info */}
          <div className="p-4 border-t border-border text-center">
            <p className="text-xs text-muted-foreground">SprayFoam TV AI Video Generator</p>
          </div>
        </div>

        {/* Collapsible Tab */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10">
          <Button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            size="sm"
            className={`h-16 w-6 rounded-r-lg rounded-l-none p-0 bg-primary hover:bg-primary/90 border-l-0 transition-all duration-300 ${
              sidebarOpen ? 'translate-x-80' : 'translate-x-0'
            }`}
          >
            {sidebarOpen ? (
              <ChevronLeft className="h-4 w-4 text-primary-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-primary-foreground" />
            )}
          </Button>
        </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="border-b border-border p-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">AI Video Generator</h1>
            <p className="text-sm text-muted-foreground">Create spray foam videos with AI</p>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <div className="text-sm text-muted-foreground">
                Welcome, {user.name || user.email}
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Start Creating Videos</h2>
                <p className="text-muted-foreground mb-6">
                  Upload an image and describe the animation you want to create. Our AI will generate a professional video for you.
                </p>
                <div className="grid grid-cols-1 gap-2 text-left">
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-sm">"Spray foam expanding in wall cavity"</p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-sm">"Professional contractor applying insulation"</p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-sm">"Time-lapse of installation process"</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'assistant' && (
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}

                  <div className={`max-w-2xl ${message.type === 'user' ? 'order-first' : ''}`}>
                    <div className={`p-4 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground ml-auto'
                        : 'bg-muted'
                    }`}>
                      {message.image && (
                        <div className="mb-3">
                          <img
                            src={message.image}
                            alt="Input"
                            className="max-w-xs rounded-lg"
                          />
                        </div>
                      )}
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      {message.video && (
                        <div className="mt-3">
                          <video
                            className="w-full max-w-md rounded-lg"
                            controls
                            src={message.video}
                          >
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 px-4">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>

                  {message.type === 'user' && (
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium">U</span>
                    </div>
                  )}
                </div>
              ))}

              {isGenerating && (
                <div className="flex gap-4 justify-start">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="max-w-2xl">
                    <div className="p-4 rounded-lg bg-muted">
                      <div className="space-y-3">
                        <p className="text-sm">Generating your video...</p>
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span>{progress}%</span>
                        </div>
                        <Progress value={progress} className="w-full" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-border p-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-background border-2 border-primary rounded-2xl p-4 focus-within:border-primary/80 transition-colors">
              {/* Image Preview */}
              {imagePreview && (
                <div className="mb-3 flex items-center gap-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => {
                      setSelectedImage(null)
                      setImagePreview(null)
                      if (fileInputRef.current) {
                        fileInputRef.current.value = ""
                      }
                    }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="mb-3 flex items-center gap-2 text-destructive text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <Textarea
                    placeholder="Describe the video animation you want to create..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleGenerate()
                      }
                    }}
                    rows={3}
                    className="resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                  />
                </div>

                <div className="flex gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-8 w-8 p-0"
                  >
                    <ImageIcon className="h-4 w-4" />
                  </Button>

                  <Button
                    size="sm"
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt.trim() || !selectedImage}
                    className="h-8 w-8 p-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mt-2 text-center">
              Upload an image and describe the animation. Press Enter to generate or Shift+Enter for new line.
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}