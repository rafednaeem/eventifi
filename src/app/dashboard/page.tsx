import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui'
import Link from 'next/link'
import { Building, ArrowRight } from 'lucide-react'

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
    const { count: propertyCount } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .eq('owner_id', user.id)

    const { count: leadCount } = await supabase
        .from('inquiries')
        .select('*', { count: 'exact', head: true })
        .eq('property_id', user.id) // This is simplified for now

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Welcome back, {profile?.full_name?.split(' ')[0]}!</h1>
                <p className="text-muted-foreground mt-2">Here's what's happening with your Eventifi listings.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-sm text-muted-foreground">My Properties</h3>
                        <Building className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-2xl font-bold mt-2">{propertyCount || 0}</p>
                    <Link href="/dashboard/properties" className="text-xs text-primary hover:underline flex items-center mt-2 group">
                        View all <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-sm text-muted-foreground">Total Inquiries</h3>
                        <MessageSquare className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-2xl font-bold mt-2">{leadCount || 0}</p>
                    <Link href="/dashboard/leads" className="text-xs text-primary hover:underline flex items-center mt-2 group">
                        Manage leads <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>

            <div className="rounded-2xl border-2 border-dashed border-border p-12 flex flex-col items-center justify-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <Building className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold">Ready to host more events?</h3>
                <p className="text-muted-foreground mt-2 mb-6 max-w-sm mx-auto">
                    List your beach house, villa, or banquet hall and start receiving inquiries from families across Pakistan.
                </p>
                <Link href="/dashboard/properties/new">
                    <Button>Add New Property</Button>
                </Link>
            </div>
        </div>
    )
}
