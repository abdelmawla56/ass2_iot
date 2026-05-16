"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ShieldAlert, 
  Lock, 
  Eye, 
  UserX, 
  Activity,
  Terminal,
  Skull
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const securityData = [
  { day: 'Mon', attacks: 12 },
  { day: 'Tue', attacks: 19 },
  { day: 'Wed', attacks: 3 },
  { day: 'Thu', attacks: 45 },
  { day: 'Fri', attacks: 8 },
  { day: 'Sat', attacks: 2 },
  { day: 'Sun', attacks: 5 },
];

export default function SecurityPage() {
  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-red-500 flex items-center gap-3">
            <ShieldAlert className="h-8 w-8 animate-pulse" />
            Security Shield
          </h1>
          <p className="text-muted-foreground">Advanced threat detection and platform integrity monitoring.</p>
        </div>
        <Badge variant="destructive" className="px-4 py-2 gap-2 shadow-[0_0_15px_rgba(239,68,68,0.5)]">
          <Activity className="h-4 w-4" />
          High Alert Mode
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="glass border-red-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-500 uppercase tracking-wider flex items-center gap-2">
              <Skull className="h-4 w-4" />
              Rogue Devices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2</div>
            <p className="text-xs text-muted-foreground mt-1">Identified and quarantined</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-500 uppercase tracking-wider flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Auth Attempts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1,240</div>
            <p className="text-xs text-muted-foreground mt-1">99.2% success rate</p>
          </CardContent>
        </Card>
        <Card className="glass border-yellow-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-500 uppercase tracking-wider flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Anomalies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">14</div>
            <p className="text-xs text-muted-foreground mt-1">Suspicious telemetry events</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass">
          <CardHeader>
            <CardTitle>Attack Vector Trends</CardTitle>
            <CardDescription>Daily blocked unauthorized access attempts.</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={securityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="day" stroke="#ffffff50" />
                <YAxis stroke="#ffffff50" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                />
                <Bar dataKey="attacks" fill="oklch(0.6 0.2 20)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass bg-black/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Terminal className="h-5 w-5 text-green-500" />
              Real-time Security Logs
            </CardTitle>
          </CardHeader>
          <CardContent className="font-mono text-[10px] space-y-2 max-h-[250px] overflow-y-auto custom-scrollbar">
            <p className="text-red-500">[CRITICAL] - Rogue device ID 'rogue_01' attempted MQTT handshake on topic 'telemetry'</p>
            <p className="text-yellow-500">[WARN] - Device 'device_04' reported temp 125°C - Hardware failure or tampering suspected</p>
            <p className="text-blue-500">[INFO] - API Token rotation initiated for admin_user_01</p>
            <p className="text-red-500">[CRITICAL] - Brute force detected from IP 192.168.1.104 - 5 failed JWT attempts</p>
            <p className="text-green-500">[SUCCESS] - Zone 1 firmware verified after update</p>
            <p className="text-blue-500">[INFO] - TLS handshake completed for gateway_north_01</p>
            <p className="text-red-500">[CRITICAL] - Suspicious packet payload size on port 1883</p>
          </CardContent>
        </Card>
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle>Platform Hardening</CardTitle>
          <CardDescription>Configure security protocols and automatic responses.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-accent/5">
              <div className="flex items-center gap-3">
                <UserX className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm font-bold">Auto-Ban IP</p>
                  <p className="text-[10px] text-muted-foreground">Ban source after 5 failed login attempts.</p>
                </div>
              </div>
              <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-accent/5">
              <div className="flex items-center gap-3">
                <ShieldAlert className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-bold">Strict MQTT ACLs</p>
                  <p className="text-[10px] text-muted-foreground">Only pre-provisioned devices can publish.</p>
                </div>
              </div>
              <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Enabled</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
