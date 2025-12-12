"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Button,
  Tooltip,
  Avatar,
  Chip,
} from "@heroui/react";
import {
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  SparklesIcon,
  PaperAirplaneIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAuth } from "@clerk/nextjs";
import { sendAiMessage } from "@/app/actions/ai.actions";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
  isStreaming?: boolean;
}

export function AIAssistantDrawer() {
  const { getToken } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingMessageIndex, setStreamingMessageIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  }, [input]);

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    (process.env.NODE_ENV === "development"
      ? "http://localhost:3001"
      : "https://domestic-brigitta-sbbas1-886c7f21.koyeb.app");

  const sendMessage = async () => {
    const question = input.trim();
    if (!question || loading || isStreaming) return;

    // Prepare user and placeholder assistant messages in one state update to avoid index races
    let assistantIndex = -1;
    setMessages((prev) => {
      const userMsg: ChatMessage = { role: "user", content: question, timestamp: new Date() };
      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: "",
        timestamp: new Date(),
        isStreaming: true,
      };
      const next = [...prev, userMsg, assistantMsg];
      assistantIndex = next.length - 1;
      return next;
    });

    setInput("");
    setLoading(true);
    setIsStreaming(true);
    setStreamingMessageIndex((prev) => assistantIndex);

    try {
      abortControllerRef.current = new AbortController();

      const token = await getToken();
      if (!token) throw new Error("No auth token");

      const response = await fetch(`${baseUrl}/api/v1/ai/assistant/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: question }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;

        const idx = assistantIndex;
        setMessages((prev) =>
          prev.map((m, i) => (i === idx ? { ...m, content: accumulated } : m))
        );
      }

      const idx = assistantIndex;
      setMessages((prev) =>
        prev.map((m, i) => (i === idx ? { ...m, isStreaming: false } : m))
      );
    } catch (err) {
      console.error("Streaming error:", err);
      // Fallback to non-streaming endpoint you already have
      try {
        const res = await sendAiMessage(question);
        const answer = res?.data ?? "Sorry, I couldn't process your request.";
        const idx = assistantIndex;
        setMessages((prev) =>
          prev.map((m, i) => (i === idx ? { ...m, content: answer, isStreaming: false } : m))
        );
      } catch {
        const idx = assistantIndex;
        setMessages((prev) =>
          prev.map((m, i) =>
            i === idx
              ? {
                  ...m,
                  content: "I'm having trouble connecting right now. Please try again.",
                  isStreaming: false,
                }
              : m
          )
        );
      }
    } finally {
      setLoading(false);
      setIsStreaming(false);
      setStreamingMessageIndex(null);
      abortControllerRef.current = null;
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
    textareaRef.current?.focus();
  };

  const clearChat = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort(); // cancel ongoing stream
    }
    setMessages([]);
    setIsStreaming(false);
    setStreamingMessageIndex(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickPrompts = [
    "How much did I spend this month?",
    "Show my budget summary",
    "What bills are due soon?",
    "Help me create a savings plan",
  ];

  return (
    <>
      <Tooltip content="Chat with AI Assistant" placement="left" delay={500}>
        <Button
          isIconOnly
          className="fixed bottom-6 right-6 z-50 shadow-2xl shadow-primary/25 bg-gradient-to-r from-primary to-secondary hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105 active:scale-95"
          size="lg"
          radius="full"
          variant="solid"
          color="primary"
          onPress={() => setIsOpen(true)}
        >
          <ChatBubbleLeftRightIcon className="h-6 w-6" />
        </Button>
      </Tooltip>

      <Drawer
        size="md"
        placement="right"
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        hideCloseButton
        backdrop="blur"
        classNames={{
          base: "max-w-md",
          backdrop: "bg-background/60 backdrop-blur-md",
        }}
        motionProps={{
          variants: {
            enter: {
              x: 0,
              opacity: 1,
              transition: { duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] },
            },
            exit: {
              x: "100%",
              opacity: 0,
              transition: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] },
            },
          },
        }}
      >
        <DrawerContent className="bg-background/95 backdrop-blur-xl border-l border-divider/50">
          <DrawerHeader className="border-b border-divider/50 bg-gradient-to-r from-primary/5 to-secondary/5">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar
                    size="sm"
                    className="bg-gradient-to-r from-primary to-secondary"
                    icon={<SparklesIcon className="h-4 w-4 text-white" />}
                  />
                  <div
                    className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${
                      isStreaming ? "bg-warning animate-pulse" : "bg-success"
                    }`}
                  />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">AI Assistant</h2>
                  <p className="text-xs text-foreground-500">
                    {isStreaming ? "Typing..." : loading ? "Thinking..." : "Online"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <Button
                    size="sm"
                    variant="light"
                    onPress={clearChat}
                    className="text-foreground-500 hover:text-foreground"
                    isDisabled={isStreaming}
                  >
                    Clear
                  </Button>
                )}
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  radius="full"
                  onPress={() => setIsOpen(false)}
                  className="text-foreground-500 hover:text-foreground"
                >
                  <XMarkIcon className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </DrawerHeader>

          <DrawerBody className="p-0 flex flex-col h-[calc(100vh-140px)]">
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col justify-center items-center text-center space-y-6">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center">
                      <SparklesIcon className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-success rounded-full animate-pulse border-2 border-background" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-foreground">Hello! I'm your AI assistant</h3>
                    <p className="text-foreground-500 max-w-xs">
                      I can help you with budgeting, expenses, financial insights, and more.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center max-w-xs">
                    {quickPrompts.slice(0, 3).map((prompt, idx) => (
                      <Chip
                        key={idx}
                        size="sm"
                        variant="flat"
                        color="primary"
                        className="cursor-pointer hover:bg-primary/20 transition-colors"
                        onClick={() => handleQuickPrompt(prompt)}
                      >
                        {prompt}
                      </Chip>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((message, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.role === "assistant" && (
                      <Avatar
                        size="sm"
                        className="bg-gradient-to-r from-primary to secondary shrink-0 mt-1"
                        icon={<SparklesIcon className="h-3 w-3 text-white" />}
                      />
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 relative ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-default-100 text-foreground rounded-bl-md"
                      }`}
                    >
                      <div className="prose whitespace-pre-wrap break-words prose-invert max-w-none">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            a: ({ node, ...props }) => (
                              <a {...props} target="_blank" rel="noopener noreferrer" />
                            ),
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                      {message.isStreaming && (
                        <div className="inline-flex ml-1">
                          <div className="w-1 h-4 bg-primary animate-pulse" />
                        </div>
                      )}
                    </div>
                    {message.role === "user" && (
                      <Avatar
                        size="sm"
                        className="bg-default-300 shrink-0 mt-1"
                        icon={<UserIcon className="h-3 w-3 text-default-600" />}
                      />
                    )}
                  </div>
                ))
              )}

              {loading && !isStreaming && (
                <div className="flex gap-3 justify-start">
                  <Avatar
                    size="sm"
                    className="bg-gradient-to-r from-primary to-secondary shrink-0 mt-1"
                    icon={<SparklesIcon className="h-3 w-3 text-white" />}
                  />
                  <div className="bg-default-100 rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex space-x-1">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-2 h-2 bg-default-400 rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-divider/50 bg-background/50 backdrop-blur-sm p-4 space-y-3">
              <div className="flex gap-2 items-center">
                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={isStreaming ? "AI is responding..." : "Type your message..."}
                    className="w-full resize-none rounded-2xl bg-default-100 border-2 border-transparent focus:border-primary/50 focus:bg-background px-4 py-3 pr-12 text-sm placeholder:text-foreground-400 focus:outline-none transition-colors max-h-[120px] min-h-[48px]"
                    rows={1}
                    disabled={isStreaming}
                  />
                </div>
                <Button
                  isIconOnly
                  size="lg"
                  radius="full"
                  color="primary"
                  variant="solid"
                  isDisabled={!input.trim() || loading || isStreaming}
                  isLoading={loading && !isStreaming}
                  onPress={sendMessage}
                  className="shrink-0"
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}