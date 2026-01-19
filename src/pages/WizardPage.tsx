import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageWrapper from "@/components/layout/PageWrapper";
import ProgressHeader from "@/components/layout/ProgressHeader";
import ChatPanel from "@/components/wizard/ChatPanel";
import ChecklistPanel from "@/components/wizard/ChecklistPanel";
import ActionBar from "@/components/wizard/ActionBar";
import PhotoGallery from "@/components/wizard/PhotoGallery";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { useJob } from "@/hooks/useJob";
import { useChecklist } from "@/hooks/useChecklist";
import { useMessages } from "@/hooks/useMessages";
import { useConversationFlow } from "@/hooks/useConversationFlow";
import { Photo, ChecklistItem, QuickReply, Message } from "@/types";

// In-memory photo storage
let memoryPhotos: Record<string, Photo[]> = {};

export default function WizardPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { currentJob, getJob, isLoading: jobLoading } = useJob();
  const { items: checklistItems, fetchChecklist, initializeChecklist, updateItem, getProgress } = useChecklist(jobId || "");
  const { messages, fetchMessages, addMessage, isLoading: messagesLoading } = useMessages(jobId || "");
  
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);

  // Handle completing a checklist item
  const handleCompleteItem = useCallback((itemId: string, data: Record<string, unknown>) => {
    updateItem(itemId, { status: "COMPLETE", ...data });
  }, [updateItem]);

  // Conversation flow hook
  const {
    quickReplies,
    isFlowComplete,
    handleQuickReply,
    handleChecklistItemClick,
    startConversation
  } = useConversationFlow({
    jobType: currentJob?.jobType || "ELECTRICAL_PANEL",
    jurisdiction: currentJob?.jurisdiction || "PINELLAS",
    checklistItems,
    onAddMessage: addMessage,
    onCompleteItem: handleCompleteItem
  });

  // Initialize job data
  useEffect(() => {
    if (!jobId) return;
    
    const init = async () => {
      const job = await getJob(jobId);
      if (!job) {
        navigate("/");
        return;
      }
      
      let checklist = await fetchChecklist();
      if (checklist.length === 0) {
        checklist = await initializeChecklist(job.jobType, job.jurisdiction);
      }
      
      await fetchMessages();
      setPhotos(memoryPhotos[jobId] || []);
      setInitialized(true);
    };
    
    init();
  }, [jobId]);

  // Start conversation flow after initialization
  useEffect(() => {
    if (initialized && currentJob && checklistItems.length > 0 && !conversationStarted && messages.length === 0) {
      setConversationStarted(true);
      startConversation();
    }
  }, [initialized, currentJob, checklistItems, conversationStarted, messages.length, startConversation]);

  const handleSendMessage = useCallback(async (content: string) => {
    if (!jobId) return;
    
    await addMessage(content, "user");
    setIsAiLoading(true);
    
    // Simulate AI response for free-form text (in production, this would call OpenAI)
    setTimeout(async () => {
      const responses = [
        "I see! Let me help you with that. Can you take a photo so I can give you more specific guidance?",
        "Good question! Based on what you've described, I'd recommend documenting that with a photo. Tap '📷 Add Photo' below.",
        "That's helpful context! Let's continue with the checklist — I'll use this information when we get to the relevant section.",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      await addMessage(randomResponse, "assistant");
      setIsAiLoading(false);
    }, 1500);
  }, [jobId, addMessage]);

  const handleQuickReplySelect = useCallback(async (reply: QuickReply) => {
    setIsAiLoading(true);
    await handleQuickReply(reply);
    setIsAiLoading(false);
  }, [handleQuickReply]);

  const handleChecklistClick = useCallback(async (item: ChecklistItem) => {
    setIsAiLoading(true);
    await handleChecklistItemClick(item);
    setIsAiLoading(false);
  }, [handleChecklistItemClick]);

  const handleAddPhoto = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !jobId) return;
    
    // Create a preview URL
    const url = URL.createObjectURL(file);
    
    const newPhoto: Photo = {
      id: `photo-${Date.now()}`,
      jobId,
      url,
      uploadedAt: new Date(),
      status: "PROCESSING",
    };
    
    setPhotos(prev => [...prev, newPhoto]);
    memoryPhotos[jobId] = [...(memoryPhotos[jobId] || []), newPhoto];
    
    // Add a message about the photo
    await addMessage("📷 I've uploaded a photo", "user");
    setIsAiLoading(true);
    
    // Simulate AI vision analysis
    setTimeout(async () => {
      // Update photo status
      const updatedPhoto = { ...newPhoto, status: "COMPLETE" as const };
      setPhotos(prev => prev.map(p => p.id === newPhoto.id ? updatedPhoto : p));
      memoryPhotos[jobId] = (memoryPhotos[jobId] || []).map(p => p.id === newPhoto.id ? updatedPhoto : p);
      
      await addMessage(
        "I can see the equipment in your photo! Here's what I found:\n\n" +
        "• **Type**: Electrical panel\n" +
        "• **Brand**: Looks like Square D\n" +
        "• **Size**: Appears to be 200A main breaker\n\n" +
        "Does this look right?",
        "assistant"
      );
      setIsAiLoading(false);
    }, 2000);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDeletePhoto = (photoId: string) => {
    if (!jobId) return;
    setPhotos(prev => prev.filter(p => p.id !== photoId));
    memoryPhotos[jobId] = (memoryPhotos[jobId] || []).filter(p => p.id !== photoId);
  };

  const handlePreview = () => {
    navigate(`/preview/${jobId}`);
  };

  const canPreview = checklistItems.some(i => i.status === "COMPLETE");
  const progress = getProgress();

  if (!initialized || jobLoading) {
    return (
      <PageWrapper hasBottomNav={false}>
        <div className="flex items-center justify-center h-screen">
          <LoadingSpinner size="lg" text="Loading job..." />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper hasBottomNav={false} className="flex flex-col h-screen">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handlePhotoSelected}
        className="hidden"
      />
      
      {/* Progress Header - 10vh */}
      <ProgressHeader
        title={currentJob?.title || "Permit Documentation"}
        progress={progress}
        onBack={() => navigate("/")}
        showMenu
      />
      
      {/* Main Content - 65vh */}
      <div className="flex-1 h-[65vh] overflow-hidden">
        <div className="h-full flex flex-col md:flex-row gap-3 p-3">
          {/* Chat Panel */}
          <div className="flex-1 min-h-0 md:w-1/2">
            <ChatPanel
              messages={messages}
              onSendMessage={handleSendMessage}
              onQuickReply={handleQuickReplySelect}
              quickReplies={quickReplies}
              isLoading={isAiLoading}
            />
          </div>
          
          {/* Checklist Panel */}
          <div className="flex-1 min-h-0 md:w-1/2">
            <ChecklistPanel
              items={checklistItems}
              onItemClick={handleChecklistClick}
            />
          </div>
        </div>
      </div>
      
      {/* Bottom Section - 25vh */}
      <div className="h-[25vh] min-h-[150px] bg-card border-t border-border flex flex-col">
        {/* Action Bar */}
        <ActionBar
          onAddPhoto={handleAddPhoto}
          onPreview={handlePreview}
          canPreview={canPreview}
        />
        
        {/* Photo Gallery */}
        <div className="flex-1 overflow-hidden">
          <PhotoGallery
            photos={photos}
            onDeletePhoto={handleDeletePhoto}
          />
        </div>
      </div>
    </PageWrapper>
  );
}
