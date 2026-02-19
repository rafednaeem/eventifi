import { createClient } from '@/lib/supabase/server'
import {
    MessageSquare,
    Calendar,
    Users,
    MapPin,
    ExternalLink,
    ChevronRight,
    Clock,
    CheckCircle2,
    AlertCircle,
    Building2,
    Briefcase
} from 'lucide-react'
import { Button, cn } from '@/components/ui'
import Link from 'next/link'
import { format } from 'date-fns'

interface Inquiry {
    id: string
    property_id: string | null
    service_id: string | null
    guest_name: string | null
    guest_email: string
    event_date: string | null
    guests: number | null
    created_at: string
    status: 'new' | 'contacted' | 'converted' | 'closed'
    properties: { name: string; slug: string } | null
    services: { name: string; slug: string } | null
}

export default async function AdminInquiriesPage({
    searchParams,
}: {
    searchParams: { status?: string }
}) {
    const supabase = await createClient()
    const status = searchParams.status || 'all'

    let query = supabase
        .from('inquiries')
        .select(`
      *,
      properties (name, slug),
      services (name, slug)
    `)
        .order('created_at', { ascending: false })

    if (status !== 'all') {
        query = query.eq('status', status)
    }

    const { data: inquiries } = await query

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black tracking-tight">Platform Inquiries</h1>
                <p className="text-muted-foreground mt-2">Monitor all leads and customer interactions across Eventifi.</p>
            </div>

            <div className="flex gap-2">
                {['all', 'new', 'contacted', 'converted', 'closed'].map((s) => (
                    <Link key={s} href={`/admin/inquiries?status=${s}`}>
                        <Button
                            variant={status === s ? 'primary' : 'outline'}
                            size="sm"
                            className="rounded-xl capitalize h-10 px-5"
                        >
                            {s}
                        </Button>
                    </Link>
                ))}
            </div>

            <div className="grid gap-6">
                {inquiries?.map((inquiry: any) => (
                    <div key={inquiry.id} className="bg-white border border-border rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Target Item */}
                            <div className="lg:w-1/3 shrink-0">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={cn(
                                        "p-2 rounded-xl",
                                        inquiry.property_id ? "bg-orange-100 text-orange-600" : "bg-purple-100 text-purple-600"
                                    )}>
                                        {inquiry.property_id ? <Building2 className="h-4 w-4" /> : <Briefcase className="h-4 w-4" />}
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                        {inquiry.property_id ? 'Property Inquiry' : 'Service Inquiry'}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-black tracking-tighter leading-tight group-hover:text-primary transition-colors">
                                    {inquiry.properties?.name || inquiry.services?.name}
                                </h3>
                                <Link
                                    href={inquiry.property_id ? `/properties/${inquiry.properties?.slug}` : `/services/${inquiry.services?.slug}`}
                                    target="_blank"
                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground mt-3 hover:text-primary transition-colors"
                                >
                                    View Listing <ExternalLink className="h-3 w-3" />
                                </Link>
                            </div>

                            {/* Inquiry Details */}
                            <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-6 py-4 border-l border-border pl-8">
                                <div>
                                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1.5 flex items-center gap-1">
                                        <Users className="h-3 w-3" /> Customer
                                    </p>
                                    <p className="font-bold text-sm">{inquiry.guest_name || 'Anonymous User'}</p>
                                    <p className="text-xs text-muted-foreground">{inquiry.guest_email}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1.5 flex items-center gap-1">
                                        <Calendar className="h-3 w-3" /> Event Date
                                    </p>
                                    <p className="font-bold text-sm">
                                        {inquiry.event_date ? format(new Date(inquiry.event_date), 'MMMM d, yyyy') : 'TBD'}
                                    </p>
                                    <p className="text-xs text-muted-foreground">{inquiry.guests || 0} Guests</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1.5 flex items-center gap-1">
                                        <Clock className="h-3 w-3" /> Submitted
                                    </p>
                                    <p className="font-bold text-sm">
                                        {format(new Date(inquiry.created_at), 'MMM d, h:mm a')}
                                    </p>
                                    <div className={cn(
                                        "mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter",
                                        inquiry.status === 'new' ? "bg-blue-100 text-blue-700" :
                                            inquiry.status === 'converted' ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-600"
                                    )}>
                                        {inquiry.status}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="lg:w-48 shrink-0 flex items-center justify-end gap-2 border-l border-border pl-8">
                                <Button variant="outline" className="rounded-xl w-full h-12 font-bold gap-2">
                                    Review <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
