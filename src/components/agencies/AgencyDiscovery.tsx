
"use client";

import { useState } from "react";
import { Search, MapPin, Phone, Clock, ChevronRight, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Agency {
  id: string;
  name: string;
  type: string;
  distance: string;
  status: "active" | "limited" | "busy";
  phone: string;
  hours: string;
  image: string;
}

const AGENCIES: Agency[] = [
  {
    id: "1",
    name: "Central Fire Station",
    type: "Fire & Rescue",
    distance: "1.2 km",
    status: "active",
    phone: "+1 555-0101",
    hours: "24/7 Operations",
    image: PlaceHolderImages.find(img => img.id === 'fire-station')?.imageUrl || ""
  },
  {
    id: "2",
    name: "City Medical Center",
    type: "Emergency Hospital",
    distance: "2.5 km",
    status: "busy",
    phone: "+1 555-0202",
    hours: "24/7 Operations",
    image: PlaceHolderImages.find(img => img.id === 'hospital')?.imageUrl || ""
  },
  {
    id: "3",
    name: "Main Police Precinct",
    type: "Law Enforcement",
    distance: "3.1 km",
    status: "active",
    phone: "+1 555-0303",
    hours: "24/7 Operations",
    image: PlaceHolderImages.find(img => img.id === 'police')?.imageUrl || ""
  },
  {
    id: "4",
    name: "Red Cross HQ",
    type: "Disaster Relief",
    distance: "4.8 km",
    status: "limited",
    phone: "+1 555-0404",
    hours: "08:00 - 20:00",
    image: PlaceHolderImages.find(img => img.id === 'fire-station')?.imageUrl || ""
  }
];

export function AgencyDiscovery() {
  const [search, setSearch] = useState("");
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);

  const filtered = AGENCIES.filter(a => a.name.toLowerCase().includes(search.toLowerCase()) || a.type.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <header>
        <h2 className="font-headline text-3xl mb-1 tracking-wider uppercase">Emergency Directory</h2>
        <p className="text-muted-foreground text-sm">Find verified services near you.</p>
      </header>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <Input 
          placeholder="Search services..." 
          className="pl-10 h-12 bg-white/5 border-white/10 rounded-xl"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filtered.map((agency) => (
          <button
            key={agency.id}
            onClick={() => setSelectedAgency(agency)}
            className="glass-card w-full p-4 flex gap-4 text-left transition-all active:scale-[0.98] hover:bg-white/10"
          >
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-white/5 shrink-0 border border-white/10">
              <img src={agency.image} alt={agency.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-widest text-primary">{agency.type}</span>
                <span className="text-[10px] text-muted-foreground font-medium">{agency.distance}</span>
              </div>
              <h4 className="font-headline text-lg truncate leading-none mb-1 uppercase tracking-wider">{agency.name}</h4>
              <div className="flex items-center gap-2">
                <StatusBadge status={agency.status} />
              </div>
            </div>
            <div className="flex items-center text-muted-foreground">
              <ChevronRight size={20} />
            </div>
          </button>
        ))}
      </div>

      <Dialog open={!!selectedAgency} onOpenChange={() => setSelectedAgency(null)}>
        <DialogContent className="max-w-[340px] rounded-3xl bg-card border-white/10 p-0 overflow-hidden">
          {selectedAgency && (
            <>
              <div className="h-48 relative">
                <img src={selectedAgency.image} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-primary bg-black/50 px-2 py-1 rounded backdrop-blur-sm mb-2 inline-block">
                    {selectedAgency.type}
                  </span>
                  <h3 className="font-headline text-2xl text-white uppercase">{selectedAgency.name}</h3>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-card p-3 flex flex-col items-center gap-1">
                    <MapPin size={16} className="text-muted-foreground" />
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Distance</span>
                    <span className="text-sm font-headline tracking-wider">{selectedAgency.distance}</span>
                  </div>
                  <div className="glass-card p-3 flex flex-col items-center gap-1">
                    <Info size={16} className="text-muted-foreground" />
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Status</span>
                    <StatusBadge status={selectedAgency.status} />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                      <Phone size={18} className="text-accent" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Contact Number</p>
                      <p className="font-medium">{selectedAgency.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                      <Clock size={18} className="text-blue-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Working Hours</p>
                      <p className="font-medium">{selectedAgency.hours}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button className="flex-1 bg-primary text-white font-headline text-lg py-3 rounded-xl hover:bg-primary/90 transition-colors uppercase tracking-widest">
                    Call Emergency
                  </button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatusBadge({ status }: { status: "active" | "limited" | "busy" }) {
  const styles = {
    active: "bg-green-500/10 text-green-500",
    busy: "bg-red-500/10 text-red-500",
    limited: "bg-accent/10 text-accent",
  };
  return (
    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${styles[status]}`}>
      {status}
    </span>
  );
}
