
"use client";

import { User, History, Shield, LogOut, ChevronRight, AlertTriangle, FileText, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function ProfileHistory() {
  const history = [
    { id: "1", type: "SOS", date: "Oct 24, 2024", time: "22:15", status: "Resolved", details: "Medical Emergency" },
    { id: "2", type: "REPORT", date: "Sep 12, 2024", time: "09:30", status: "Closed", details: "Road Hazard Reported" },
    { id: "3", type: "SOS", date: "Aug 05, 2024", time: "18:45", status: "Resolved", details: "Fire Hazard" },
  ];

  return (
    <div className="p-6 space-y-8 animate-fade-in">
      <header className="flex flex-col items-center text-center space-y-4">
        <div className="relative">
          <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-primary via-accent to-red-500">
            <Avatar className="w-full h-full border-4 border-background">
              <AvatarImage src="https://picsum.photos/seed/user1/200/200" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
          <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-accent border-4 border-background flex items-center justify-center">
            <Shield size={14} className="text-black" />
          </div>
        </div>
        <div>
          <h2 className="font-headline text-3xl tracking-wider uppercase">JOHN D. RESCUER</h2>
          <p className="text-muted-foreground text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2">
            Verified Account <div className="w-1 h-1 bg-green-500 rounded-full" /> Level 4
          </p>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <StatCard label="ALERTS" value="12" icon={<AlertTriangle className="text-primary" size={16} />} />
        <StatCard label="REPORTS" value="08" icon={<FileText className="text-accent" size={16} />} />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-headline text-xl uppercase tracking-widest text-muted-foreground">Activity Log</h3>
          <button className="text-[10px] font-bold text-accent uppercase tracking-widest flex items-center gap-1">
            <History size={12} /> View All
          </button>
        </div>
        
        <div className="space-y-3">
          {history.map((item) => (
            <div key={item.id} className="glass-card p-4 flex items-center justify-between hover:bg-white/10 transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.type === 'SOS' ? 'bg-primary/20 text-primary' : 'bg-accent/20 text-accent'}`}>
                  {item.type === 'SOS' ? <AlertTriangle size={20} /> : <FileText size={20} />}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-widest">{item.type}</span>
                    <span className="text-muted-foreground text-[10px]">•</span>
                    <span className="text-[10px] text-muted-foreground uppercase font-medium">{item.date}</span>
                  </div>
                  <h4 className="font-headline text-lg tracking-wider uppercase leading-none">{item.details}</h4>
                </div>
              </div>
              <div className="text-right flex flex-col items-end gap-1">
                <Badge variant="outline" className="text-[8px] border-white/10 text-muted-foreground font-bold h-5 uppercase">
                  {item.status}
                </Badge>
                <ChevronRight size={14} className="text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3 pt-4">
        <SettingsButton icon={<Settings size={20} />} label="System Preferences" />
        <SettingsButton icon={<Shield size={20} />} label="Security & Privacy" />
        <button className="w-full flex items-center justify-between p-4 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all group">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center group-hover:scale-110 transition-all">
              <LogOut size={20} />
            </div>
            <span className="font-headline text-xl tracking-wider uppercase">Logout Session</span>
          </div>
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string, value: string, icon: any }) {
  return (
    <div className="glass-card p-4 flex flex-col items-center justify-center text-center">
      <div className="mb-2 bg-white/5 w-10 h-10 rounded-full flex items-center justify-center">{icon}</div>
      <div className="font-headline text-3xl leading-none text-white tracking-wider mb-1">{value}</div>
      <div className="text-[9px] font-bold uppercase text-muted-foreground tracking-[0.2em]">{label}</div>
    </div>
  );
}

function SettingsButton({ icon, label }: { icon: any, label: string }) {
  return (
    <button className="w-full glass-card p-4 flex items-center justify-between hover:bg-white/10 transition-all group">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-all">
          {icon}
        </div>
        <span className="font-headline text-xl tracking-wider uppercase">{label}</span>
      </div>
      <ChevronRight size={20} className="text-muted-foreground" />
    </button>
  );
}
