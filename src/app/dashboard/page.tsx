import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui'
import Link from 'next/link'
import { Building, ArrowRight, MessageSquare } from 'lucide-react'

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

    // Quick stats
    const { count: listingCount } = await supabase
        .from('listings')
        .select('*', { count: 'exact', head: true })
        .eq('owner_id', user.id)

    // For simplicity MVP, counting total bookings where user is an owner of the item
    // In a production app, we would join properly, but this gets raw booking items count
    const { count: bookingCount } = await supabase
        .from('booking_items')
        .select('*, listings!inner(owner_id)', { count: 'exact', head: true })
        .eq('listings.owner_id', user.id)

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Welcome back, {profile?.full_name?.split(' ')[0]}!</h1>
                <p className="text-muted-foreground mt-2">Here's what's happening with your EventiFi listings.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-sm text-muted-foreground">My Active Listings</h3>
                        <Building className="h-4 w-4 text-orange-500" />
                    </div>
                    <p className="text-2xl font-bold mt-2 text-slate-900">{listingCount || 0}</p>
                    <Link href="/dashboard/listings" className="text-xs text-orange-600 hover:text-orange-700 font-bold flex items-center mt-2 group">
                        Manage all listings <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-sm text-muted-foreground">Total Bookings</h3>
                        <MessageSquare className="h-4 w-4 text-green-500" />
                    </div>
                    <p className="text-2xl font-bold mt-2 text-slate-900">{bookingCount || 0}</p>
                    <Link href="/dashboard/bookings" className="text-xs text-green-600 hover:text-green-700 font-bold flex items-center mt-2 group">
                        Review Bookings <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>

            <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-12 flex flex-col items-center justify-center text-center">
                <div className="h-16 w-16 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-6">
                    <Building className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900">Ready to boost your earnings?</h3>
                <p className="text-slate-500 mt-2 mb-8 max-w-md mx-auto">
                    Add another venue or expand your portfolio by offering a new service (catering, decor, music) to the EventiFi Marketplace.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/dashboard/listings/new-venue">
                        <Button className="w-full bg-slate-900 hover:bg-slate-800 font-bold shadow-lg shadow-slate-900/10">Add New Venue</Button>
                    </Link>
                    <Link href="/dashboard/listings/new-service">
                        <Button className="w-full bg-orange-500 hover:bg-orange-600 font-bold shadow-lg shadow-orange-500/20 text-white">Add New Service</Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
