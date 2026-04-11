
"use client";

import { AlertCircle, MapPin, FileText, User } from "lucide-react";
import { cn } from "@/lib/utils";

type NavTab = "sos" | "agencies" | "report" | "profile";

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs: { id: NavTab; label: string; icon: any }[] = [
    { id: "sos", label: "SOS", icon: AlertCircle },
    { id: "agencies", label: "Agencies", icon: MapPin },
    { id: "report", label: "Report", icon: FileText },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[375px] bg-black/80 backdrop-blur-xl border-t border-white/10 h-20 px-4 flex items-center justify-around z-40">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "flex flex-col items-center justify-center gap-1 transition-all",
            activeTab === tab.id ? "text-primary scale-110" : "text-muted-foreground hover:text-white"
          )}
        >
          <tab.icon size={24} />
          <span className="text-[10px] font-medium uppercase tracking-wider">{tab.label}</span>
          {activeTab === tab.id && (
            <div className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full" />
          )}
        </button>
      ))}
    </nav>
  );
}
