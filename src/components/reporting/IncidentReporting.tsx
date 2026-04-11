
"use client";

import { useState } from "react";
import { Camera, Send, ChevronRight, FileText, CheckCircle2, Sparkles, X, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { reportClassificationSuggestion, type ReportClassificationSuggestionOutput } from "@/ai/flows/report-classification-suggestion-flow";

export function IncidentReporting() {
  const [step, setStep] = useState(1);
  const [description, setDescription] = useState("");
  const [isClassifying, setIsClassifying] = useState(false);
  const [suggestions, setSuggestions] = useState<ReportClassificationSuggestionOutput | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);

  const handleClassify = async () => {
    if (description.length < 10) return;
    setIsClassifying(true);
    try {
      const result = await reportClassificationSuggestion({ description });
      setSuggestions(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsClassifying(false);
    }
  };

  const addMockPhoto = () => {
    if (photos.length >= 3) return;
    setPhotos([...photos, `https://picsum.photos/seed/${Math.random()}/300/300`]);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="p-6 h-full flex flex-col items-center justify-center text-center space-y-6 animate-fade-in">
        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center">
          <CheckCircle2 size={48} className="text-green-500" />
        </div>
        <div>
          <h2 className="font-headline text-4xl mb-2 uppercase tracking-widest">REPORT SUBMITTED</h2>
          <p className="text-muted-foreground text-sm">Case ID: #RL-99283-X<br/>Authorities have been notified.</p>
        </div>
        <Button 
          onClick={() => {
            setIsSubmitted(false);
            setStep(1);
            setDescription("");
            setSuggestions(null);
            setPhotos([]);
          }}
          className="bg-white/10 text-white font-headline text-xl px-8 py-6 rounded-2xl hover:bg-white/20 transition-all border-white/10 uppercase tracking-widest"
        >
          New Report
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="font-headline text-3xl mb-1 tracking-wider uppercase">Submit Incident</h2>
          <p className="text-muted-foreground text-sm">Detailed report for emergency aid.</p>
        </div>
        <div className="glass-card px-3 py-2 flex items-center gap-2">
          <div className="text-[10px] font-bold text-muted-foreground uppercase">Step</div>
          <div className="font-headline text-primary">{step}/2</div>
        </div>
      </header>

      {step === 1 && (
        <div className="space-y-6 animate-fade-in">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Issue Description</label>
            <div className="relative">
              <Textarea 
                placeholder="Describe what happened in detail..."
                className="min-h-[160px] bg-white/5 border-white/10 rounded-2xl resize-none p-4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={500}
              />
              <div className="absolute bottom-3 right-3 text-[10px] font-bold text-muted-foreground">
                {description.length}/500
              </div>
            </div>
            <button 
              onClick={handleClassify}
              disabled={description.length < 10 || isClassifying}
              className="flex items-center gap-2 text-accent text-[10px] font-bold uppercase tracking-widest transition-all hover:opacity-80 disabled:opacity-30 pt-1"
            >
              {isClassifying ? (
                <div className="w-3 h-3 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              ) : (
                <Sparkles size={14} />
              )}
              Run AI Classification
            </button>
          </div>

          {suggestions && (
            <div className="glass-card p-4 space-y-4 animate-accordion-down overflow-hidden">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-accent" />
                <span className="text-[10px] font-bold uppercase tracking-widest">AI SUGGESTIONS</span>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] text-muted-foreground font-bold uppercase">Primary Classification</p>
                <div className="bg-primary/20 border border-primary/30 text-primary px-3 py-1.5 rounded-lg font-headline text-lg inline-block tracking-wider uppercase">
                  {suggestions.classification}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] text-muted-foreground font-bold uppercase">Keywords</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.keywords.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-white/5 text-[10px] uppercase font-bold text-white border-white/10">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          <Button 
            className="w-full bg-primary py-7 rounded-2xl font-headline text-2xl tracking-widest uppercase hover:bg-primary/90 transition-all shadow-lg"
            disabled={description.length < 10}
            onClick={() => setStep(2)}
          >
            Next Step <ChevronRight size={24} className="ml-2" />
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-8 animate-fade-in">
          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Attach Photos (Optional)</label>
            <div className="grid grid-cols-3 gap-4">
              {photos.map((photo, i) => (
                <div key={i} className="aspect-square rounded-xl bg-white/5 border border-white/10 relative overflow-hidden group">
                  <img src={photo} alt="" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => setPhotos(photos.filter((_, idx) => idx !== i))}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-white backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {photos.length < 3 && (
                <button 
                  onClick={addMockPhoto}
                  className="aspect-square rounded-xl bg-white/5 border border-dashed border-white/20 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:bg-white/10 transition-all"
                >
                  <Camera size={24} />
                  <span className="text-[8px] font-bold uppercase">Add Photo</span>
                </button>
              )}
            </div>
          </div>

          <div className="glass-card p-6 space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                <FileText size={18} className="text-primary" />
              </div>
              <div>
                <h4 className="font-headline text-lg tracking-wider uppercase mb-1">Final Review</h4>
                <p className="text-xs text-muted-foreground">Your report will be sent to the nearest emergency response hub with high priority status.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Button 
              className="w-full bg-primary py-7 rounded-2xl font-headline text-2xl tracking-widest uppercase hover:bg-primary/90 transition-all shadow-lg"
              onClick={handleSubmit}
            >
              SEND REPORT <Send size={24} className="ml-2" />
            </Button>
            <Button 
              variant="ghost" 
              className="text-muted-foreground hover:text-white"
              onClick={() => setStep(1)}
            >
              Back to Description
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
