import { useState } from "react";
import { FileText, Link, Upload } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import InputOptionBar from "./InputOptionBar";

interface PersonalDataStepProps {
  value: string;
  onChange: (value: string) => void;
}

const PersonalDataStep = ({ value, onChange }: PersonalDataStepProps) => {
  const [activeOption, setActiveOption] = useState("text");
  const [urlInput, setUrlInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const options = [
    { id: "text", label: "Paste Text", icon: <FileText className="w-4 h-4" /> },
    { id: "url", label: "From URL", icon: <Link className="w-4 h-4" /> },
    { id: "file", label: "Upload File", icon: <Upload className="w-4 h-4" /> },
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type === "text/plain" || file.name.endsWith(".txt") || file.name.endsWith(".md")) {
      const text = await file.text();
      onChange(text);
      toast({ title: "File loaded", description: "Your data has been imported successfully." });
    } else {
      toast({ 
        title: "File type not supported", 
        description: "Please upload a .txt or .md file for now. PDF support coming soon!", 
        variant: "destructive" 
      });
    }
  };

  const handleUrlParse = async () => {
    if (!urlInput.trim()) {
      toast({ title: "Enter a URL", description: "Please paste a LinkedIn or portfolio URL", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    // For now, we'll show a placeholder message
    // In a real implementation, we'd call an edge function to parse the URL
    setTimeout(() => {
      setIsLoading(false);
      toast({ 
        title: "URL parsing coming soon!", 
        description: "For now, please copy your resume content and paste it in the text option." 
      });
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="space-y-2">
        <h2 className="text-2xl font-display font-bold">Tell us about yourself</h2>
        <p className="text-muted-foreground">
          Share your experience, skills, and achievements. Be as detailed as you want – just dump everything here!
        </p>
      </div>

      <InputOptionBar 
        options={options} 
        activeOption={activeOption} 
        onOptionChange={setActiveOption} 
      />

      <div className="min-h-[300px]">
        {activeOption === "text" && (
          <div className="space-y-3 animate-fade-in">
            <Label htmlFor="personalData">Your Experience & Skills</Label>
            <Textarea
              id="personalData"
              placeholder="I worked at Company X as a Senior Developer for 3 years where I led a team of 5 engineers. We built a customer portal that increased user engagement by 40%. I'm proficient in React, TypeScript, Node.js...

Just brain dump everything here! Include:
• Past job titles and responsibilities  
• Key achievements and metrics
• Skills and technologies
• Education and certifications
• Side projects or volunteer work"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="min-h-[280px] resize-none"
            />
          </div>
        )}

        {activeOption === "url" && (
          <div className="space-y-4 animate-fade-in">
            <Label htmlFor="urlInput">LinkedIn or Portfolio URL</Label>
            <div className="flex gap-3">
              <Input
                id="urlInput"
                type="url"
                placeholder="https://linkedin.com/in/yourprofile"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="flex-1"
              />
              <button
                onClick={handleUrlParse}
                disabled={isLoading}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isLoading ? "Loading..." : "Import"}
              </button>
            </div>
            <p className="text-sm text-muted-foreground">
              We'll extract your profile information automatically.
            </p>
          </div>
        )}

        {activeOption === "file" && (
          <div className="space-y-4 animate-fade-in">
            <Label>Upload Your Resume</Label>
            <div className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-accent/50 transition-colors">
              <input
                type="file"
                accept=".txt,.md,.pdf,.docx"
                onChange={handleFileUpload}
                className="hidden"
                id="fileUpload"
              />
              <label htmlFor="fileUpload" className="cursor-pointer">
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="font-medium">Click to upload or drag and drop</p>
                <p className="text-sm text-muted-foreground mt-1">
                  TXT, MD files supported (PDF coming soon)
                </p>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalDataStep;
