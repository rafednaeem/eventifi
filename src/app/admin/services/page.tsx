import { createClient } from '@/lib/supabase/server'
import {
    CheckCircle2,
    XCircle,
    ShieldCheck,
    Star,
    MapPin,
    Briefcase,
    ExternalLink,
    Search
} from 'lucide-react'
import { Button, Input, cn } from '@/components/ui'
import Link from 'next/link'
import {
    updateServiceStatus,
    toggleServiceVerification,
    toggleServiceFeatured
} from '../actions'

export default async function AdminServicesPage({
    searchParams,
}: {
    searchParams: { status?: string; search?: string }
}) {
    const supabase = await createClient()
    const status = searchParams.status || 'all'
    const search = searchParams.search || ''

    let query = supabase
        .from('services')
        .select(`
      *,
      service_categories (name),
      cities (name),
      profiles (full_name, email)
    `)
        .order('created_at', { ascending: false })

    if (status !== 'all') {
        query = query.eq('status', status)
    }

    if (search) {
        query = query.ilike('name', `%${search}%`)
    }

    const { data: services } = await query

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">Service Management</h1>
                    <p className="text-muted-foreground mt-2">Oversee service providers and approve professional listings.</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by business name..."
                        className="pl-10 h-12 bg-card border-border rounded-2xl"
                        defaultValue={search}
                    />
                </div>
                <div className="flex gap-2">
                    {['all', 'pending', 'approved', 'rejected'].map((s) => (
                        <Link key={s} href={`/admin/services?status=${s}`}>
                            <Button
                                variant={status === s ? 'primary' : 'outline'}
                                size="sm"
                                className="rounded-xl capitalize h-12 px-6"
                            >
                                {s}
                            </Button>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="bg-card border border-border rounded-[2rem] overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-zinc-50 border-b border-border">
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Provider Detail</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Contact Info</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Admin Controls</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right px-8">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {services?.map((service: any) => (
                            <tr key={service.id} className="group hover:bg-zinc-50/50 transition-colors">
                                <td className="px-6 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="h-16 w-16 bg-muted rounded-2xl overflow-hidden shrink-0 border border-border">
                                            <img src={service.cover_image_url} alt="" className="h-full w-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-lg leading-tight">{service.name}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] font-black uppercase text-primary tracking-tighter bg-primary/5 px-2 py-0.5 rounded">
                                                    {service.service_categories?.name}
                                                </span>
                                                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <MapPin className="h-3 w-3" /> {service.cities?.name}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-6">
                                    <div className="text-center">
                                        <p className="text-xs font-bold text-foreground">{service.profiles?.full_name}</p>
                                        <p className="text-[10px] text-muted-foreground mt-0.5">{service.profiles?.email}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-6">
                                    <div className="flex items-center justify-center gap-4">
                                        <form action={async () => {
                                            'use server'
                                            await toggleServiceVerification(service.id, !service.is_verified)
                                        }}>
                                            <button className={cn(
                                                "p-2 rounded-xl border transition-all",
                                                service.is_verified ? "bg-blue-50 border-blue-100 text-blue-600 shadow-sm" : "bg-white border-zinc-200 text-zinc-400 opacity-50 grey-scale hover:opacity-100"
                                            )}>
                                                <ShieldCheck className="h-5 w-5" />
                                            </button>
                                        </form>
                                        <form action={async () => {
                                            'use server'
                                            await toggleServiceFeatured(service.id, !service.is_featured)
                                        }}>
                                            <button className={cn(
                                                "p-2 rounded-xl border transition-all",
                                                service.is_featured ? "bg-amber-50 border-amber-100 text-amber-600 shadow-sm" : "bg-white border-zinc-200 text-zinc-400 opacity-50 grey-scale hover:opacity-100"
                                            )}>
                                                <Star className="h-5 w-5" />
                                            </button>
                                        </form>
                                    </div>
                                </td>
                                <td className="px-6 py-6 text-right px-8">
                                    <div className="flex items-center justify-end gap-2">
                                        {service.status !== 'approved' && (
                                            <form action={async () => {
                                                'use server'
                                                await updateServiceStatus(service.id, 'approved')
                                            }}>
                                                <Button variant="secondary" size="sm" className="bg-green-600 hover:bg-green-700 text-white rounded-xl h-9 px-4">
                                                    Approve
                                                </Button>
                                            </form>
                                        )}
                                        {service.status !== 'rejected' && (
                                            <form action={async () => {
                                                'use server'
                                                await updateServiceStatus(service.id, 'rejected')
                                            }}>
                                                <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10 border-destructive/20 rounded-xl h-9 px-4">
                                                    Reject
                                                </Button>
                                            </form>
                                        )}
                                        <Link href={`/services/${service.slug}`} target="_blank">
                                            <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-xl">
                                                <ExternalLink className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
