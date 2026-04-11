
"use client";

import { useState, useEffect } from "react";
import { SOSSection } from "@/components/sos/SOSSection";
import { AgencyDiscovery } from "@/components/agencies/AgencyDiscovery";
import { IncidentReporting } from "@/components/reporting/IncidentReporting";
import { ProfileHistory } from "@/components/profile/ProfileHistory";
import { BottomNav } from "@/components/ui/BottomNav";

type Tab = "sos" | "agencies" | "report" | "profile";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("sos");
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center animate-out fade-out duration-1000">
        <div className="relative">
          <div className="w-32 h-32 bg-primary rounded-full pulse-red flex items-center justify-center shadow-[0_0_50px_rgba(255,45,45,0.4)]">
            <div className="w-16 h-1 w-16 bg-white rotate-45 absolute" />
            <div className="w-16 h-1 w-16 bg-white -rotate-45 absolute" />
            <div className="font-headline text-6xl text-white italic">R</div>
          </div>
        </div>
        <div className="mt-12 text-center space-y-2">
          <h1 className="font-headline text-6xl tracking-widest text-primary animate-pulse">RESQ-LINK</h1>
          <p className="text-muted-foreground uppercase text-xs tracking-[0.5em] font-medium">Command & Control</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="pb-24">
        {activeTab === "sos" && <SOSSection />}
        {activeTab === "agencies" && <AgencyDiscovery />}
        {activeTab === "report" && <IncidentReporting />}
        {activeTab === "profile" && <ProfileHistory />}
      </div>
      <BottomNav activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab as Tab)} />
    </div>
  );
}
