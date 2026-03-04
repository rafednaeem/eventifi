'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/components/ui'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
    Building2, LayoutDashboard, PlusCircle, Settings,
    MessageSquare, ShieldAlert, Link2, Upload
} from 'lucide-react'

type AccountType = 'meta_social' | 'custom_system' | 'offline_manual' | null

const ACCOUNT_TYPE_LABELS: Record<string, string> = {
    meta_social: '📱 Social Vendor',
    custom_system: '💼 Business Vendor',
    offline_manual: '📞 Assisted Mode',
}

export function DashboardSidebar() {
    const pathname = usePathname()
    const supabase = createClient()
    const [role, setRole] = useState<string | null>(null)
    const [accountType, setAccountType] = useState<AccountType>(null)

    useEffect(() => {
        async function getProfile() {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data } = await supabase
                    .from('profiles')
                    .select('role, account_type')
                    .eq('id', user.id)
                    .single()
                setRole(data?.role || null)
                setAccountType((data?.account_type as AccountType) || 'meta_social')
            }
        }
        getProfile()
    }, [])

    const isOffline = accountType === 'offline_manual'

    const navItems = [
        { name: 'Overview', href: '/dashboard', icon: LayoutDashboard, show: true },
        {
            name: 'My Listings',
            href: '/dashboard/listings',
            icon: Building2,
            show: (role === 'property_owner' || role === 'service_provider' || role === 'admin') && !isOffline,
        },
        { name: 'Bookings & Inquiries', href: '/dashboard/bookings', icon: MessageSquare, show: true },
        {
            name: 'Booking Link',
            href: '/dashboard/share',
            icon: Link2,
            show: !isOffline,
        },
        {
            name: 'Import Listings',
            href: '/dashboard/import',
            icon: Upload,
            show: accountType === 'custom_system',
        },
        {
            name: 'Admin Panel',
            href: '/dashboard/admin',
            icon: ShieldAlert,
            show: role === 'admin',
        },
        { name: 'Settings', href: '/dashboard/settings', icon: Settings, show: true },
    ]

    const filteredItems = navItems.filter(item => item.show)

    return (
        <aside className="w-64 border-r border-border bg-card hidden md:block">
            <div className="flex h-full flex-col">
                {/* Account Type Badge */}
                {accountType && (
                    <div className="px-4 pt-6 pb-2">
                        <span className="inline-block px-3 py-1 text-xs font-bold rounded-full bg-orange-100 text-orange-700 tracking-wide">
                            {ACCOUNT_TYPE_LABELS[accountType]}
                        </span>
                    </div>
                )}

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

                {/* Add Listing CTA — hidden for offline vendors */}
                {!isOffline && (
                    <div className="p-4 border-t border-border">
                        {role === 'property_owner' && (
                            <Link href="/dashboard/listings/new-venue">
                                <button className="flex w-full items-center justify-center space-x-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-lg hover:bg-primary/90 transition-all">
                                    <PlusCircle className="h-4 w-4" />
                                    <span>Add Venue</span>
                                </button>
                            </Link>
                        )}
                        {role === 'service_provider' && (
                            <Link href="/dashboard/listings/new-service">
                                <button className="flex w-full items-center justify-center space-x-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-lg hover:bg-primary/90 transition-all">
                                    <PlusCircle className="h-4 w-4" />
                                    <span>Add Service</span>
                                </button>
                            </Link>
                        )}
                    </div>
                )}

                {/* Assisted mode CTA */}
                {isOffline && (
                    <div className="p-4 border-t border-border">
                        <p className="text-xs text-muted-foreground text-center">
                            Need help? Contact support to manage your listing.
                        </p>
                    </div>
                )}
            </div>
        </aside>
    )
}
