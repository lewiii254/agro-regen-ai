import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Sprout, Sparkles } from "lucide-react";
import { NotificationBell } from "@/components/NotificationBell";

interface PageShellProps {
  title: string;
  subtitle?: string;
  badge?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
}

export const PageShell = ({ title, subtitle, badge, icon, actions, children }: PageShellProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Ambient background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 rounded-full bg-[hsl(var(--sky))]/10 blur-3xl" />
      </div>

      {/* Sticky header */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")} className="rounded-xl">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <button onClick={() => navigate("/")} className="flex items-center gap-2.5 group">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform">
                <Sprout className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold tracking-tight hidden sm:inline">
                Agro<span className="text-primary">ReGen</span>
              </span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <NotificationBell />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-accent/5 to-[hsl(var(--sky))]/10 p-6 md:p-8 animate-fade-in-up">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-accent/20 blur-3xl" />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start gap-4">
              {icon && (
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-soft text-primary-foreground shrink-0">
                  {icon}
                </div>
              )}
              <div>
                {badge && (
                  <Badge variant="secondary" className="mb-2 gap-1.5">
                    <Sparkles className="h-3 w-3" />
                    {badge}
                  </Badge>
                )}
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {title}
                  </span>
                </h1>
                {subtitle && (
                  <p className="text-sm md:text-base text-muted-foreground mt-2 max-w-2xl">{subtitle}</p>
                )}
              </div>
            </div>
            {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
          </div>
        </section>

        {children}
      </main>
    </div>
  );
};

export default PageShell;
