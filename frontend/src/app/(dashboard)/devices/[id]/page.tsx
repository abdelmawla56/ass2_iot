"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Cpu, 
  Signal, 
  Battery, 
  Thermometer, 
  Droplets, 
  History,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

const mockHistory = [
  { time: '12:00', temp: 22, hum: 65 },
  { time: '13:00', temp: 23, hum: 68 },
  { time: '14:00', temp: 21, hum: 70 },
  { time: '15:00', temp: 20, hum: 75 },
  { time: '16:00', temp: 19, hum: 80 },
];

export default function DeviceDetailsPage() {
  const { id } = useParams();

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center gap-4">
        <Link href="/devices">
          <Button variant="ghost" size="icon" className="glass">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Cpu className="h-8 w-8 text-primary" />
            Device Details: <span className="font-mono">{id}</span>
          </h1>
          <p className="text-muted-foreground">Deep inspection of node health and telemetry history.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="glass border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium uppercase text-muted-foreground tracking-widest">Signal Strength</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-2xl font-bold">-84 dBm</div>
            <Signal className="h-6 w-6 text-primary" />
          </CardContent>
        </Card>
        <Card className="glass border-blue-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium uppercase text-muted-foreground tracking-widest">Battery Level</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-2xl font-bold">92%</div>
            <Battery className="h-6 w-6 text-blue-500" />
          </CardContent>
        </Card>
        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium uppercase text-muted-foreground tracking-widest">Current Temp</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-2xl font-bold">21.5°C</div>
            <Thermometer className="h-6 w-6 text-orange-500" />
          </CardContent>
        </Card>
        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium uppercase text-muted-foreground tracking-widest">Humidity</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-2xl font-bold">78%</div>
            <Droplets className="h-6 w-6 text-cyan-500" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              Telemetry History (24h)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
             <ResponsiveContainer width="100%" height="100%">
               <LineChart data={mockHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="time" stroke="#ffffff50" />
                  <YAxis stroke="#ffffff50" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                  />
                  <Line type="monotone" dataKey="temp" stroke="#f97316" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="hum" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 4 }} />
               </LineChart>
             </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="space-y-6">
           <Card className="glass">
              <CardHeader>
                <CardTitle className="text-sm">Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                 <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-muted-foreground">Firmware</span>
                    <Badge variant="outline">v1.0.0</Badge>
                 </div>
                 <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-muted-foreground">Zone</span>
                    <span>Zone 1 - Wheat North</span>
                 </div>
                 <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-muted-foreground">MAC Address</span>
                    <span className="font-mono">AB:CD:EF:12:34:56</span>
                 </div>
                 <div className="flex justify-between">
                    <span className="text-muted-foreground">Uptime</span>
                    <span>14d 05h 22m</span>
                 </div>
              </CardContent>
           </Card>

           <Card className="glass border-yellow-500/20">
              <CardHeader>
                <CardTitle className="text-sm">Device Maintenance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                 <Button className="w-full neon-border text-xs">Trigger Self-Test</Button>
                 <Button variant="outline" className="w-full text-xs">Reset Flash Memory</Button>
                 <Button variant="destructive" className="w-full text-xs">Factory Reset</Button>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
