"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  MoreHorizontal, 
  RefreshCw, 
  Signal, 
  Battery,
  History
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';

export default function DevicesPage() {
  const [devices, setDevices] = useState<any[]>([]);

  useEffect(() => {
    const initialDevices = Array.from({ length: 10 }).map((_, i) => ({
      id: `dev-${i + 1}`,
      deviceId: `device_${(i + 1).toString().padStart(2, '0')}`,
      name: `Sensor ${(i + 1).toString().padStart(2, '0')}`,
      zone: i < 5 ? 'Zone 1' : 'Zone 2',
      status: Math.random() > 0.1 ? 'ONLINE' : 'OFFLINE',
      firmware: 'v1.0.0',
      lastSeen: '2 minutes ago',
      battery: Math.floor(Math.random() * 40) + 60,
      signal: Math.floor(Math.random() * 30) + 70,
    }));
    setDevices(initialDevices);
  }, []);

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Device Management</h1>
          <p className="text-muted-foreground">Monitor and configure LoRaWAN sensor nodes across agricultural zones.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 glass">
            <RefreshCw className="h-4 w-4" />
            Sync All
          </Button>
          <Button className="gap-2 neon-border">
            <Plus className="h-4 w-4" />
            Provision Device
          </Button>
        </div>
      </div>

      <Card className="glass overflow-hidden">
        <CardHeader className="bg-white/5 border-b border-white/5">
          <CardTitle className="text-lg font-medium">Network Nodes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="w-[150px]">Device ID</TableHead>
                <TableHead>Friendly Name</TableHead>
                <TableHead>Zone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Firmware</TableHead>
                <TableHead>Health</TableHead>
                <TableHead>Last Seen</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {devices.map((device) => (
                <TableRow key={device.id} className="border-white/5 hover:bg-white/5 group transition-colors">
                  <TableCell className="font-mono text-xs text-primary">{device.deviceId}</TableCell>
                  <TableCell className="font-medium">{device.name}</TableCell>
                  <TableCell>{device.zone}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "gap-1.5",
                        device.status === 'ONLINE' ? 'border-primary/20 bg-primary/10 text-primary' : 'border-destructive/20 bg-destructive/10 text-destructive'
                      )}
                    >
                      <span className={cn("h-1.5 w-1.5 rounded-full", device.status === 'ONLINE' ? 'bg-primary' : 'bg-destructive')} />
                      {device.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <code className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded">{device.firmware}</code>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Battery className={cn("h-3 w-3", device.battery < 20 ? 'text-destructive' : 'text-primary')} />
                        <span className="text-[10px]">{device.battery}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Signal className="h-3 w-3 text-blue-500" />
                        <span className="text-[10px]">{device.signal}dBm</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{device.lastSeen}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="h-8 w-8 p-0 flex items-center justify-center rounded-md hover:bg-white/5 transition-colors cursor-pointer outline-none">
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="glass">
                        <DropdownMenuLabel>Device Actions</DropdownMenuLabel>
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                          <History className="h-4 w-4" /> View Telemetry
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                          <RefreshCw className="h-4 w-4" /> Trigger OTA
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuItem className="text-destructive gap-2 cursor-pointer">
                           Decommission
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}


