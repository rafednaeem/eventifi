import { createClient } from '@/lib/supabase/server'
import { ListingForm } from '@/components/admin/listing-form'
import { notFound } from 'next/navigation'

export default async function EditListingPage({ params }: { params: { id: string } }) {
    const supabase = await createClient()

    // Fetch dependencies
    const [
        { data: listing },
        { data: propertyCats },
        { data: serviceCats },
        { data: cities }
    ] = await Promise.all([
        supabase.from('listings').select('*, listing_venues(*), listing_services(*)').eq('id', params.id).single(),
        supabase.from('property_categories').select('*').order('name'),
        supabase.from('service_categories').select('*').order('name'),
        supabase.from('cities').select('*').order('name')
    ])

    if (!listing) notFound()

    return (
        <div className="max-w-6xl mx-auto space-y-10">
            <div>
                <h1 className="text-4xl font-black tracking-tight">Edit Listing</h1>
                <p className="text-muted-foreground mt-2">Updating details for "{listing.title}"</p>
            </div>

            <ListingForm
                initialData={listing}
                cities={cities || []}
                propertyCategories={propertyCats || []}
                serviceCategories={serviceCats || []}
            />
        </div>
    )
}
