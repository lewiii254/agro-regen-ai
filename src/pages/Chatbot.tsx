import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Sprout, LogOut, ArrowLeft, Send, Loader2, Bot, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const Chatbot = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI farming advisor. I can help you with soil health, crop selection, pest management, and regenerative agriculture practices. What would you like to know?"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });
  }, [navigate]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const conversationHistory = messages.map(m => ({
        role: m.role,
        content: m.content
      }));

      const { data, error } = await supabase.functions.invoke("ai-advisor", {
        body: { 
          message: userMessage,
          conversationHistory 
        },
      });

      if (error) {
        console.error("Function error:", error);
        throw error;
      }

      if (data?.response) {
        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: data.response 
        }]);
      } else {
        throw new Error("No response from AI");
      }
    } catch (error: any) {
      console.error("Chat error:", error);
      toast.error(error.message || "Failed to get response. Please try again.");
      // Remove the user message if there was an error
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-card to-card/80 backdrop-blur-md border-b border-border shadow-medium">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/dashboard")}
              className="hover:bg-primary/10 hover:scale-110 transition-all duration-300"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3 animate-fade-in">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent">
                <Sprout className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">AI Farm Advisor</h1>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSignOut}
            className="hover:bg-destructive hover:text-white transition-all duration-300"
          >
            <LogOut className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 container mx-auto px-4 py-8 flex flex-col">
        <Card className="flex-1 flex flex-col overflow-hidden border-2 border-primary/10 shadow-strong animate-scale-in">
          <ScrollArea className="flex-1 p-6" ref={scrollRef}>
            <div className="space-y-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-4 animate-fade-in-up ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {message.role === "assistant" && (
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 shadow-medium animate-pulse-glow" style={{ color: 'white' }}>
                      <Bot className="h-6 w-6 text-white" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[80%] rounded-2xl px-6 py-4 shadow-medium transition-all duration-300 hover:scale-105 ${
                      message.role === "user"
                        ? "bg-gradient-to-br from-primary to-accent text-white"
                        : "bg-gradient-to-br from-card to-secondary/50 text-foreground border-2 border-primary/10"
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </div>

                  {message.role === "user" && (
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center flex-shrink-0 shadow-medium">
                      <User className="h-6 w-6 text-white" />
                    </div>
                  )}
                </div>
              ))}
              
              {loading && (
                <div className="flex gap-4 justify-start animate-fade-in">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 shadow-medium">
                    <Bot className="h-6 w-6 text-white" />
                  </div>
                  <div className="bg-gradient-to-br from-card to-secondary/50 border-2 border-primary/10 rounded-2xl px-6 py-4 shadow-medium">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t border-border p-6 bg-gradient-to-r from-card/50 to-card">
            <form onSubmit={handleSend} className="flex gap-4">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about soil health, crop rotation, pest control..."
                className="flex-1 h-12 text-base border-2 focus:border-primary transition-colors"
                disabled={loading}
              />
              <Button 
                type="submit" 
                disabled={loading || !input.trim()}
                className="h-12 px-6 bg-gradient-to-r from-primary to-accent hover:from-primary-glow hover:to-accent text-white shadow-medium hover:shadow-accent hover:scale-110 transition-all duration-300"
              >
                <Send className="h-5 w-5" />
              </Button>
            </form>
            <p className="text-sm text-muted-foreground mt-3 text-center font-medium">
              Powered by AI · Responses are generated by artificial intelligence
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Chatbot;