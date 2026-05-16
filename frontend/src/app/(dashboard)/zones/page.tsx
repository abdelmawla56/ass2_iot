"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Map, Thermometer, Droplets, CloudRain, AlertTriangle, ChevronRight } from 'lucide-react';

const zones = [
  {
    id: 'z1',
    name: 'Zone 1 - Wheat North',
    desc: 'High-density wheat plantation',
    devices: 5,
    health: 94,
    temp: 22.4,
    hum: 65,
    rain: 0,
    risk: 'LOW',
    color: 'border-green-500/20'
  },
  {
    id: 'z2',
    name: 'Zone 2 - Vineyard South',
    desc: 'Cabernet Sauvignon sector',
    devices: 5,
    health: 62,
    temp: 19.8,
    hum: 88,
    rain: 12.5,
    risk: 'HIGH',
    color: 'border-orange-500/20'
  }
];

export default function ZonesPage() {
  return (
    <div className="space-y-8 animate-in slide-in-from-left-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Zone Monitoring</h1>
          <p className="text-muted-foreground">Geospatial health overview of agricultural sectors.</p>
        </div>
        <Button className="gap-2 neon-border">
          <Map className="h-4 w-4" />
          Define New Zone
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {zones.map((zone) => (
          <Card key={zone.id} className={cn("glass transition-all hover:neon-border", zone.color)}>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle>{zone.name}</CardTitle>
                <CardDescription>{zone.desc}</CardDescription>
              </div>
              <Badge variant={zone.risk === 'HIGH' ? 'destructive' : 'default'} className={cn(
                zone.risk === 'LOW' ? 'bg-green-500/20 text-green-500' : ''
              )}>
                {zone.risk} RISK
              </Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center p-3 rounded-xl bg-white/5 border border-white/5">
                   <Thermometer className="h-4 w-4 mx-auto mb-1 text-orange-500" />
                   <p className="text-sm font-bold">{zone.temp}°C</p>
                   <p className="text-[10px] text-muted-foreground">Temp</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-white/5 border border-white/5">
                   <Droplets className="h-4 w-4 mx-auto mb-1 text-blue-500" />
                   <p className="text-sm font-bold">{zone.hum}%</p>
                   <p className="text-[10px] text-muted-foreground">Humidity</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-white/5 border border-white/5">
                   <CloudRain className="h-4 w-4 mx-auto mb-1 text-cyan-500" />
                   <p className="text-sm font-bold">{zone.rain}mm</p>
                   <p className="text-[10px] text-muted-foreground">Rain</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-white/5 border border-white/5">
                   <AlertTriangle className="h-4 w-4 mx-auto mb-1 text-yellow-500" />
                   <p className="text-sm font-bold">{zone.devices}</p>
                   <p className="text-[10px] text-muted-foreground">Nodes</p>
                </div>
              </div>

              <div className="space-y-2">
                 <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground uppercase tracking-widest font-bold">Health Score</span>
                    <span className={cn("font-bold", zone.health > 80 ? 'text-green-500' : 'text-orange-500')}>{zone.health}%</span>
                 </div>
                 <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full transition-all duration-1000", zone.health > 80 ? 'bg-green-500' : 'bg-orange-500')} 
                      style={{ width: `${zone.health}%` }} 
                    />
                 </div>
              </div>

              <div className="pt-4 flex justify-between items-center">
                 <div className="flex -space-x-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="h-6 w-6 rounded-full border border-background bg-primary/20 flex items-center justify-center">
                        <span className="text-[8px] font-bold">D0{i+1}</span>
                      </div>
                    ))}
                    <div className="h-6 w-6 rounded-full border border-background bg-accent flex items-center justify-center">
                        <span className="text-[8px] font-bold">+{zone.devices - 3}</span>
                    </div>
                 </div>
                 <Button variant="ghost" size="sm" className="gap-1 text-xs hover:text-primary">
                    View Detailed Maps <ChevronRight className="h-3 w-3" />
                 </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

