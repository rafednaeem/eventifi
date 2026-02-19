'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
    BarChart3,
    Building2,
    Briefcase,
    MessageSquare,
    Settings,
    LogOut,
    ShieldCheck,
    LayoutDashboard
} from 'lucide-react'
import { cn } from '@/components/ui'

export function AdminSidebar() {
    const pathname = usePathname()

    const navItems = [
        { name: 'Overview', href: '/admin', icon: LayoutDashboard },
        { name: 'Properties', href: '/admin/properties', icon: Building2 },
        { name: 'Services', href: '/admin/services', icon: Briefcase },
        { name: 'Inquiries', href: '/admin/inquiries', icon: MessageSquare },
        { name: 'Settings', href: '/admin/settings', icon: Settings },
    ]

    return (
        <aside className="w-64 border-r border-border bg-card hidden md:flex flex-col h-screen sticky top-0">
            <div className="p-6 border-b border-border">
                <Link href="/" className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
                        <ShieldCheck className="h-5 w-5" />
                    </div>
                    <span className="font-black text-xl tracking-tighter">ADMIN<span className="text-primary">.</span></span>
                </Link>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all",
                            pathname === item.href
                                ? "bg-primary/10 text-primary shadow-sm"
                                : "text-muted-foreground hover:bg-zinc-100 hover:text-foreground"
                        )}
                    >
                        <item.icon className="h-4 w-4" />
                        {item.name}
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-border">
                <button className="flex w-full items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-destructive hover:bg-destructive/10 transition-all">
                    <LogOut className="h-4 w-4" />
                    Logout
                </button>
            </div>
        </aside>
    )
}
