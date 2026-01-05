import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FileText, LogOut, ArrowLeft, ArrowRight, AlertCircle } from "lucide-react";
import StepIndicator from "@/components/resume/StepIndicator";
import PersonalDataStep from "@/components/resume/PersonalDataStep";
import JobDescriptionStep from "@/components/resume/JobDescriptionStep";
import GenerationStep from "@/components/resume/GenerationStep";
import type { User } from "@supabase/supabase-js";

const steps = [
  { id: 1, title: "Your Info", description: "Experience & skills" },
  { id: 2, title: "Target Job", description: "Job description" },
  { id: 3, title: "Generate", description: "Resume & cover letter" },
];

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isApproved, setIsApproved] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [personalData, setPersonalData] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/auth");
      } else {
        setTimeout(() => {
          checkApprovalStatus(session.user.id);
        }, 0);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/auth");
      } else {
        checkApprovalStatus(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkApprovalStatus = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("is_approved")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Error checking approval:", error);
      setIsApproved(false);
    } else {
      setIsApproved(data?.is_approved ?? false);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Logged out", description: "See you next time!" });
    navigate("/auth");
  };

  const canProceed = () => {
    if (currentStep === 1) return personalData.trim().length > 50;
    if (currentStep === 2) return jobDescription.trim().length > 50;
    return true;
  };

  const handleJobDetailsChange = (title: string, company: string) => {
    if (title) setJobTitle(title);
    if (company) setCompanyName(company);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (isApproved === false) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold">ResumeForge</span>
            </div>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </header>

        <div className="container mx-auto px-4 py-16 max-w-lg text-center">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-display font-bold mb-4">Account Pending Approval</h1>
          <p className="text-muted-foreground mb-6">
            Your account is awaiting approval. We'll notify you via email once you're approved to use ResumeForge.
          </p>
          <p className="text-sm text-muted-foreground">
            Logged in as: {user?.email}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold">ResumeForge</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {user?.email}
            </span>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Step indicator */}
        <div className="mb-12">
          <StepIndicator steps={steps} currentStep={currentStep} />
        </div>

        {/* Step content */}
        <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-soft">
          {currentStep === 1 && (
            <PersonalDataStep value={personalData} onChange={setPersonalData} />
          )}
          {currentStep === 2 && (
            <JobDescriptionStep 
              value={jobDescription} 
              onChange={setJobDescription}
              onJobDetailsChange={handleJobDetailsChange}
            />
          )}
          {currentStep === 3 && (
            <GenerationStep
              personalData={personalData}
              jobDescription={jobDescription}
              jobTitle={jobTitle}
              companyName={companyName}
            />
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {currentStep < 3 && (
            <Button
              onClick={() => setCurrentStep((s) => Math.min(3, s + 1))}
              disabled={!canProceed()}
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
