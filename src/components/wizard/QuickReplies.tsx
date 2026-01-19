import { QuickReply } from "@/types";

interface QuickRepliesProps {
  replies: QuickReply[];
  onSelect: (reply: QuickReply) => void;
  disabled?: boolean;
}

export default function QuickReplies({ replies, onSelect, disabled = false }: QuickRepliesProps) {
  if (replies.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 px-4 py-3 bg-muted/30 border-t border-border">
      {replies.map((reply, index) => (
        <button
          key={`${reply.value}-${index}`}
          onClick={() => onSelect(reply)}
          disabled={disabled}
          className="px-4 py-2.5 bg-primary/10 text-primary rounded-full text-sm font-medium 
                     hover:bg-primary/20 active:bg-primary/30 transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed
                     border border-primary/20 hover:border-primary/40
                     focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          {reply.label}
        </button>
      ))}
    </div>
  );
}
