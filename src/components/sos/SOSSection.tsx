"use client";

import { useState, useRef, useEffect } from "react";
import { Flame, Ambulance, Waves, Zap, ShieldCheck, MapIcon, Clock, AlertCircle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getAIDrivenDispatchStatus, type SOSDispatchStatusOutput } from "@/ai/flows/ai-driven-dispatch-status-flow";

export function SOSSection() {
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isActivated, setIsActivated] = useState(false);
  const [dispatchInfo, setDispatchInfo] = useState<SOSDispatchStatusOutput | null>(null);
  const [isLoadingDispatch, setIsLoadingDispatch] = useState(false);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startHold = () => {
    if (isActivated) return;
    setIsHolding(true);
    let currentProgress = 0;
    holdTimerRef.current = setInterval(() => {
      currentProgress += 2;
      setProgress(currentProgress);
      if (currentProgress >= 100) {
        handleActivation();
      }
    }, 30);
  };

  const endHold = () => {
    setIsHolding(false);
    if (holdTimerRef.current) clearInterval(holdTimerRef.current);
    if (progress < 100) {
      setProgress(0);
    }
  };

  const handleActivation = async (type?: string) => {
    if (holdTimerRef.current) clearInterval(holdTimerRef.current);
    setIsActivated(true);
    setIsLoadingDispatch(true);
    try {
      const result = await getAIDrivenDispatchStatus({ emergencyType: type });
      setDispatchInfo(result);
    } catch (error) {
      console.error("Dispatch error:", error);
    } finally {
      setIsLoadingDispatch(false);
    }
  };

  if (isActivated) {
    return (
      <div className="flex flex-col gap-6 animate-fade-in p-6">
        <div className="glass-card p-6 border-primary/50 text-center">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 pulse-red">
            <ShieldCheck className="text-primary" size={32} />
          </div>
          <h2 className="font-headline text-3xl mb-2">SOS ACTIVATED</h2>
          <p className="text-muted-foreground text-sm">Your location and identity have been shared with emergency services.</p>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="bg-white/5 p-4 border-b border-white/10 flex items-center justify-between">
            <span className="font-headline tracking-widest text-lg">AI DISPATCH STATUS</span>
            <div className="flex items-center gap-2 text-accent">
              <Zap size={16} fill="currentColor" />
              <span className="text-[10px] font-bold">LIVE AI</span>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            {isLoadingDispatch ? (
              <div className="flex flex-col items-center py-8 gap-4">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Optimizing rescue units...</p>
              </div>
            ) : dispatchInfo ? (
              <>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                    <MapIcon className="text-primary" size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Assigned Unit</p>
                    <p className="text-lg font-headline leading-none">{dispatchInfo.nearestUnitAssigned}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                    <Clock className="text-accent" size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Estimated Arrival</p>
                    <p className="text-lg font-headline leading-none">{dispatchInfo.etaMinutes} MINUTES</p>
                  </div>
                </div>

                <div className="w-full aspect-video bg-white/5 rounded-xl flex flex-col items-center justify-center border border-dashed border-white/20">
                  <MapPin className="text-muted-foreground mb-2" size={32} />
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">MAPS API INTEGRATION PENDING</p>
                </div>
              </>
            ) : null}
          </div>
        </div>

        <Button 
          variant="outline" 
          className="w-full border-white/10 hover:bg-white/5"
          onClick={() => {
            setIsActivated(false);
            setProgress(0);
            setDispatchInfo(null);
          }}
        >
          CANCEL ALERT
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col items-center">
      <header className="w-full mb-12 text-center">
        <h1 className="font-headline text-5xl mb-2 text-primary">RESQ-LINK</h1>
        <p className="text-muted-foreground text-sm uppercase tracking-widest font-medium">Emergency Control Center</p>
      </header>

      <div className="relative mb-12 flex flex-col items-center">
        <button
          onMouseDown={startHold}
          onMouseUp={endHold}
          onMouseLeave={endHold}
          onTouchStart={startHold}
          onTouchEnd={endHold}
          className={`w-64 h-64 rounded-full flex flex-col items-center justify-center gap-2 transition-all active:scale-95 z-10 
            ${isHolding ? 'bg-primary/90 scale-105' : 'bg-primary pulse-red'}`}
        >
          <AlertCircle size={64} className="text-white" />
          <span className="font-headline text-4xl tracking-widest text-white">SOS</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">Hold for 3s</span>
        </button>

        {isHolding && (
          <div className="absolute -bottom-6 w-full px-8">
            <Progress value={progress} className="h-1 bg-white/10" />
          </div>
        )}
      </div>

      <div className="w-full space-y-4">
        <h3 className="font-headline text-xl uppercase tracking-widest text-center text-muted-foreground mb-6">Quick Actions</h3>
        <div className="grid grid-cols-3 gap-4">
          <QuickActionButton 
            icon={<Flame size={24} />} 
            label="FIRE" 
            color="text-primary" 
            onClick={() => handleActivation("Fire")}
          />
          <QuickActionButton 
            icon={<Ambulance size={24} />} 
            label="MED" 
            color="text-accent" 
            onClick={() => handleActivation("Medical")}
          />
          <QuickActionButton 
            icon={<Waves size={24} />} 
            label="DISASTER" 
            color="text-blue-400" 
            onClick={() => handleActivation("Flood")}
          />
        </div>
      </div>
    </div>
  );
}

function QuickActionButton({ icon, label, color, onClick }: { icon: any, label: string, color: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="glass-card p-4 flex flex-col items-center justify-center gap-2 transition-all active:bg-white/10 hover:border-white/20"
    >
      <div className={color}>{icon}</div>
      <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
    </button>
  );
}