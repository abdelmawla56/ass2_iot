"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  CartesianGrid
} from 'recharts';
import { 
  TrendingUp, 
  PieChart as PieChartIcon, 
  Map as MapIcon,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const correlationData = [
  { hum: 60, wet: 2, risk: 'LOW' },
  { hum: 75, wet: 4, risk: 'MODERATE' },
  { hum: 82, wet: 6, risk: 'HIGH' },
  { hum: 90, wet: 9, risk: 'CRITICAL' },
  { hum: 65, wet: 3, risk: 'LOW' },
  { hum: 70, wet: 5, risk: 'MODERATE' },
  { hum: 88, wet: 8, risk: 'CRITICAL' },
  { hum: 92, wet: 10, risk: 'CRITICAL' },
];

const pieData = [
  { name: 'Zone 1', value: 400, color: '#22c55e' },
  { name: 'Zone 2', value: 300, color: '#f59e0b' },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Advanced Analytics</h1>
          <p className="text-muted-foreground">Historical data analysis and predictive modeling for crop health.</p>
        </div>
        <Button variant="outline" className="gap-2 glass">
          <Download className="h-4 w-4" />
          Export Dataset (CSV)
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Humidity vs. Leaf Wetness Correlation
            </CardTitle>
            <CardDescription>Visualizing key disease drivers.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis type="number" dataKey="hum" name="Humidity" unit="%" stroke="#ffffff50" />
                <YAxis type="number" dataKey="wet" name="Wetness" unit="/10" stroke="#ffffff50" />
                <ZAxis type="category" dataKey="risk" name="Risk" />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                />
                <Scatter name="Telemetry Points" data={correlationData}>
                  {correlationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={
                      entry.risk === 'CRITICAL' ? '#ef4444' : 
                      entry.risk === 'HIGH' ? '#f97316' : 
                      entry.risk === 'MODERATE' ? '#f59e0b' : '#22c55e'
                    } />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-blue-500" />
              Alert Distribution by Zone
            </CardTitle>
            <CardDescription>Identifying high-risk geographic areas.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 pr-8">
              {pieData.map(item => (
                <div key={item.name} className="flex items-center gap-2">
                   <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                   <span className="text-xs">{item.name} ({Math.round(item.value/7)}%)</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapIcon className="h-5 w-5 text-cyan-500" />
            Rainfall Heatmap Simulation
          </CardTitle>
          <CardDescription>Accumulated precipitation across agricultural zones.</CardDescription>
        </CardHeader>
        <CardContent>
           <div className="grid grid-cols-5 gap-2 h-48" suppressHydrationWarning>
              {Array.from({ length: 25 }).map((_, i) => (
                <div 
                  key={i} 
                  className="rounded-md border border-white/5 transition-all hover:scale-105"
                  style={{ 
                    backgroundColor: `oklch(0.6 0.2 200 / ${Math.random() * 0.8})`
                  }} 
                />
              ))}
           </div>
           <div className="flex justify-between mt-4 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
              <span>Low (0mm)</span>
              <span>High (50mm+)</span>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
