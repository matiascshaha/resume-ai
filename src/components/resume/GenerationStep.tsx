import { useState, useEffect } from "react";
import { FileText, Mail, Copy, Download, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface GenerationStepProps {
  personalData: string;
  jobDescription: string;
  jobTitle: string;
  companyName: string;
}

const GenerationStep = ({ personalData, jobDescription, jobTitle, companyName }: GenerationStepProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [resume, setResume] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [activeTab, setActiveTab] = useState("resume");
  const { toast } = useToast();

  const generateContent = async () => {
    if (!personalData.trim() || !jobDescription.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both your personal data and the job description.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setResume("");
    setCoverLetter("");

    try {
      const response = await supabase.functions.invoke("generate-resume", {
        body: {
          personalData,
          jobDescription,
          jobTitle,
          companyName,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const data = response.data;
      setResume(data.resume || "");
      setCoverLetter(data.coverLetter || "");

      toast({
        title: "Generation complete!",
        description: "Your resume and cover letter are ready.",
      });
    } catch (error) {
      console.error("Generation error:", error);
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: `${type} copied to clipboard.` });
  };

  const downloadAsText = (text: string, filename: string) => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="space-y-2">
        <h2 className="text-2xl font-display font-bold">Generate Your Documents</h2>
        <p className="text-muted-foreground">
          We'll create a tailored resume and cover letter using AI.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-secondary/50 rounded-xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-accent" />
            <span className="font-medium text-sm">Your Profile</span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {personalData.slice(0, 100)}...
          </p>
        </div>
        <div className="bg-secondary/50 rounded-xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Mail className="w-4 h-4 text-accent" />
            <span className="font-medium text-sm">Target Job</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {jobTitle || "Job"} {companyName && `at ${companyName}`}
          </p>
        </div>
      </div>

      {/* Generate button */}
      {!resume && !coverLetter && (
        <div className="flex justify-center py-8">
          <Button
            size="lg"
            onClick={generateContent}
            disabled={isGenerating}
            className="px-8 py-6 text-lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating with AI...
              </>
            ) : (
              <>
                <FileText className="w-5 h-5 mr-2" />
                Generate Resume & Cover Letter
              </>
            )}
          </Button>
        </div>
      )}

      {/* Results */}
      {(resume || coverLetter) && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-accent">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Generation complete!</span>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="resume" className="flex-1">
                <FileText className="w-4 h-4 mr-2" />
                Resume
              </TabsTrigger>
              <TabsTrigger value="coverLetter" className="flex-1">
                <Mail className="w-4 h-4 mr-2" />
                Cover Letter
              </TabsTrigger>
            </TabsList>

            <TabsContent value="resume" className="mt-4">
              <div className="bg-card border border-border rounded-xl">
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <span className="font-medium">Your Tailored Resume</span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(resume, "Resume")}
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadAsText(resume, `resume-${companyName || "tailored"}.txt`)}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
                <div className="p-6 max-h-[400px] overflow-y-auto">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                    {resume}
                  </pre>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="coverLetter" className="mt-4">
              <div className="bg-card border border-border rounded-xl">
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <span className="font-medium">Your Cover Letter</span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(coverLetter, "Cover letter")}
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadAsText(coverLetter, `cover-letter-${companyName || "tailored"}.txt`)}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
                <div className="p-6 max-h-[400px] overflow-y-auto">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                    {coverLetter}
                  </pre>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-center pt-4">
            <Button variant="outline" onClick={generateContent} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Regenerating...
                </>
              ) : (
                "Regenerate"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerationStep;
