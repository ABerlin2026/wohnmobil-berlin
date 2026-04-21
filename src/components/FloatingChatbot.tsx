import { useEffect, useRef, useState, FormEvent } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { WHATSAPP_URL } from "@/lib/contact";

type ChatRole = "user" | "assistant";
interface ChatMessage {
  role: ChatRole;
  content: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

/**
 * Floating chatbot — mobile-only (< 768px), bottom-right.
 * Streams responses from the `chat` edge function via Lovable AI.
 * No knowledge base yet (per user request); generic friendly assistant
 * that defers booking-specifics to WhatsApp.
 */
const FloatingChatbot = () => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initial greeting once when first opened
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: "assistant", content: t.chatbot.greeting }]);
    }
  }, [open, messages.length, t.chatbot.greeting]);

  // Auto-scroll on new tokens
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isStreaming]);

  // Focus input when opening
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  // Lock body scroll while open (mobile UX)
  useEffect(() => {
    if (!open) return;
    if (typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  const send = async (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isStreaming) return;

    setError(null);
    setInput("");
    const userMsg: ChatMessage = { role: "user", content: text };
    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setIsStreaming(true);

    // Strip the local-only greeting from outgoing payload
    const outgoing = nextHistory.filter(
      (m, idx) => !(idx === 0 && m.role === "assistant" && m.content === t.chatbot.greeting),
    );

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: outgoing }),
      });

      if (!resp.ok || !resp.body) {
        if (resp.status === 429) setError(t.chatbot.rateLimit);
        else if (resp.status === 402) setError(t.chatbot.paymentRequired);
        else setError(t.chatbot.error);
        setIsStreaming(false);
        return;
      }

      // Add empty assistant placeholder we'll fill as tokens arrive
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assistantSoFar = "";
      let done = false;

      const append = (chunk: string) => {
        assistantSoFar += chunk;
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", content: assistantSoFar };
          return copy;
        });
      };

      while (!done) {
        const { done: streamDone, value } = await reader.read();
        if (streamDone) break;
        buffer += decoder.decode(value, { stream: true });

        let nl: number;
        while ((nl = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, nl);
          buffer = buffer.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line || line.startsWith(":")) continue;
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6).trim();
          if (payload === "[DONE]") {
            done = true;
            break;
          }
          try {
            const parsed = JSON.parse(payload);
            const delta = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (delta) append(delta);
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch (err) {
      console.error("Chat stream error:", err);
      setError(t.chatbot.error);
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <>
      {/* Floating launcher — mobile only */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={t.chatbot.aria}
          className="fixed right-3 [@media(min-width:360px)]:right-4 z-40 flex h-12 w-12 [@media(min-width:360px)]:h-14 [@media(min-width:360px)]:w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-2xl shadow-primary/40 ring-4 ring-primary/20 transition-transform active:scale-95 md:hover:scale-105 animate-float [transform-origin:center_right]"
          style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 1rem)" }}
        >
          <MessageCircle className="h-6 w-6 [@media(min-width:360px)]:h-7 [@media(min-width:360px)]:w-7" aria-hidden="true" />
        </button>
      )}

      {/* Chat panel — mobile only, full-screen-ish */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-background h-[100dvh] md:inset-auto md:bottom-4 md:right-4 md:h-[600px] md:max-h-[calc(100vh-2rem)] md:w-[400px] md:rounded-2xl md:border md:border-border md:shadow-2xl md:overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-label={t.chatbot.title}
        >
          {/* Header */}
          <header
            className="flex shrink-0 items-center justify-between gap-3 border-b border-border bg-surface-2 px-4 py-3"
            style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 0.75rem)" }}
          >
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-base font-semibold text-foreground">{t.chatbot.title}</span>
              <span className="truncate text-xs text-muted-foreground">{t.chatbot.subtitle}</span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t.chatbot.close}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-foreground transition-colors hover:bg-surface-3"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </header>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-surface-2 text-foreground rounded-bl-md"
                  }`}
                >
                  {m.content || (
                    <span className="inline-flex gap-1" aria-label={t.chatbot.typing}>
                      <span className="h-2 w-2 animate-pulse rounded-full bg-current opacity-60" />
                      <span className="h-2 w-2 animate-pulse rounded-full bg-current opacity-60 [animation-delay:150ms]" />
                      <span className="h-2 w-2 animate-pulse rounded-full bg-current opacity-60 [animation-delay:300ms]" />
                    </span>
                  )}
                </div>
              </div>
            ))}

            {error && (
              <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="pt-2 text-center">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground underline-offset-2 hover:underline"
              >
                {t.chatbot.whatsappFallback}
              </a>
            </div>
          </div>

          {/* Input */}
          <form
            onSubmit={send}
            className="border-t border-border bg-background px-3 py-3"
            style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 0.75rem)" }}
          >
            <div className="flex items-end gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.chatbot.placeholder}
                disabled={isStreaming}
                className="flex-1 rounded-full border border-input bg-surface-2 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
                maxLength={1000}
              />
              <button
                type="submit"
                disabled={!input.trim() || isStreaming}
                aria-label={t.chatbot.send}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform active:scale-95 disabled:opacity-40 disabled:active:scale-100"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <p className="mt-2 text-center text-[10px] text-muted-foreground">{t.chatbot.poweredBy}</p>
          </form>
        </div>
      )}
    </>
  );
};

export default FloatingChatbot;
