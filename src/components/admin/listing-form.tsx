'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Input, Textarea, Select, Switch, Label } from '@/components/ui'
import { upsertListing } from '@/app/admin/actions'
import {
    Building2,
    Briefcase,
    Link as LinkIcon,
    MapPin,
    Phone,
    Globe,
    Instagram,
    Facebook,
    MessageCircle,
    Users,
    Package
} from 'lucide-react'

interface ListingFormProps {
    initialData?: any
    cities: any[]
    propertyCategories: any[]
    serviceCategories: any[]
}

export function ListingForm({ initialData, cities, propertyCategories, serviceCategories }: ListingFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [type, setType] = useState(initialData?.type || 'venue')

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const data: any = {
            id: initialData?.id,
            title: formData.get('title'),
            type: formData.get('type'),
            slug: formData.get('slug'),
            description: formData.get('description'),
            base_price: parseFloat(formData.get('base_price') as string),
            city_id: parseInt(formData.get('city_id') as string),
            address: formData.get('address'),
            category_id: parseInt(formData.get('category_id') as string),
            cover_image_url: formData.get('cover_image_url'),
            website_url: formData.get('website_url'),
            phone_number: formData.get('phone_number'),
            whatsapp_number: formData.get('whatsapp_number'),
            instagram_url: formData.get('instagram_url'),
            facebook_url: formData.get('facebook_url'),
            status: initialData?.status || 'approved'
        }

        if (type === 'venue') {
            data.venue_details = {
                capacity_min: parseInt(formData.get('capacity_min') as string),
                capacity_max: parseInt(formData.get('capacity_max') as string),
                indoor_outdoor: formData.get('indoor_outdoor'),
                amenities: []
            }
        } else {
            data.service_details = {
                service_area: [],
                packages: JSON.stringify([]) // TODO: Multi-package support
            }
        }

        try {
            await upsertListing(data)
            router.push('/admin/listings')
            router.refresh()
        } catch (error: any) {
            alert(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-12 pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Basic Info */}
                <div className="lg:col-span-2 space-y-8">
                    <section className="bg-card p-8 border border-border rounded-[2rem] shadow-sm space-y-6">
                        <h3 className="text-xl font-black flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-primary" /> Listing Essentials
                        </h3>

                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Listing Title</Label>
                                <Input id="title" name="title" placeholder="e.g. Royal Palm Grand Ballroom" defaultValue={initialData?.title} required />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="type">Listing Type</Label>
                                    <Select
                                        id="type"
                                        name="type"
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                        required
                                    >
                                        <option value="venue">Venue (Properties)</option>
                                        <option value="service">Service (Providers)</option>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="slug">Slug (URL snippet)</Label>
                                    <Input id="slug" name="slug" placeholder="e.g. royal-palm-ballroom" defaultValue={initialData?.slug} required />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" name="description" placeholder="Describe the listing in detail..." defaultValue={initialData?.description} rows={5} required />
                            </div>
                        </div>
                    </section>

                    <section className="bg-card p-8 border border-border rounded-[2rem] shadow-sm space-y-6">
                        <h3 className="text-xl font-black flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-primary" /> Location & Category
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="city_id">City</Label>
                                <Select id="city_id" name="city_id" defaultValue={initialData?.city_id} required>
                                    {cities.map(city => (
                                        <option key={city.id} value={city.id}>{city.name}</option>
                                    ))}
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="category_id">Category</Label>
                                <Select id="category_id" name="category_id" defaultValue={initialData?.category_id} required>
                                    {type === 'venue'
                                        ? propertyCategories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))
                                        : serviceCategories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))
                                    }
                                </Select>
                            </div>
                            <div className="grid gap-2 md:col-span-2">
                                <Label htmlFor="address">Full Address</Label>
                                <Input id="address" name="address" placeholder="123 Street, Area, City" defaultValue={initialData?.address} required />
                            </div>
                        </div>
                    </section>

                    {/* Conditional Fields: Venues */}
                    {type === 'venue' && (
                        <section className="bg-slate-900 text-white p-8 border border-slate-800 rounded-[2rem] shadow-xl space-y-6">
                            <h3 className="text-xl font-black flex items-center gap-2">
                                <Users className="h-5 w-5 text-orange-500" /> Venue Specifications
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="grid gap-2">
                                    <Label className="text-slate-400">Min Capacity</Label>
                                    <Input id="capacity_min" name="capacity_min" type="number" className="bg-slate-800 border-slate-700 text-white" defaultValue={initialData?.listing_venues?.[0]?.capacity_min || 0} required />
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-slate-400">Max Capacity</Label>
                                    <Input id="capacity_max" name="capacity_max" type="number" className="bg-slate-800 border-slate-700 text-white" defaultValue={initialData?.listing_venues?.[0]?.capacity_max || 0} required />
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-slate-400">Space Type</Label>
                                    <Select id="indoor_outdoor" name="indoor_outdoor" className="bg-slate-800 border-slate-700 text-white" defaultValue={initialData?.listing_venues?.[0]?.indoor_outdoor || 'indoor'} required>
                                        <option value="indoor">Indoor</option>
                                        <option value="outdoor">Outdoor</option>
                                        <option value="both">Both</option>
                                    </Select>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Conditional Fields: Services */}
                    {type === 'service' && (
                        <section className="bg-slate-900 text-white p-8 border border-slate-800 rounded-[2rem] shadow-xl space-y-6">
                            <h3 className="text-xl font-black flex items-center gap-2">
                                <Package className="h-5 w-5 text-blue-500" /> Service Information
                            </h3>
                            <p className="text-slate-400 text-sm italic">Service areas and complex package tiers can be refined after creation in the database.</p>
                        </section>
                    )}
                </div>

                {/* Right Column: Pricing & Meta */}
                <div className="space-y-8">
                    <section className="bg-card p-8 border border-border rounded-[2rem] shadow-sm space-y-6">
                        <h3 className="text-xl font-black flex items-center gap-2">
                            <Globe className="h-5 w-5 text-primary" /> Pricing & Media
                        </h3>
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="base_price">Base Price (PKR)</Label>
                                <Input id="base_price" name="base_price" type="number" placeholder="50000" defaultValue={initialData?.base_price} required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="cover_image_url">Cover Image URL</Label>
                                <Input id="cover_image_url" name="cover_image_url" placeholder="https://..." defaultValue={initialData?.cover_image_url} required />
                            </div>
                        </div>
                    </section>

                    <section className="bg-card p-8 border border-border rounded-[2rem] shadow-sm space-y-6">
                        <h3 className="text-xl font-black flex items-center gap-2">
                            <LinkIcon className="h-5 w-5 text-primary" /> Contact & Social
                        </h3>
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="phone_number">Phone</Label>
                                <div className="flex gap-2">
                                    <div className="bg-zinc-100 p-2.5 rounded-lg">
                                        <Phone className="h-4 w-4 text-zinc-500" />
                                    </div>
                                    <Input id="phone_number" name="phone_number" placeholder="+92 ..." defaultValue={initialData?.phone_number} />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="whatsapp_number">WhatsApp</Label>
                                <div className="flex gap-2">
                                    <div className="bg-zinc-100 p-2.5 rounded-lg">
                                        <MessageCircle className="h-4 w-4 text-emerald-500" />
                                    </div>
                                    <Input id="whatsapp_number" name="whatsapp_number" placeholder="+92 ..." defaultValue={initialData?.whatsapp_number} />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="instagram_url">Instagram</Label>
                                <Input id="instagram_url" name="instagram_url" placeholder="https://instagram.com/..." defaultValue={initialData?.instagram_url} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="facebook_url">Facebook</Label>
                                <Input id="facebook_url" name="facebook_url" placeholder="https://facebook.com/..." defaultValue={initialData?.facebook_url} />
                            </div>
                        </div>
                    </section>

                    <Button type="submit" size="lg" className="w-full rounded-[1.5rem] h-16 font-black text-lg shadow-xl" isLoading={loading}>
                        {initialData ? 'Update Listing' : 'Publish Listing'}
                    </Button>
                </div>
            </div>
        </form>
    )
}
