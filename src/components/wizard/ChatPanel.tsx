import { useRef, useEffect, useState, useCallback } from "react";
import { Send } from "lucide-react";
import { Message, QuickReply } from "@/types";
import QuickReplies from "./QuickReplies";

interface ChatPanelProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  onQuickReply?: (reply: QuickReply) => void;
  quickReplies?: QuickReply[];
  isLoading?: boolean;
}

export default function ChatPanel({ 
  messages, 
  onSendMessage, 
  onQuickReply,
  quickReplies = [],
  isLoading = false 
}: ChatPanelProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState("");

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, quickReplies]);

  // iOS keyboard handling - adjust viewport when keyboard opens
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;

    const onResize = () => {
      const keyboardHeight = window.innerHeight - viewport.height;
      document.documentElement.style.setProperty('--keyboard-height', `${keyboardHeight}px`);
    };

    viewport.addEventListener('resize', onResize);
    viewport.addEventListener('scroll', onResize);
    
    return () => {
      viewport.removeEventListener('resize', onResize);
      viewport.removeEventListener('scroll', onResize);
    };
  }, []);

  // Auto-resize textarea
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, []);

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputValue, adjustTextareaHeight]);

  // Format timestamp
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      // Add haptic feedback
      navigator.vibrate?.(10);
      onSendMessage(inputValue.trim());
      setInputValue("");
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Submit on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleQuickReplySelect = (reply: QuickReply) => {
    // Add haptic feedback
    navigator.vibrate?.(10);
    if (onQuickReply) {
      onQuickReply(reply);
    }
  };

  // Format message content with markdown-like styling
  const formatMessage = (content: string) => {
    const paragraphs = content.split('\n\n');
    
    return paragraphs.map((paragraph, i) => {
      const parts = paragraph.split(/(\*\*[^*]+\*\*)/g);
      
      return (
        <p key={i} className={i > 0 ? "mt-1.5" : ""}>
          {parts.map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={j} className="font-semibold">{part.slice(2, -2)}</strong>;
            }
            return part.split('\n').map((line, k) => (
              <span key={`${j}-${k}`}>
                {k > 0 && <br />}
                {line}
              </span>
            ));
          })}
        </p>
      );
    });
  };

  return (
    <div className="flex flex-col h-full bg-card md:rounded-xl md:border md:border-border overflow-hidden">
      {/* Compact header - hidden on mobile since we have tabs */}
      <div className="hidden md:block px-3 py-2 border-b border-border bg-muted/30">
        <h2 className="text-sm font-semibold text-foreground">AI Assistant</h2>
      </div>
      
      {/* Messages area */}
      <div 
        className="flex-1 overflow-y-auto p-3 space-y-2.5"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-6">
            <p className="text-xs">Getting ready...</p>
          </div>
        ) : (
          messages.map((message, index) => {
            // Show timestamp if first message or different minute from previous
            const showTimestamp = index === 0 || 
              formatTime(message.timestamp) !== formatTime(messages[index - 1].timestamp);
            
            return (
              <div key={message.id}>
                {showTimestamp && (
                  <div className="text-center my-2">
                    <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                )}
                <div
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-muted text-foreground rounded-bl-md"
                    }`}
                  >
                    <div className="text-xs leading-relaxed">
                      {formatMessage(message.content)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        
        {isLoading && (
          <div className="flex justify-start" aria-busy="true" aria-label="AI is typing">
            <div className="bg-muted rounded-2xl rounded-bl-md px-3 py-2">
              <div className="flex space-x-1" role="status">
                <span className="sr-only">AI is thinking...</span>
                <div className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies - horizontal scroll */}
      {quickReplies.length > 0 && !isLoading && (
        <QuickReplies 
          replies={quickReplies} 
          onSelect={handleQuickReplySelect}
          disabled={isLoading}
        />
      )}
      
      {/* Compact input form */}
      <form onSubmit={handleSubmit} className="p-2 border-t border-border bg-background">
        <div className="flex gap-2 items-end">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 px-3 py-2 rounded-2xl bg-muted border-none text-xs 
                       focus:outline-none focus:ring-2 focus:ring-primary/50
                       placeholder:text-muted-foreground resize-none
                       min-h-[36px] max-h-[120px]"
            disabled={isLoading}
            aria-label="Message input"
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            aria-label="Send message"
            className="w-8 h-8 flex items-center justify-center rounded-full 
                       bg-primary text-primary-foreground
                       hover:bg-primary/90 active:bg-primary/80
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors flex-shrink-0
                       focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
}