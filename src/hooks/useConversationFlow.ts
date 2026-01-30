import { useState, useCallback } from "react";
import { QuickReply, ChecklistItem, Message } from "@/types";
import { getQuestionsForItem, getFirstIncompleteQuestions } from "@/data/checklistQuestions";

interface ConversationState {
  activeItemTitle: string | null;
  questionIndex: number;
  answers: Record<string, string>;
  quickReplies: QuickReply[];
  isComplete: boolean;
}

interface UseConversationFlowProps {
  jobType: string;
  jurisdiction: string;
  checklistItems: ChecklistItem[];
  onAddMessage: (content: string, role: "user" | "assistant") => Promise<Message>;
  onCompleteItem: (itemId: string, data: Record<string, unknown>) => void;
}

export function useConversationFlow({
  jobType,
  jurisdiction,
  checklistItems,
  onAddMessage,
  onCompleteItem
}: UseConversationFlowProps) {
  const [state, setState] = useState<ConversationState>({
    activeItemTitle: null,
    questionIndex: 0,
    answers: {},
    quickReplies: [],
    isComplete: false
  });

  // Start the conversation with a welcome message
  const startConversation = useCallback(async () => {
    // Check actual completion status first
    const incompleteItems = checklistItems.filter(item => item.status !== "COMPLETE");
    const completedCount = checklistItems.filter(item => item.status === "COMPLETE").length;
    
    if (incompleteItems.length === 0) {
      await onAddMessage(
        "🎉 Great news! All your checklist items are complete. Tap 'Preview Package' to see your permit documents!",
        "assistant"
      );
      setState(prev => ({ ...prev, quickReplies: [], isComplete: true }));
      return;
    }

    // Try to find an incomplete item with questions
    const firstIncompleteWithQuestions = getFirstIncompleteQuestions(jobType, jurisdiction, checklistItems);
    
    if (firstIncompleteWithQuestions) {
      const { itemTitle } = firstIncompleteWithQuestions;
      const welcomeMessage = `Hey! I'll help you get this permit ready. You have **${incompleteItems.length} items** to document.\n\nReady to start with "${itemTitle}"?`;
      
      await onAddMessage(welcomeMessage, "assistant");
      
      setState({
        activeItemTitle: null,
        questionIndex: 0,
        answers: {},
        quickReplies: [
          { label: "Yes, let's go! ✨", value: "start" },
          { label: "📷 Upload a photo first", value: "photo" }
        ],
        isComplete: false
      });
    } else {
      // No questions defined for this job type yet - provide photo-based workflow
      const firstIncompleteTitle = incompleteItems[0].title;
      await onAddMessage(
        `Hey! I'll help you document this permit. You have **${incompleteItems.length} requirements** to complete.\n\nLet's start by taking photos of what you have. Tap '📷 Add Photo' below to document **${firstIncompleteTitle}**.`,
        "assistant"
      );
      
      setState({
        activeItemTitle: null,
        questionIndex: 0,
        answers: {},
        quickReplies: [
          { label: "📷 Add Photo", value: "photo" },
          { label: "Tell me more", value: "explain" }
        ],
        isComplete: false
      });
    }
  }, [jobType, jurisdiction, checklistItems, onAddMessage]);

  // Start questions for a specific checklist item
  const startItemQuestions = useCallback(async (itemTitle: string) => {
    const questions = getQuestionsForItem(jobType, jurisdiction, itemTitle);
    
    if (questions.length === 0) {
      await onAddMessage(
        `I don't have specific questions for "${itemTitle}" yet. Would you like to upload a photo instead?`,
        "assistant"
      );
      setState(prev => ({
        ...prev,
        quickReplies: [
          { label: "📷 Add Photo", value: "photo" },
          { label: "Skip for now", value: "skip" }
        ]
      }));
      return;
    }

    const firstQuestion = questions[0];
    const message = firstQuestion.intro 
      ? `${firstQuestion.intro}\n\n${firstQuestion.question}`
      : firstQuestion.question;

    await onAddMessage(message, "assistant");
    
    setState({
      activeItemTitle: itemTitle,
      questionIndex: 0,
      answers: {},
      quickReplies: firstQuestion.options,
      isComplete: false
    });
  }, [jobType, jurisdiction, onAddMessage]);

  // Handle when user selects a quick reply
  const handleQuickReply = useCallback(async (reply: QuickReply) => {
    // Add user's selection as a message
    await onAddMessage(reply.label, "user");

    // Handle special values
    if (reply.value === "start") {
      const firstIncomplete = getFirstIncompleteQuestions(jobType, jurisdiction, checklistItems);
      if (firstIncomplete) {
        await startItemQuestions(firstIncomplete.itemTitle);
      }
      return;
    }

    if (reply.value === "photo" || reply.value === "take_photo") {
      await onAddMessage(
        "Great idea! Tap the '📷 Add Photo' button below to take or upload a photo. I'll analyze it and fill in the details for you.",
        "assistant"
      );
      setState(prev => ({ ...prev, quickReplies: [] }));
      return;
    }

    if (reply.value === "skip" || reply.value === "pause") {
      await onAddMessage(
        "No problem! You can come back anytime. Your progress is saved. When you're ready to continue, just tap on a checklist item.",
        "assistant"
      );
      setState(prev => ({ ...prev, quickReplies: [] }));
      return;
    }

    if (reply.value === "explain") {
      const incompleteItems = checklistItems.filter(item => item.status !== "COMPLETE");
      if (incompleteItems.length > 0) {
        await onAddMessage(
          `Here's what we need to document:\n\n${incompleteItems.map((item, i) => `${i + 1}. **${item.title}**\n   ${item.description}`).join('\n\n')}\n\nThe easiest way is to take photos as we go. Ready to start?`,
          "assistant"
        );
        setState(prev => ({
          ...prev,
          quickReplies: [
            { label: "Yes, let's do it! ✨", value: "start" },
            { label: "📷 Add Photo", value: "photo" }
          ]
        }));
      }
      return;
    }

    // Handle regular question answers
    if (!state.activeItemTitle) return;

    const questions = getQuestionsForItem(jobType, jurisdiction, state.activeItemTitle);
    const currentQuestion = questions[state.questionIndex];
    
    if (!currentQuestion) return;

    // Store the answer
    const newAnswers = { ...state.answers, [currentQuestion.field]: reply.value };

    // Check for follow-up message
    if (currentQuestion.followUp && currentQuestion.followUp[reply.value]) {
      await onAddMessage(currentQuestion.followUp[reply.value], "assistant");
      
      // If they need help (unknown, photo, etc.), offer photo option
      if (reply.value === "unknown" || reply.value === "photo" || reply.value === "explain") {
        setState(prev => ({
          ...prev,
          answers: newAnswers,
          quickReplies: [
            { label: "📷 Take Photo", value: "take_photo" },
            { label: "Continue anyway", value: "continue" }
          ]
        }));
        return;
      }
    }

    // Move to next question or complete item
    const nextIndex = state.questionIndex + 1;
    
    if (nextIndex < questions.length) {
      const nextQuestion = questions[nextIndex];
      const message = nextQuestion.intro 
        ? `${nextQuestion.intro}\n\n${nextQuestion.question}`
        : nextQuestion.question;
      
      await onAddMessage(message, "assistant");
      
      setState(prev => ({
        ...prev,
        questionIndex: nextIndex,
        answers: newAnswers,
        quickReplies: nextQuestion.options
      }));
    } else {
      // Complete this checklist item
      await completeCurrentItem(newAnswers);
    }
  }, [state, jobType, jurisdiction, checklistItems, onAddMessage, startItemQuestions]);

  // Handle "continue" after a follow-up
  const handleContinue = useCallback(async () => {
    if (!state.activeItemTitle) return;

    const questions = getQuestionsForItem(jobType, jurisdiction, state.activeItemTitle);
    const nextIndex = state.questionIndex + 1;
    
    if (nextIndex < questions.length) {
      const nextQuestion = questions[nextIndex];
      await onAddMessage(nextQuestion.question, "assistant");
      
      setState(prev => ({
        ...prev,
        questionIndex: nextIndex,
        quickReplies: nextQuestion.options
      }));
    } else {
      await completeCurrentItem(state.answers);
    }
  }, [state, jobType, jurisdiction, onAddMessage]);

  // Complete the current checklist item
  const completeCurrentItem = useCallback(async (answers: Record<string, string>) => {
    if (!state.activeItemTitle) return;

    const currentItem = checklistItems.find(item => item.title === state.activeItemTitle);
    if (currentItem) {
      onCompleteItem(currentItem.id, answers);
    }

    await onAddMessage(
      `✅ **${state.activeItemTitle}** — Done! I've saved all that info.`,
      "assistant"
    );

    // Move to next incomplete item
    await moveToNextItem();
  }, [state.activeItemTitle, checklistItems, onCompleteItem, onAddMessage]);

  // Move to the next incomplete checklist item
  const moveToNextItem = useCallback(async () => {
    // Check actual completion status
    const remainingIncomplete = checklistItems.filter(
      item => item.status !== "COMPLETE" && item.title !== state.activeItemTitle
    );

    if (remainingIncomplete.length === 0) {
      await onAddMessage(
        "🎉 **All done!** You've completed all the requirements. Tap 'Preview Package' to see your permit documents!",
        "assistant"
      );
      
      setState({
        activeItemTitle: null,
        questionIndex: 0,
        answers: {},
        quickReplies: [],
        isComplete: true
      });
      return;
    }

    // Try to find next item with questions
    const nextIncompleteWithQuestions = getFirstIncompleteQuestions(
      jobType, 
      jurisdiction, 
      remainingIncomplete
    );

    if (nextIncompleteWithQuestions) {
      await onAddMessage(
        `Great! **${remainingIncomplete.length} items** left. Let's move on to **${nextIncompleteWithQuestions.itemTitle}**. Ready?`,
        "assistant"
      );
      
      setState({
        activeItemTitle: nextIncompleteWithQuestions.itemTitle,
        questionIndex: 0,
        answers: {},
        quickReplies: [
          { label: "Yes, continue! ✨", value: "continue_next" },
          { label: "Take a break", value: "pause" }
        ],
        isComplete: false
      });
    } else {
      // No questions for remaining items - suggest photo approach
      const nextTitle = remainingIncomplete[0].title;
      await onAddMessage(
        `Good progress! **${remainingIncomplete.length} items** left.\n\nFor **${nextTitle}**, let's document it with photos. Tap '📷 Add Photo' below.`,
        "assistant"
      );
      
      setState({
        activeItemTitle: null,
        questionIndex: 0,
        answers: {},
        quickReplies: [
          { label: "📷 Add Photo", value: "photo" },
          { label: "Skip for now", value: "pause" }
        ],
        isComplete: false
      });
    }
  }, [jobType, jurisdiction, checklistItems, state.activeItemTitle, onAddMessage]);

  // Handle clicking on a checklist item
  const handleChecklistItemClick = useCallback(async (item: ChecklistItem) => {
    if (item.status === "COMPLETE") {
      await onAddMessage(
        `✅ **${item.title}** is already complete! Want to review or change anything?`,
        "assistant"
      );
      setState(prev => ({
        ...prev,
        quickReplies: [
          { label: "Review answers", value: "review" },
          { label: "Make changes", value: "edit" },
          { label: "Continue", value: "continue_flow" }
        ]
      }));
      return;
    }

    await startItemQuestions(item.title);
  }, [startItemQuestions, onAddMessage]);

  // Handle continuing to the next item after a pause
  const handleContinueNext = useCallback(async () => {
    if (state.activeItemTitle) {
      await startItemQuestions(state.activeItemTitle);
    }
  }, [state.activeItemTitle, startItemQuestions]);

  return {
    quickReplies: state.quickReplies,
    isFlowComplete: state.isComplete,
    activeItemTitle: state.activeItemTitle,
    startConversation,
    handleQuickReply: async (reply: QuickReply) => {
      if (reply.value === "continue_next") {
        await handleContinueNext();
      } else if (reply.value === "continue") {
        await handleContinue();
      } else if (reply.value === "continue_flow") {
        await moveToNextItem();
      } else {
        await handleQuickReply(reply);
      }
    },
    handleChecklistItemClick,
    startItemQuestions
  };
}
