import { createClient } from '@/lib/supabase/server'
import { cn } from '@/components/ui'
import {
    Building2,
    Briefcase,
    MessageSquare,
    Users,
    TrendingUp,
    Clock,
    CheckCircle2,
    AlertCircle
} from 'lucide-react'

export default async function AdminDashboardPage() {
    const supabase = await createClient()

    // Fetch basic stats
    const { count: propertyCount } = await supabase.from('properties').select('*', { count: 'exact', head: true })
    const { count: pendingProperties } = await supabase.from('properties').select('*', { count: 'exact', head: true }).eq('status', 'pending')

    const { count: serviceCount } = await supabase.from('services').select('*', { count: 'exact', head: true })
    const { count: pendingServices } = await supabase.from('services').select('*', { count: 'exact', head: true }).eq('status', 'pending')

    const { count: inquiryCount } = await supabase.from('inquiries').select('*', { count: 'exact', head: true })
    const { count: newInquiries } = await supabase.from('inquiries').select('*', { count: 'exact', head: true }).eq('status', 'new')

    const stats = [
        { label: 'Total Properties', value: propertyCount || 0, pending: pendingProperties || 0, icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Total Services', value: serviceCount || 0, pending: pendingServices || 0, icon: Briefcase, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Total Inquiries', value: inquiryCount || 0, pending: newInquiries || 0, icon: MessageSquare, color: 'text-orange-600', bg: 'bg-orange-50' },
    ]

    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-4xl font-black tracking-tight">Platform Overview</h1>
                <p className="text-muted-foreground mt-2">Manage listings, users, and marketplace activity.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-card border border-border p-8 rounded-3xl shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-6">
                            <div className={cn("p-3 rounded-2xl", stat.bg)}>
                                <stat.icon className={cn("h-6 w-6", stat.color)} />
                            </div>
                            <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-zinc-100 px-2 py-1 rounded-full">
                                <Clock className="h-3 w-3" /> Real-time
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-muted-foreground font-bold text-sm uppercase tracking-wider">{stat.label}</p>
                            <h3 className="text-5xl font-black tracking-tighter">{stat.value}</h3>
                        </div>

                        {stat.pending > 0 && (
                            <div className="mt-6 flex items-center gap-2 text-xs font-bold text-orange-600 bg-orange-50 px-3 py-2 rounded-xl">
                                <AlertCircle className="h-3 w-3" />
                                {stat.pending} pending approval
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-card border border-border rounded-3xl p-8">
                    <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600" /> Recent Activity
                    </h3>
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 text-sm">
                            <div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center shrink-0">
                                <Users className="h-5 w-5 text-zinc-500" />
                            </div>
                            <div>
                                <p className="font-bold">New user registration</p>
                                <p className="text-xs text-muted-foreground">2 minutes ago</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                            <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                                <Building2 className="h-5 w-5 text-orange-600" />
                            </div>
                            <div>
                                <p className="font-bold">New property submitted: "The Grand Marquee"</p>
                                <p className="text-xs text-muted-foreground">15 minutes ago</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                <MessageSquare className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="font-bold">Inquiry received for "Luxury Beach House"</p>
                                <p className="text-xs text-muted-foreground">1 hour ago</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-zinc-900 text-white rounded-3xl p-8 overflow-hidden relative">
                    <div className="relative z-10">
                        <h3 className="text-xl font-black mb-2 tracking-tight">System Health</h3>
                        <p className="text-zinc-400 text-sm mb-8">All core services are operational.</p>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-xs">
                                <span className="font-bold text-zinc-500 uppercase tracking-widest">Database</span>
                                <span className="text-green-400 font-bold">STABLE</span>
                            </div>
                            <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                                <div className="h-full w-[98%] bg-green-500" />
                            </div>

                            <div className="flex items-center justify-between text-xs pt-2">
                                <span className="font-bold text-zinc-500 uppercase tracking-widest">Storage</span>
                                <span className="text-green-400 font-bold">STABLE</span>
                            </div>
                            <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                                <div className="h-full w-[94%] bg-green-500" />
                            </div>

                            <div className="flex items-center justify-between text-xs pt-2">
                                <span className="font-bold text-zinc-500 uppercase tracking-widest">Authentication</span>
                                <span className="text-green-400 font-bold">ACTIVE</span>
                            </div>
                            <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                                <div className="h-full w-full bg-green-500" />
                            </div>
                        </div>
                    </div>
                    <div className="absolute -bottom-10 -right-10 h-64 w-64 bg-primary/20 blur-[100px] rounded-full" />
                </div>
            </div>
        </div>
    )
}

