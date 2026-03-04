import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui'
import Link from 'next/link'
import { Building, ArrowRight, MessageSquare, Link2, Phone } from 'lucide-react'

const POOL_CONFIG = {
    meta_social: {
        label: '📱 Social Vendor',
        color: 'bg-blue-100 text-blue-700',
        description: 'Share your booking link in your Instagram bio to get direct inquiries.',
        cta: { label: 'Get Your Booking Link', href: '/dashboard/share', color: 'bg-blue-600 hover:bg-blue-700' },
    },
    custom_system: {
        label: '💼 Business Vendor',
        color: 'bg-violet-100 text-violet-700',
        description: 'Import your existing bookings and manage everything from one dashboard.',
        cta: { label: 'Import from CSV', href: '/dashboard/import', color: 'bg-violet-600 hover:bg-violet-700' },
    },
    offline_manual: {
        label: '📞 Assisted Mode',
        color: 'bg-slate-100 text-slate-700',
        description: 'Your listings are managed by the Eventifi team. Inquiries will appear here automatically.',
        cta: null,
    },
}

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    const accountType = (profile?.account_type || 'meta_social') as keyof typeof POOL_CONFIG
    const poolInfo = POOL_CONFIG[accountType]

    // Quick stats
    const { count: listingCount } = await supabase
        .from('listings')
        .select('*', { count: 'exact', head: true })
        .eq('owner_id', user.id)

    const { count: inquiryCount } = await supabase
        .from('inquiries')
        .select('*, listings!inner(owner_id)', { count: 'exact', head: true })
        .eq('listings.owner_id', user.id)
        .eq('status', 'new')

    const { count: bookingCount } = await supabase
        .from('booking_items')
        .select('*, listings!inner(owner_id)', { count: 'exact', head: true })
        .eq('listings.owner_id', user.id)

    const isOffline = accountType === 'offline_manual'

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Welcome back, {profile?.full_name?.split(' ')[0]}!</h1>
                    <p className="text-muted-foreground mt-1">Here's what's happening with your EventiFi listings.</p>
                </div>
                <span className={`self-start sm:self-center px-3 py-1 text-xs font-bold rounded-full tracking-wide ${poolInfo.color}`}>
                    {poolInfo.label}
                </span>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {!isOffline && (
                    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-sm text-muted-foreground">Active Listings</h3>
                            <Building className="h-4 w-4 text-orange-500" />
                        </div>
                        <p className="text-2xl font-bold mt-2 text-slate-900">{listingCount || 0}</p>
                        <Link href="/dashboard/listings" className="text-xs text-orange-600 hover:text-orange-700 font-bold flex items-center mt-2 group">
                            Manage listings <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                )}

                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-sm text-muted-foreground">New Inquiries</h3>
                        <MessageSquare className="h-4 w-4 text-amber-500" />
                    </div>
                    <p className="text-2xl font-bold mt-2 text-slate-900">{inquiryCount || 0}</p>
                    <Link href="/dashboard/bookings" className="text-xs text-amber-600 hover:text-amber-700 font-bold flex items-center mt-2 group">
                        View inquiries <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-sm text-muted-foreground">Total Bookings</h3>
                        <MessageSquare className="h-4 w-4 text-green-500" />
                    </div>
                    <p className="text-2xl font-bold mt-2 text-slate-900">{bookingCount || 0}</p>
                    <Link href="/dashboard/bookings" className="text-xs text-green-600 hover:text-green-700 font-bold flex items-center mt-2 group">
                        Review bookings <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>

            {/* Pool-aware CTA banner */}
            <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-10 flex flex-col items-center justify-center text-center">
                {isOffline ? (
                    <>
                        <div className="h-14 w-14 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center mb-5">
                            <Phone className="h-7 w-7" />
                        </div>
                        <h3 className="text-xl font-extrabold text-slate-900">You're in Assisted Mode</h3>
                        <p className="text-slate-500 mt-2 max-w-md mx-auto">{poolInfo.description}</p>
                    </>
                ) : (
                    <>
                        <div className="h-14 w-14 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-5">
                            {accountType === 'custom_system' ? <Building className="h-7 w-7" /> : <Link2 className="h-7 w-7" />}
                        </div>
                        <h3 className="text-xl font-extrabold text-slate-900">
                            {accountType === 'custom_system' ? 'Ready to import your data?' : 'Share your booking link'}
                        </h3>
                        <p className="text-slate-500 mt-2 mb-6 max-w-md mx-auto">{poolInfo.description}</p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            {poolInfo.cta && (
                                <Link href={poolInfo.cta.href}>
                                    <Button className={`font-bold text-white shadow-lg ${poolInfo.cta.color}`}>
                                        {poolInfo.cta.label}
                                    </Button>
                                </Link>
                            )}
                            <Link href="/dashboard/listings/new-venue">
                                <Button className="bg-slate-900 hover:bg-slate-800 font-bold shadow-lg shadow-slate-900/10">
                                    Add New Venue
                                </Button>
                            </Link>
                            <Link href="/dashboard/listings/new-service">
                                <Button className="bg-orange-500 hover:bg-orange-600 font-bold shadow-lg shadow-orange-500/20 text-white">
                                    Add New Service
                                </Button>
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
