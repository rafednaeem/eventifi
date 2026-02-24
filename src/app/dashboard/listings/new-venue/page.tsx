'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button, Input, Label, Textarea } from '@/components/ui'
import { Building2, MapPin, Users, Tags, ArrowLeft, Loader2, ImagePlus } from 'lucide-react'
import Link from 'next/link'

export default function NewVenuePage() {
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
        capacityMin: '0',
        capacityMax: '',
        indoorOutdoor: 'both',
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
                    type: 'venue',
                    status: 'pending', // Pending admin approval
                    cover_image_url: formData.coverImageUrl || null
                })
                .select()
                .single()

            if (listingError) throw listingError

            // 2. Insert into listing_venues
            if (listingData) {
                const { error: venueError } = await supabase
                    .from('listing_venues')
                    .insert({
                        listing_id: listingData.id,
                        capacity_min: parseInt(formData.capacityMin) || 0,
                        capacity_max: parseInt(formData.capacityMax),
                        indoor_outdoor: formData.indoorOutdoor,
                        amenities: [] // MVP simplification
                    })

                if (venueError) throw venueError

                // Success, redirect to listings
                router.push('/dashboard/listings')
                router.refresh()
            }
        } catch (error: any) {
            console.error("Error creating venue:", error.message)
            alert("Failed to create venue: " + error.message)
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
                        <Building2 className="w-8 h-8 text-orange-500" /> Add New Venue
                    </h1>
                    <p className="text-muted-foreground mt-2">List your banquet hall, farmhouse, or marquee.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">

                {/* Section 1: Basic Info */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Tags className="w-5 h-5 text-slate-400" /> Basic Information
                    </h2>

                    <div className="space-y-6">
                        <div className="space-y-3">
                            <Label className="text-slate-500 font-bold uppercase tracking-wider text-xs">Venue Name</Label>
                            <Input
                                required name="title" value={formData.title} onChange={handleChange}
                                placeholder="e.g. Grand Pearl Marquee"
                                className="h-14 text-lg bg-slate-50 border-slate-200 focus-visible:ring-orange-500 rounded-xl"
                            />
                        </div>

                        <div className="space-y-3">
                            <Label className="text-slate-500 font-bold uppercase tracking-wider text-xs">Description</Label>
                            <Textarea
                                required name="description" value={formData.description} onChange={handleChange}
                                placeholder="Describe your venue, its vibe, and what makes it special..."
                                className="min-h-[120px] text-base bg-slate-50 border-slate-200 focus-visible:ring-orange-500 rounded-xl resize-none p-4"
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <Label className="text-slate-500 font-bold uppercase tracking-wider text-xs">Base Price (PKR)</Label>
                                <Input
                                    required type="number" name="basePrice" value={formData.basePrice} onChange={handleChange}
                                    placeholder="e.g. 150000"
                                    className="h-14 text-lg bg-slate-50 border-slate-200 focus-visible:ring-orange-500 rounded-xl"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-slate-500 font-bold uppercase tracking-wider text-xs">Cover Image URL</Label>
                                <div className="relative">
                                    <ImagePlus className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                                    <Input
                                        type="url" name="coverImageUrl" value={formData.coverImageUrl} onChange={handleChange}
                                        placeholder="https://example.com/image.jpg"
                                        className="h-14 pl-12 text-base bg-slate-50 border-slate-200 focus-visible:ring-orange-500 rounded-xl"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 2: Location */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-slate-400" /> Location Details
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-3">
                            <Label className="text-slate-500 font-bold uppercase tracking-wider text-xs">City</Label>
                            <select
                                required name="cityId" value={formData.cityId} onChange={handleChange}
                                className="flex w-full h-14 px-4 text-base rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                <option value="" disabled>Select a city</option>
                                {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="space-y-3">
                            <Label className="text-slate-500 font-bold uppercase tracking-wider text-xs">Full Address</Label>
                            <Input
                                required name="address" value={formData.address} onChange={handleChange}
                                placeholder="e.g. 123 Main St, Near Park"
                                className="h-14 text-base bg-slate-50 border-slate-200 focus-visible:ring-orange-500 rounded-xl"
                            />
                        </div>
                    </div>
                </div>

                {/* Section 3: Venue Specifics */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Users className="w-5 h-5 text-slate-400" /> Capacity & Facilities
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="space-y-3">
                            <Label className="text-slate-500 font-bold uppercase tracking-wider text-xs">Min Guests</Label>
                            <Input
                                type="number" name="capacityMin" value={formData.capacityMin} onChange={handleChange}
                                placeholder="0"
                                className="h-14 text-lg bg-slate-50 border-slate-200 focus-visible:ring-orange-500 rounded-xl"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-slate-500 font-bold uppercase tracking-wider text-xs">Max Guests</Label>
                            <Input
                                required type="number" name="capacityMax" value={formData.capacityMax} onChange={handleChange}
                                placeholder="e.g. 500"
                                className="h-14 text-lg bg-slate-50 border-slate-200 focus-visible:ring-orange-500 rounded-xl"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-slate-500 font-bold uppercase tracking-wider text-xs">Setting</Label>
                            <select
                                name="indoorOutdoor" value={formData.indoorOutdoor} onChange={handleChange}
                                className="flex w-full h-14 px-4 text-base rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                <option value="indoor">Indoor Only</option>
                                <option value="outdoor">Outdoor Only</option>
                                <option value="both">Both (Indoor & Outdoor)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Submit Action */}
                <div className="flex justify-end pt-4">
                    <Button
                        type="submit"
                        disabled={loading}
                        className="h-14 px-10 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-lg shadow-xl shadow-slate-900/20 hover:-translate-y-0.5 transition-all w-full md:w-auto"
                    >
                        {loading ? (
                            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Saving Venue...</>
                        ) : (
                            'Submit Venue for Approval'
                        )}
                    </Button>
                </div>

            </form>
        </div>
    )
}
