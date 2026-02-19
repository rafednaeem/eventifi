'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/components/ui'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Building2, LayoutDashboard, PlusCircle, Settings, MessageSquare, Briefcase } from 'lucide-react'

export function DashboardSidebar() {
    const pathname = usePathname()
    const supabase = createClient()
    const [role, setRole] = useState<string | null>(null)

    useEffect(() => {
        async function getProfile() {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single()
                setRole(data?.role || null)
            }
        }
        getProfile()
    }, [])

    const navItems = [
        { name: 'Overview', href: '/dashboard', icon: LayoutDashboard, show: true },
        {
            name: 'My Properties',
            href: '/dashboard/properties',
            icon: Building2,
            show: role === 'property_owner' || role === 'admin'
        },
        {
            name: 'My Services',
            href: '/dashboard/services',
            icon: Briefcase,
            show: role === 'service_provider' || role === 'admin'
        },
        { name: 'Inquiries', href: '/dashboard/leads', icon: MessageSquare, show: true },
        { name: 'Settings', href: '/dashboard/settings', icon: Settings, show: true },
    ]

    const filteredItems = navItems.filter(item => item.show)

    return (
        <aside className="w-64 border-r border-border bg-card hidden md:block">
            <div className="flex h-full flex-col">
                <div className="flex-1 space-y-1 p-4">
                    {filteredItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-primary/10 hover:text-primary",
                                pathname === item.href ? "bg-primary/10 text-primary" : "text-muted-foreground"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </div>

                <div className="p-4 border-t border-border">
                    {role === 'property_owner' && (
                        <Link href="/dashboard/properties/new">
                            <button className="flex w-full items-center justify-center space-x-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-lg hover:bg-primary/90 transition-all">
                                <PlusCircle className="h-4 w-4" />
                                <span>Add Property</span>
                            </button>
                        </Link>
                    )}
                    {role === 'service_provider' && (
                        <Link href="/dashboard/services/new">
                            <button className="flex w-full items-center justify-center space-x-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-lg hover:bg-primary/90 transition-all">
                                <PlusCircle className="h-4 w-4" />
                                <span>Add Service</span>
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        </aside>
    )
}
