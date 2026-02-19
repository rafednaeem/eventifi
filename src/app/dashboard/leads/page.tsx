import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui'
import { MessageSquare, Calendar, User, Phone, CheckCircle, Clock } from 'lucide-react'

export default async function LeadsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch leads for properties owned by the current user
    // This query uses a join to filter by property owner
    const { data: leads } = await supabase
        .from('inquiries')
        .select(`
      *,
      properties!inner (
        name,
        owner_id
      )
    `)
        .eq('properties.owner_id', user.id)
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Recent Inquiries</h1>
                <p className="text-muted-foreground mt-1">Manage and respond to your potential customers.</p>
            </div>

            {!leads || leads.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-border p-20 flex flex-col items-center justify-center text-center">
                    <MessageSquare className="h-12 w-12 text-muted-foreground/20 mb-4" />
                    <h3 className="text-xl font-bold">No inquiries yet</h3>
                    <p className="text-muted-foreground mt-2 max-w-sm">
                        When users are interested in your property, their details will appear here.
                    </p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {leads.map((lead: any) => (
                        <div
                            key={lead.id}
                            className="group relative flex flex-col bg-card border border-border rounded-xl p-6 transition-all hover:shadow-md"
                        >
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-primary uppercase tracking-widest leading-none">
                                            {lead.properties.name}
                                        </span>
                                        <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                                        <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-black uppercase tracking-tighter">
                                            {lead.status}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold flex items-center gap-2">
                                        Customer Inquiry
                                    </h3>
                                </div>
                                <div className="text-right flex flex-col items-end">
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {new Date(lead.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6 mt-6 py-6 border-y border-border/50">
                                <div className="flex gap-3">
                                    <div className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500">
                                        <Calendar className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Event Date</p>
                                        <p className="text-sm font-semibold">{new Date(lead.event_date).toLocaleDateString('en-PK', { dateStyle: 'long' })}</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500">
                                        <User className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Guests</p>
                                        <p className="text-sm font-semibold">{lead.guests} People</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="h-8 w-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                                        <MessageSquare className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Message</p>
                                        <p className="text-sm italic text-muted-foreground line-clamp-2">"{lead.message}"</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-6">
                                <div className="flex -space-x-2">
                                    <div className="h-8 w-8 rounded-full border-2 border-white bg-orange-100 flex items-center justify-center text-xs font-bold text-primary italic">E</div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm">Ignore</Button>
                                    <Button size="sm" className="gap-2">
                                        <CheckCircle className="h-4 w-4" /> Accept Lead
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
