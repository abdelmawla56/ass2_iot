"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { 
  Cpu, 
  Zap, 
  AlertTriangle, 
  Droplets, 
  Thermometer,
  CloudRain
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const telemetryData = [
  { time: '10:00', temp: 22, hum: 65, rain: 0 },
  { time: '11:00', temp: 24, hum: 62, rain: 0 },
  { time: '12:00', temp: 26, hum: 58, rain: 0 },
  { time: '13:00', temp: 27, hum: 55, rain: 2 },
  { time: '14:00', temp: 25, hum: 70, rain: 5 },
  { time: '15:00', temp: 23, hum: 85, rain: 10 },
  { time: '16:00', temp: 21, hum: 90, rain: 12 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agricultural Intelligence</h1>
          <p className="text-muted-foreground">Real-time crop disease monitoring and early warning system.</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-3 py-1">
            <span className="mr-2 h-2 w-2 rounded-full bg-primary animate-pulse" />
            System Live
          </Badge>
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 px-3 py-1">
            2 Moderate Alerts
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Active Devices" value="10" icon={Cpu} trend="+0%" color="text-blue-500" />
        <StatCard title="Total Power" value="98%" icon={Zap} trend="-2%" color="text-yellow-500" />
        <StatCard title="Disease Risk" value="MODERATE" icon={AlertTriangle} trend="Zone 2" color="text-orange-500" />
        <StatCard title="Rainfall (24h)" value="24.5mm" icon={CloudRain} trend="+12%" color="text-cyan-500" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 glass">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Thermometer className="h-4 w-4 text-orange-500" />
              Temperature & Humidity Trends
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={telemetryData}>
                <defs>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.7 0.2 30)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="oklch(0.7 0.2 30)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorHum" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.7 0.2 150)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="oklch(0.7 0.2 150)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="time" stroke="#ffffff50" fontSize={12} />
                <YAxis stroke="#ffffff50" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="temp" stroke="oklch(0.7 0.2 30)" fillOpacity={1} fill="url(#colorTemp)" />
                <Area type="monotone" dataKey="hum" stroke="oklch(0.7 0.2 150)" fillOpacity={1} fill="url(#colorHum)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 glass">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CloudRain className="h-4 w-4 text-cyan-500" />
              Precipitation Levels (mm)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={telemetryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="time" stroke="#ffffff50" fontSize={12} />
                <YAxis stroke="#ffffff50" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                />
                <Line type="stepAfter" dataKey="rain" stroke="oklch(0.7 0.2 200)" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <RecentAlerts />
        <DeviceStatusList />
        <ZoneRiskHeatmap />
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend, color }: any) {
  return (
    <Card className="glass overflow-hidden relative group transition-all hover:neon-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</CardTitle>
        <div className={cn("p-2 rounded-lg bg-background/50", color)}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">
          <span className="text-primary font-medium">{trend}</span> from last period
        </p>
      </CardContent>
      <div className={cn("absolute bottom-0 left-0 h-1 w-full opacity-50", color.replace('text', 'bg'))} />
    </Card>
  );
}

function RecentAlerts() {
  const alerts = [
    { id: 1, type: 'CRITICAL', msg: 'High Humidity in Zone 2', time: '12m ago' },
    { id: 2, type: 'MODERATE', msg: 'Leaf Wetness Spike - Device 04', time: '45m ago' },
    { id: 3, type: 'LOW', msg: 'Temp Drop detected in Zone 1', time: '1h ago' },
  ];

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Recent Alerts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.map(alert => (
          <div key={alert.id} className="flex items-center gap-3 p-3 rounded-lg bg-accent/20 border border-white/5">
            <div className={cn(
              "h-2 w-2 rounded-full",
              alert.type === 'CRITICAL' ? 'bg-red-500 shadow-[0_0_10px_red]' : 
              alert.type === 'MODERATE' ? 'bg-yellow-500 shadow-[0_0_10px_yellow]' : 'bg-blue-500'
            )} />
            <div className="flex-1">
              <p className="text-xs font-medium">{alert.msg}</p>
              <p className="text-[10px] text-muted-foreground">{alert.time}</p>
            </div>
            <Badge variant="outline" className="text-[10px] px-1 py-0">{alert.type}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function DeviceStatusList() {
  const devices = [
    { name: 'Device 01', status: 'Online', zone: 'Zone 1' },
    { name: 'Device 02', status: 'Online', zone: 'Zone 1' },
    { name: 'Device 09', status: 'Updating', zone: 'Zone 2' },
  ];

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Device Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {devices.map(dev => (
          <div key={dev.name} className="flex items-center justify-between p-3 rounded-lg bg-accent/10 border border-white/5">
            <div className="flex items-center gap-3">
              <Cpu className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium">{dev.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground">{dev.zone}</span>
              <Badge variant={dev.status === 'Updating' ? 'outline' : 'default'} className="text-[10px] px-1 py-0 bg-primary/20 text-primary border-primary/30">
                {dev.status}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function ZoneRiskHeatmap() {
  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Zone Health Score</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 flex flex-col justify-center h-full pb-10">
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Zone 1 - Wheat North</span>
            <span className="text-primary font-bold">94%</span>
          </div>
          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-primary" style={{ width: '94%' }} />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Zone 2 - Vineyard South</span>
            <span className="text-orange-500 font-bold">62%</span>
          </div>
          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500" style={{ width: '62%' }} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
