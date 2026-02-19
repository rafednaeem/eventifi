'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button, Input, Label } from '@/components/ui'
import { Building, MapPin, Camera, X, Loader2, Info, Trophy } from 'lucide-react'
import { ImageUpload } from '@/components/dashboard/image-upload'

export default function NewPropertyPage() {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [cities, setCities] = useState<any[]>([])
    const [categories, setCategories] = useState<any[]>([])
    const [imageUrls, setImageUrls] = useState<string[]>([])
    const [coverUrl, setCoverUrl] = useState('')

    useEffect(() => {
        async function loadData() {
            const { data: cityData } = await supabase.from('cities').select('*').order('name')
            const { data: catData } = await supabase.from('property_categories').select('*').order('name')
            setCities(cityData || [])
            setCategories(catData || [])
        }
        loadData()
    }, [])

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return

        const name = formData.get('name') as string
        const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')

        const propertyData = {
            owner_id: user.id,
            name,
            slug,
            description: formData.get('description'),
            category_id: parseInt(formData.get('category_id') as string),
            city_id: parseInt(formData.get('city_id') as string),
            address: formData.get('address'),
            capacity_min: parseInt(formData.get('capacity_min') as string),
            capacity_max: parseInt(formData.get('capacity_max') as string),
            price_min: parseInt(formData.get('price_min') as string),
            price_max: parseInt(formData.get('price_max') as string),
            cover_image_url: coverUrl,
            status: 'pending'
        }

        const { data: property, error: propError } = await supabase
            .from('properties')
            .insert(propertyData)
            .select()
            .single()

        if (propError) {
            alert(propError.message)
            setLoading(false)
            return
        }

        // Insert gallery images
        if (imageUrls.length > 0) {
            const imageObjects = imageUrls.map((url, index) => ({
                property_id: property.id,
                image_url: url,
                display_order: index,
                is_360: false // Default to false for now
            }))

            await supabase.from('property_images').insert(imageObjects)
        }

        router.push('/dashboard/properties')
        router.refresh()
    }

    return (
        <div className="max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Add New Property</h1>
                <p className="text-muted-foreground mt-2">Fill in the details to list your space on Eventifi.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Info */}
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-6 text-primary">
                        <Info className="h-5 w-5" />
                        <h2 className="font-bold text-lg">General Information</h2>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="name">Property Name</Label>
                            <Input id="name" name="name" placeholder="e.g. Royal Palm Beach Resort" required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category_id">Property Type</Label>
                            <select
                                id="category_id"
                                name="category_id"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                required
                            >
                                <option value="">Select a type</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="description">Description</Label>
                            <textarea
                                id="description"
                                name="description"
                                rows={4}
                                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                placeholder="Tell users what makes your space unique..."
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Media */}
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-6 text-primary">
                        <Camera className="h-5 w-5" />
                        <h2 className="font-bold text-lg">Gallery & Photos</h2>
                    </div>
                    <ImageUpload
                        onUploadComplete={setImageUrls}
                        onCoverSelect={setCoverUrl}
                        maxFiles={8}
                    />
                </div>

                {/* Location */}
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-6 text-primary">
                        <MapPin className="h-5 w-5" />
                        <h2 className="font-bold text-lg">Location Details</h2>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="city_id">City</Label>
                            <select
                                id="city_id"
                                name="city_id"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                required
                            >
                                <option value="">Select city</option>
                                {cities.map(city => (
                                    <option key={city.id} value={city.id}>{city.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="address">Full Address</Label>
                            <Input id="address" name="address" placeholder="House/Street, Area..." required />
                        </div>
                    </div>
                </div>

                {/* Capacity & Price */}
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-6 text-primary">
                        <Trophy className="h-5 w-5" />
                        <h2 className="font-bold text-lg">Capacity & Pricing</h2>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <div className="space-y-2">
                            <Label htmlFor="capacity_min">Min Guests</Label>
                            <Input id="capacity_min" name="capacity_min" type="number" placeholder="50" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="capacity_max">Max Guests</Label>
                            <Input id="capacity_max" name="capacity_max" type="number" placeholder="500" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="price_min">Min Price (PKR)</Label>
                            <Input id="price_min" name="price_min" type="number" placeholder="50,000" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="price_max">Max Price (PKR)</Label>
                            <Input id="price_max" name="price_max" type="number" placeholder="250,000" required />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-4 pb-12">
                    <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button type="submit" size="lg" disabled={loading} className="px-10">
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Submit Listing for Approval
                    </Button>
                </div>
            </form>
        </div>
    )
}
