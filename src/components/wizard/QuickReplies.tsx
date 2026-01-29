import { useRef, useEffect, useState } from "react";
import { QuickReply } from "@/types";

interface QuickRepliesProps {
  replies: QuickReply[];
  onSelect: (reply: QuickReply) => void;
  disabled?: boolean;
}

export default function QuickReplies({ replies, onSelect, disabled = false }: QuickRepliesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);

  // Check scroll position to show fade indicators
  const updateScrollIndicators = () => {
    const el = scrollRef.current;
    if (!el) return;
    
    setShowLeftFade(el.scrollLeft > 10);
    setShowRightFade(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    updateScrollIndicators();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", updateScrollIndicators);
      // Check on resize too
      window.addEventListener("resize", updateScrollIndicators);
      return () => {
        el.removeEventListener("scroll", updateScrollIndicators);
        window.removeEventListener("resize", updateScrollIndicators);
      };
    }
  }, [replies]);

  if (replies.length === 0) return null;

  return (
    <div className="relative">
      {/* Left fade indicator */}
      {showLeftFade && (
        <div 
          className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-muted/80 to-transparent pointer-events-none z-10" 
          aria-hidden="true"
        />
      )}
      
      {/* Right fade indicator */}
      {showRightFade && (
        <div 
          className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-muted/80 to-transparent pointer-events-none z-10" 
          aria-hidden="true"
        />
      )}

      <div 
        ref={scrollRef}
        className="flex gap-1.5 px-3 py-2 bg-muted/30 border-t border-border overflow-x-auto scrollbar-hide"
        role="group"
        aria-label="Quick reply options"
      >
        {replies.map((reply, index) => (
          <button
            key={`${reply.value}-${index}`}
            onClick={() => onSelect(reply)}
            disabled={disabled}
            className="flex-shrink-0 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-medium 
                       hover:bg-primary/20 active:bg-primary/30 transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed
                       border border-primary/20 hover:border-primary/40
                       focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1
                       whitespace-nowrap"
          >
            {reply.label}
          </button>
        ))}
      </div>
    </div>
  );
}