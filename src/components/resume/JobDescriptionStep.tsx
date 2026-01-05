import { useState } from "react";
import { FileText, Link, Upload, Search } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import InputOptionBar from "./InputOptionBar";

interface JobDescriptionStepProps {
  value: string;
  onChange: (value: string) => void;
  onJobDetailsChange: (title: string, company: string) => void;
}

const JobDescriptionStep = ({ value, onChange, onJobDetailsChange }: JobDescriptionStepProps) => {
  const [activeOption, setActiveOption] = useState("text");
  const [urlInput, setUrlInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const options = [
    { id: "text", label: "Paste Text", icon: <FileText className="w-4 h-4" /> },
    { id: "url", label: "From URL", icon: <Link className="w-4 h-4" /> },
    { id: "search", label: "Search Jobs", icon: <Search className="w-4 h-4" /> },
    { id: "file", label: "Upload File", icon: <Upload className="w-4 h-4" /> },
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type === "text/plain" || file.name.endsWith(".txt") || file.name.endsWith(".md")) {
      const text = await file.text();
      onChange(text);
      toast({ title: "File loaded", description: "Job description imported successfully." });
    } else {
      toast({ 
        title: "File type not supported", 
        description: "Please upload a .txt or .md file for now.", 
        variant: "destructive" 
      });
    }
  };

  const handleUrlParse = async () => {
    if (!urlInput.trim()) {
      toast({ title: "Enter a URL", description: "Please paste a job posting URL", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    // Placeholder for URL parsing
    setTimeout(() => {
      setIsLoading(false);
      toast({ 
        title: "URL parsing coming soon!", 
        description: "For now, please copy the job description and paste it in the text option." 
      });
    }, 1000);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({ title: "Enter a search query", description: "Try 'Senior Developer at Google'", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    // Placeholder for job search
    setTimeout(() => {
      setIsLoading(false);
      toast({ 
        title: "Job search coming soon!", 
        description: "This feature will let you search real job postings. For now, paste the job description." 
      });
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="space-y-2">
        <h2 className="text-2xl font-display font-bold">What job are you applying for?</h2>
        <p className="text-muted-foreground">
          Paste the job description so we can tailor your resume perfectly.
        </p>
      </div>

      <InputOptionBar 
        options={options} 
        activeOption={activeOption} 
        onOptionChange={setActiveOption} 
      />

      <div className="min-h-[300px]">
        {activeOption === "text" && (
          <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input
                  id="jobTitle"
                  placeholder="Senior Software Engineer"
                  onChange={(e) => onJobDetailsChange(e.target.value, "")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  placeholder="Acme Inc."
                  onChange={(e) => onJobDetailsChange("", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="jobDescription">Job Description</Label>
              <Textarea
                id="jobDescription"
                placeholder="Paste the full job description here...

Include:
• Job responsibilities
• Required qualifications
• Preferred skills
• Company info"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="min-h-[220px] resize-none"
              />
            </div>
          </div>
        )}

        {activeOption === "url" && (
          <div className="space-y-4 animate-fade-in">
            <Label htmlFor="jobUrlInput">Job Posting URL</Label>
            <div className="flex gap-3">
              <Input
                id="jobUrlInput"
                type="url"
                placeholder="https://linkedin.com/jobs/view/..."
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
              Paste a link from LinkedIn, Indeed, or any job board.
            </p>
          </div>
        )}

        {activeOption === "search" && (
          <div className="space-y-4 animate-fade-in">
            <Label htmlFor="searchInput">Search Jobs</Label>
            <div className="flex gap-3">
              <Input
                id="searchInput"
                type="text"
                placeholder="Software Engineer at Google, NYC"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isLoading ? "Searching..." : "Search"}
              </button>
            </div>
            <p className="text-sm text-muted-foreground">
              Search our curated job directory to find real postings.
            </p>
            
            {/* Placeholder for search results */}
            <div className="border border-border rounded-xl p-8 text-center">
              <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Job search results will appear here</p>
            </div>
          </div>
        )}

        {activeOption === "file" && (
          <div className="space-y-4 animate-fade-in">
            <Label>Upload Job Description</Label>
            <div className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-accent/50 transition-colors">
              <input
                type="file"
                accept=".txt,.md,.pdf"
                onChange={handleFileUpload}
                className="hidden"
                id="jobFileUpload"
              />
              <label htmlFor="jobFileUpload" className="cursor-pointer">
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="font-medium">Click to upload or drag and drop</p>
                <p className="text-sm text-muted-foreground mt-1">
                  TXT, MD files supported
                </p>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDescriptionStep;
