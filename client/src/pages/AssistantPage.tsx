import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Send,
  Sparkles,
  User,
  Bot,
  Trash2,
  Lightbulb,
  MapPin,
  Train,
  Calendar,
  Wallet,
  AlertTriangle,
} from 'lucide-react'
import { GlassCard, PageHeader } from '../components/ui'
import { useChatStore } from '../store'
import { cn } from '../lib/utils'
import type { ChatMessage } from '../types'

const suggestedPrompts = [
  { icon: <Train className="w-4 h-4" />, text: 'How to travel from KIET to Anand Vihar?', color: 'text-blue-500' },
  { icon: <Calendar className="w-4 h-4" />, text: 'Find me a budget-friendly evening plan under ₹500', color: 'text-purple-500' },
  { icon: <AlertTriangle className="w-4 h-4" />, text: 'Report a pothole near my location', color: 'text-amber-500' },
  { icon: <MapPin className="w-4 h-4" />, text: 'Will the mall be crowded this evening?', color: 'text-green-500' },
  { icon: <Wallet className="w-4 h-4" />, text: 'Optimize my monthly expenses', color: 'text-pink-500' },
  { icon: <Lightbulb className="w-4 h-4" />, text: 'Best restaurants near Connaught Place', color: 'text-orange-500' },
]

export default function AssistantPage() {
  const { messages, addMessage, clearChat, isLoading, setLoading } = useChatStore()
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim()
    if (!messageText || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString(),
    }

    addMessage(userMessage)
    setInput('')
    setLoading(true)

    try {
      const { chatAPI } = await import('../lib/api')
      const res = await chatAPI.sendMessage(messageText, useChatStore.getState().conversationId || undefined)
      const data = res.data?.data

      if (data?.chatId) {
        useChatStore.getState().setConversationId(data.chatId)
      }

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data?.message?.content || 'I received your message but couldn\'t generate a response.',
        timestamp: new Date().toISOString(),
      }
      addMessage(aiMessage)
    } catch {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `⚠️ **Could not connect to the AI server.**\n\nPlease make sure:\n- The backend server is running (\`npm run dev\` in the server folder)\n- You're logged in to your account\n- Your Gemini API key is configured in the server \`.env\` file\n\nTry again in a moment! 🔄`,
        timestamp: new Date().toISOString(),
      }
      addMessage(aiMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="page-transition flex flex-col h-[calc(100vh-2rem)]">
      <PageHeader
        title="AI Assistant"
        subtitle="Ask me anything about Delhi"
      >
        {messages.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearChat}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground glass-card"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </motion.button>
        )}
      </PageHeader>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pb-4">
        {messages.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-full"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-20 h-20 rounded-2xl bg-gradient-primary flex items-center justify-center text-white mb-6"
            >
              <Sparkles className="w-10 h-10" />
            </motion.div>
            <h2 className="text-2xl font-display font-bold mb-2">
              CitySphere <span className="text-gradient">AI</span>
            </h2>
            <p className="text-muted-foreground text-center max-w-md mb-8">
              Your intelligent city companion. Ask me about routes, events, budget, civic issues,
              or anything about Delhi!
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl w-full">
              {suggestedPrompts.map((prompt, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSend(prompt.text)}
                  className="flex items-center gap-3 p-4 rounded-xl glass-card text-left text-sm hover:!transform-none"
                >
                  <span className={prompt.color}>{prompt.icon}</span>
                  <span className="text-muted-foreground">{prompt.text}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          /* Messages */
          <div className="space-y-4 max-w-3xl mx-auto">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  'flex gap-3',
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-white flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={cn(
                    'max-w-[80%] px-4 py-3 text-sm leading-relaxed',
                    msg.role === 'user'
                      ? 'chat-bubble-user'
                      : 'chat-bubble-ai'
                  )}
                >
                  {msg.role === 'assistant' ? (
                    <div
                      className="prose prose-sm dark:prose-invert max-w-none
                        prose-headings:font-display prose-headings:mb-2 prose-headings:mt-3
                        prose-p:my-1.5 prose-li:my-0.5
                        prose-table:text-sm prose-th:px-3 prose-th:py-1.5 prose-td:px-3 prose-td:py-1.5
                        prose-strong:text-foreground"
                      dangerouslySetInnerHTML={{
                        __html: msg.content
                          .replace(/^### (.*$)/gm, '<h3>$1</h3>')
                          .replace(/^## (.*$)/gm, '<h2>$1</h2>')
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\*(.*?)\*/g, '<em>$1</em>')
                          .replace(/\n- (.*)/g, '<li>$1</li>')
                          .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
                          .replace(/\n\n/g, '<br/><br/>')
                          .replace(/\n\|(.+)\|/g, (match) => {
                            const rows = match.trim().split('\n').filter(r => r.trim())
                            if (rows.length < 2) return match
                            const headerRow = rows[0]
                            const dataRows = rows.slice(2)
                            const headers = headerRow.split('|').filter(c => c.trim())
                            let table = '<table><thead><tr>'
                            headers.forEach(h => { table += `<th>${h.trim()}</th>` })
                            table += '</tr></thead><tbody>'
                            dataRows.forEach(row => {
                              const cells = row.split('|').filter(c => c.trim())
                              table += '<tr>'
                              cells.forEach(c => { table += `<td>${c.trim()}</td>` })
                              table += '</tr>'
                            })
                            table += '</tbody></table>'
                            return table
                          })
                      }}
                    />
                  ) : (
                    msg.content
                  )}
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </motion.div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-white flex-shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="chat-bubble-ai px-4 py-3">
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full bg-muted-foreground/50"
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="pt-4 border-t border-border/50">
        <div className="max-w-3xl mx-auto">
          <GlassCard hover={false} padding="sm" className="flex items-center gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask CitySphere anything..."
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
              disabled={isLoading}
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className={cn(
                'p-2.5 rounded-xl transition-all',
                input.trim()
                  ? 'bg-gradient-primary text-white shadow-lg shadow-primary/25'
                  : 'bg-accent text-muted-foreground'
              )}
            >
              <Send className="w-4 h-4" />
            </motion.button>
          </GlassCard>
          <p className="text-xs text-center text-muted-foreground mt-2">
            CitySphere AI may produce inaccurate information. Verify important details.
          </p>
        </div>
      </div>
    </div>
  )
}
