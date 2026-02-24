import { createClient } from '@/lib/supabase/server'
import { ListingForm } from '@/components/admin/listing-form'

export default async function NewListingPage() {
    const supabase = await createClient()

    // Fetch dependencies
    const [
        { data: propertyCats },
        { data: serviceCats },
        { data: cities }
    ] = await Promise.all([
        supabase.from('property_categories').select('*').order('name'),
        supabase.from('service_categories').select('*').order('name'),
        supabase.from('cities').select('*').order('name')
    ])

    return (
        <div className="max-w-6xl mx-auto space-y-10">
            <div>
                <h1 className="text-4xl font-black tracking-tight">Create New Listing</h1>
                <p className="text-muted-foreground mt-2">Add a new property or service provider to the EventiFi network.</p>
            </div>

            <ListingForm
                cities={cities || []}
                propertyCategories={propertyCats || []}
                serviceCategories={serviceCats || []}
            />
        </div>
    )
}
