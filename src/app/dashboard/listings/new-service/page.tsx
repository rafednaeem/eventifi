'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button, Input, Label, Textarea } from '@/components/ui'
import { Briefcase, MapPin, Tags, ArrowLeft, Loader2, ImagePlus, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function NewServicePage() {
    const supabase = createClient()
    const router = useRouter()

    const [loading, setLoading] = useState(false)
    const [cities, setCities] = useState<any[]>([])

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        basePrice: '',
        cityId: '',
        address: '',
        coverImageUrl: ''
    })

    useEffect(() => {
        async function fetchCities() {
            const { data } = await supabase.from('cities').select('*').order('name')
            if (data) setCities(data)
        }
        fetchCities()
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error("Not authenticated")

            const slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(2, 6)

            // 1. Insert into base listings
            const { data: listingData, error: listingError } = await supabase
                .from('listings')
                .insert({
                    owner_id: user.id,
                    title: formData.title,
                    slug: slug,
                    description: formData.description,
                    base_price: parseFloat(formData.basePrice),
                    city_id: parseInt(formData.cityId),
                    address: formData.address,
                    type: 'service', // Critical distinction
                    status: 'pending',
                    cover_image_url: formData.coverImageUrl || null
                })
                .select()
                .single()

            if (listingError) throw listingError

            // 2. Insert into listing_services
            if (listingData) {
                const { error: serviceError } = await supabase
                    .from('listing_services')
                    .insert({
                        listing_id: listingData.id,
                        service_area: [formData.cityId], // MVP assumption: service area is their main city
                        packages: [] // MVP simplification: just rely on base price for now
                    })

                if (serviceError) throw serviceError

                // Success, redirect to listings
                router.push('/dashboard/listings')
                router.refresh()
            }
        } catch (error: any) {
            console.error("Error creating service:", error.message)
            alert("Failed to create service: " + error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/listings">
                    <Button variant="ghost" size="icon" className="rounded-full text-slate-400 hover:text-slate-900 bg-white shadow-sm border border-slate-100">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
                        <Briefcase className="w-8 h-8 text-pink-500" /> Add New Service
                    </h1>
                    <p className="text-muted-foreground mt-2">List your catering, photography, decoration, or entertainment service.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">

                {/* Section 1: Basic Info */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Tags className="w-5 h-5 text-slate-400" /> Service Details
                    </h2>

                    <div className="space-y-6">
                        <div className="space-y-3">
                            <Label className="text-slate-500 font-bold uppercase tracking-wider text-xs">Service Name</Label>
                            <Input
                                required name="title" value={formData.title} onChange={handleChange}
                                placeholder="e.g. Premium Floral Decor by Sarah"
                                className="h-14 text-lg bg-slate-50 border-slate-200 focus-visible:ring-pink-500 rounded-xl"
                            />
                        </div>

                        <div className="space-y-3">
                            <Label className="text-slate-500 font-bold uppercase tracking-wider text-xs">Description</Label>
                            <Textarea
                                required name="description" value={formData.description} onChange={handleChange}
                                placeholder="Describe your service, experience, and what's included..."
                                className="min-h-[120px] text-base bg-slate-50 border-slate-200 focus-visible:ring-pink-500 rounded-xl resize-none p-4"
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <Label className="text-slate-500 font-bold uppercase tracking-wider text-xs">Starting Price (PKR)</Label>
                                <Input
                                    required type="number" name="basePrice" value={formData.basePrice} onChange={handleChange}
                                    placeholder="e.g. 25000"
                                    className="h-14 text-lg bg-slate-50 border-slate-200 focus-visible:ring-pink-500 rounded-xl"
                                />
                                <p className="text-xs text-slate-400">The minimum cost to book your service.</p>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-slate-500 font-bold uppercase tracking-wider text-xs">Cover Image URL</Label>
                                <div className="relative">
                                    <ImagePlus className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                                    <Input
                                        type="url" name="coverImageUrl" value={formData.coverImageUrl} onChange={handleChange}
                                        placeholder="https://example.com/image.jpg"
                                        className="h-14 pl-12 text-base bg-slate-50 border-slate-200 focus-visible:ring-pink-500 rounded-xl"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 2: Location & Range */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-slate-400" /> Operational Area
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-3">
                            <Label className="text-slate-500 font-bold uppercase tracking-wider text-xs">Primary City</Label>
                            <select
                                required name="cityId" value={formData.cityId} onChange={handleChange}
                                className="flex w-full h-14 px-4 text-base rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-pink-500"
                            >
                                <option value="" disabled>Select your main city</option>
                                {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="space-y-3">
                            <Label className="text-slate-500 font-bold uppercase tracking-wider text-xs">Office/Base Address (Optional)</Label>
                            <Input
                                name="address" value={formData.address} onChange={handleChange}
                                placeholder="e.g. Shop #4, Commercial Market"
                                className="h-14 text-base bg-slate-50 border-slate-200 focus-visible:ring-pink-500 rounded-xl"
                            />
                        </div>
                    </div>

                    <div className="bg-pink-50 border border-pink-100 p-4 rounded-xl flex gap-3 text-sm text-pink-800">
                        <CheckCircle2 className="w-5 h-5 text-pink-500 shrink-0" />
                        <p>For this MVP, your service will automatically be listed as available in your Primary City.</p>
                    </div>
                </div>

                {/* Submit Action */}
                <div className="flex justify-end pt-4">
                    <Button
                        type="submit"
                        disabled={loading}
                        className="h-14 px-10 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold rounded-xl text-lg shadow-xl shadow-pink-500/20 hover:-translate-y-0.5 transition-all w-full md:w-auto border-none"
                    >
                        {loading ? (
                            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Saving Service...</>
                        ) : (
                            'List My Service'
                        )}
                    </Button>
                </div>

            </form>
        </div>
    )
}
