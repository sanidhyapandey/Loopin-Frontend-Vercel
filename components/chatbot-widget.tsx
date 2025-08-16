"use client"
import { useState, useRef, useEffect } from "react"
import { MessageCircle, Send } from "lucide-react"
import { useGmailToken } from "@/lib/gmail-token-context"

interface ChatMessage {
  role: "user" | "bot"
  content: string
}

// Safe JSON parsing function
const safeJsonParse = (value: string | null, defaultValue: any = null) => {
  if (!value) return defaultValue;
  try {
    return JSON.parse(value);
  } catch (error) {
    console.error('[safeJsonParse] Error parsing JSON:', error, 'Value:', value);
    return defaultValue;
  }
};

// Helper function to get the appropriate access token
const getAccessToken = () => {
  // First check for Gmail token from context
  const gmailToken = useGmailToken().accessToken;
  if (gmailToken) {
    return gmailToken;
  }

  // Then check for Zoho token from sessionStorage
  const zohoTokenRaw = sessionStorage.getItem('zoho_access_token');
  if (zohoTokenRaw) {
    const zohoToken = zohoTokenRaw.startsWith('"') ? safeJsonParse(zohoTokenRaw) : zohoTokenRaw;
    return zohoToken;
  }

  return null;
};

function parseActionItems(markdown: string): string[] {
  // Extracts numbered or bulleted items from markdown, removes special chars, returns as array
  const lines = markdown.split(/\r?\n/)
  const items: string[] = []
  let currentSection = ""
  for (let line of lines) {
    // Remove markdown headers and ---
    line = line.replace(/^#+\s*/, "").replace(/^[-*]+$/, "").trim()
    if (!line) continue
    // Section title
    if (/^\d+\./.test(line) || /^\*\*/.test(line)) {
      currentSection = line.replace(/[*#\-]/g, "").trim()
      items.push(currentSection)
    } else if (/^- /.test(line)) {
      items.push(line.replace(/^- /, "").replace(/[*#\-]/g, "").trim())
    } else if (/^\*\*/.test(line)) {
      items.push(line.replace(/[*#\-]/g, "").trim())
    }
  }
  // Fallback: if nothing found, return the whole text
  if (items.length < 2) return [markdown.replace(/[*#\-]/g, "").trim()]
  return items
}

// Parse grouped events/action items from markdown-like text
function parseGroupedItems(text: string) {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean)
  const groups: { title: string, details: string[] }[] = []
  let current: { title: string, details: string[] } | null = null
  const titleRegex = /^(\d+\.|[-*])\s*(.+)$/i
  for (let line of lines) {
    const titleMatch = line.match(titleRegex)
    if (titleMatch) {
      if (current) groups.push(current)
      current = { title: titleMatch[2].replace(/\*\*/g, '').trim(), details: [] }
    } else if (current) {
      current.details.push(line.replace(/\*\*/g, ''))
    } else if (!current && line) {
      // If the first line is not a title, treat as a single group
      current = { title: line.replace(/\*\*/g, ''), details: [] }
    }
  }
  if (current) groups.push(current)
  // Fallback: if no groups, return as a single group
  if (groups.length === 0 && text) return [{ title: text, details: [] }]
  return groups
}

function cleanAndLinkify(text: string) {
  // Remove markdown special characters except for links
  let cleaned = text.replace(/[*#`>\-]/g, "");
  // Convert [text](url) to clickable links
  cleaned = cleaned.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 underline" target="_blank" rel="noopener noreferrer">$1</a>');
  return cleaned;
}

interface ChatbotWidgetProps {
  backendToken: string;
  userEmail: string;
}

export function ChatbotWidget({ backendToken, userEmail }: ChatbotWidgetProps) {
  const [chatOpen, setChatOpen] = useState(false)
  const [chatInput, setChatInput] = useState("")
  const [chatLoading, setChatLoading] = useState(false)
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
  const chatEndRef = useRef<HTMLDivElement>(null)
  const { accessToken: gmailAccessToken } = useGmailToken();

  useEffect(() => {
    if (chatOpen && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [chatHistory, chatOpen])

  const handleSendChat = async () => {
    if (!chatInput.trim()) return
    setChatLoading(true)
    setChatHistory((h) => [...h, { role: "user", content: chatInput }])
    setChatInput("") // Clear input immediately after sending
    try {
      // No need to get access token or userId for rag-summary
      const res = await fetch("http://loopin-backend-dev-env.eba-9w2ppy6p.eu-north-1.elasticbeanstalk.com/email/rag-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${backendToken}`,
        },
        body: JSON.stringify({
          userQuery: chatInput,
        })
      })
      const data = await res.json()
      let botContent = data.summary || "No response."
      setChatHistory((h) => [...h, { role: "bot", content: botContent }])
    } catch (err) {
      setChatHistory((h) => [...h, { role: "bot", content: "Error: Could not get response." }])
    }
    setChatLoading(false)
  }

  const handleChatInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !chatLoading) {
      handleSendChat()
    }
  }

  return (
    <div style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 100 }}>
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="bg-blue-600 text-white rounded-full shadow-lg p-6 flex items-center hover:bg-blue-700 transition"
          aria-label="Open chatbot"
        >
          <MessageCircle className="h-8 w-8" />
        </button>
      )}
      {chatOpen && (
        <div className="w-[700px] h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-200">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <span className="font-semibold text-blue-600 text-lg">Loopy</span>
            <button onClick={() => setChatOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4" style={{ maxHeight: 480 }}>
            {chatHistory.length === 0 && (
              <div className="text-gray-400 text-base text-center mt-16">Ask me about your meetings, action items, and more!</div>
            )}
            {chatHistory.map((msg, idx) => (
              msg.role === 'user' ? (
                <div key={idx} className="text-right">
                  <div className="inline-block bg-blue-100 text-blue-900 rounded-lg px-4 py-3 mb-1 text-base">
                    {msg.content}
                  </div>
                </div>
              ) : (
                <div key={idx} className="text-left">
                  <div className="bg-gray-100 rounded-lg px-4 py-3 mb-4 text-base border border-gray-200">
                    <span className="whitespace-pre-line" dangerouslySetInnerHTML={{ __html: cleanAndLinkify(msg.content) }} />
                  </div>
                </div>
              )
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="flex items-center border-t px-4 py-4 gap-3">
            <input
              type="text"
              className="flex-1 border rounded px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your question..."
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={handleChatInputKeyDown}
              disabled={chatLoading}
            />
            <button
              onClick={handleSendChat}
              disabled={chatLoading || !chatInput.trim()}
              className="bg-blue-600 text-white rounded-full p-4 hover:bg-blue-700 disabled:opacity-50"
              aria-label="Send"
            >
              <Send className="h-6 w-6" />
            </button>
          </div>
          {chatLoading && (
            <div className="flex items-center gap-2 px-6 pb-2">
              <span className="text-base font-semibold text-blue-600 animate-pulse">Thinking<span className="dot-1">.</span><span className="dot-2">.</span><span className="dot-3">.</span></span>
              <style>{`
                @keyframes blink {
                  0%, 80%, 100% { opacity: 0; }
                  40% { opacity: 1; }
                }
                .dot-1 { animation: blink 1.4s infinite; }
                .dot-2 { animation: blink 1.4s infinite 0.2s; }
                .dot-3 { animation: blink 1.4s infinite 0.4s; }
              `}</style>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
