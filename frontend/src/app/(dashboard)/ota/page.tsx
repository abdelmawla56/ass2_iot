"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  UploadCloud, 
  Package, 
  AlertCircle, 
  CheckCircle2, 
  RotateCcw,
  Zap
} from 'lucide-react';

export default function OTAPage() {
  const [updates, setUpdates] = useState([
    { id: 1, device: 'device_09', version: 'v1.1.0', status: 'UPDATING', progress: 65 },
    { id: 2, device: 'device_10', version: 'v1.1.0', status: 'FAILED', progress: 40 },
    { id: 3, device: 'device_01', version: 'v1.0.0', status: 'UPDATED', progress: 100 },
  ]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">OTA Firmware</h1>
          <p className="text-muted-foreground">Manage and deploy over-the-air firmware updates to network nodes.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="destructive" className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Global Rollback
          </Button>
          <Button className="gap-2 neon-border">
            <UploadCloud className="h-4 w-4" />
            New Firmware Version
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Zap className="h-24 w-24 text-primary" />
          </div>
          <CardHeader>
            <CardTitle>Active Deployments</CardTitle>
            <CardDescription>Firmware v1.1.0 (Critical Patch)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {updates.filter(u => u.status !== 'UPDATED').map(update => (
              <div key={update.id} className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-primary">{update.device}</span>
                    <Badge variant={update.status === 'FAILED' ? 'destructive' : 'outline'}>
                      {update.status}
                    </Badge>
                  </div>
                  <span className="text-muted-foreground">{update.progress}%</span>
                </div>
                <Progress value={update.progress} className="h-1.5" indicatorClassName={update.status === 'FAILED' ? 'bg-destructive' : 'bg-primary'} />
                {update.status === 'FAILED' && (
                  <p className="text-[10px] text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> Integrity verification failed. Retrying...
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle>Firmware Repository</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-white/5">
              {[
                { version: 'v1.1.0', date: '2026-05-15', nodes: 2, status: 'Active' },
                { version: 'v1.0.5', date: '2026-05-10', nodes: 0, status: 'Deprecated' },
                { version: 'v1.0.0', date: '2026-05-01', nodes: 8, status: 'Legacy' },
              ].map((fw) => (
                <div key={fw.version} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-bold">{fw.version}</p>
                      <p className="text-[10px] text-muted-foreground">Released on {fw.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="mb-1">{fw.status}</Badge>
                    <p className="text-[10px] text-muted-foreground">{fw.nodes} nodes running</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Deployment Configuration
          </CardTitle>
          <CardDescription>Target specific zones or device types for updates.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="p-4 rounded-xl border border-white/5 bg-accent/10 space-y-4">
              <h3 className="text-sm font-medium">Zone 2 (Targeted)</h3>
              <p className="text-xs text-muted-foreground">The current rollout is restricted to Zone 2 devices only for canary testing.</p>
              <Button size="sm" className="w-full neon-border">Pause Rollout</Button>
            </div>
            <div className="p-4 rounded-xl border border-white/5 bg-accent/10 space-y-4">
              <h3 className="text-sm font-medium">Auto-Rollback</h3>
              <p className="text-xs text-muted-foreground">Enabled: If 2+ nodes fail, previous version will be restored automatically.</p>
              <Button size="sm" variant="outline" className="w-full">Configure</Button>
            </div>
            <div className="p-4 rounded-xl border border-white/5 bg-accent/10 space-y-4">
              <h3 className="text-sm font-medium">Bandwidth Throttling</h3>
              <p className="text-xs text-muted-foreground">Optimized for LoRaWAN duty cycle limits. Current rate: 50kbps.</p>
              <Button size="sm" variant="outline" className="w-full">Manage Speed</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
