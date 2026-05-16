"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Cpu, 
  Map, 
  AlertTriangle, 
  UploadCloud, 
  BarChart3, 
  ShieldAlert, 
  FileText,
  LogOut,
  Leaf
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Devices', href: '/devices', icon: Cpu },
  { name: 'Zones', href: '/zones', icon: Map },
  { name: 'Alerts', href: '/alerts', icon: AlertTriangle },
  { name: 'OTA Updates', href: '/ota', icon: UploadCloud },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Security', href: '/security', icon: ShieldAlert },
  { name: 'Logs', href: '/logs', icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-card/30 backdrop-blur-xl">
      <div className="flex h-16 items-center px-6 gap-2">
        <Leaf className="h-6 w-6 text-primary neon-text" />
        <span className="text-xl font-bold tracking-tight">CropGuard <span className="text-primary">AI</span></span>
      </div>
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent/50 hover:text-primary",
                pathname === item.href ? "bg-accent text-primary neon-border" : "text-muted-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </nav>
      </ScrollArea>
      <div className="p-4 border-t border-white/5">
        <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
