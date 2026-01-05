import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { FileText, ArrowRight, Sparkles, Target, Zap } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate("/dashboard");
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm fixed w-full z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold">ResumeForge</span>
          </div>
          <Button onClick={() => navigate("/auth")}>
            Get Started
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-sm font-medium mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-accent" />
            AI-Powered Resume Tailoring
          </div>
          
          <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight mb-6 animate-slide-up">
            Land your dream job with the{" "}
            <span className="text-accent">perfect resume</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Stop sending generic resumes. Our AI analyzes job descriptions and tailors your experience to match exactly what employers are looking for.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Button size="lg" onClick={() => navigate("/auth")} className="text-lg px-8 py-6">
              Start Tailoring
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/auth")} className="text-lg px-8 py-6">
              Request Access
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-display font-bold text-center mb-12">
            How it works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card border border-border rounded-2xl p-8 shadow-soft hover:shadow-elevated transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                <FileText className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">1. Share Your Experience</h3>
              <p className="text-muted-foreground">
                Just brain dump your work history, skills, and achievements. We handle the organization.
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8 shadow-soft hover:shadow-elevated transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">2. Add the Job</h3>
              <p className="text-muted-foreground">
                Paste the job description or search our curated directory. We analyze every requirement.
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8 shadow-soft hover:shadow-elevated transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">3. Get Tailored Docs</h3>
              <p className="text-muted-foreground">
                AI generates a perfectly matched resume and cover letter in seconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-display font-bold mb-6">
            Ready to stand out?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join professionals who've landed their dream jobs with tailored resumes.
          </p>
          <Button size="lg" onClick={() => navigate("/auth")} className="text-lg px-8 py-6">
            Get Started Free
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 ResumeForge. Powered by AI.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
