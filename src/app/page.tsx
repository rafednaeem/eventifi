import Link from 'next/link'
import { Navbar } from '@/components/layout/navbar'
import { Button } from '@/components/ui'
import { createClient } from '@/lib/supabase/server'
import { Building, Camera, Heart, Music, Palette, Utensils, Waves, Trophy, Trees, Sparkles, Video, Truck, Users, Calendar, Home } from 'lucide-react'

// Icon mapping helper
const icons: Record<string, any> = {
  Building, Camera, Waves, Trophy, Trees, Utensils, Music, Palette, Video, Truck, Users, Calendar, Heart, Sparkles, Home
}

export default async function LandingPage() {
  const supabase = await createClient()

  const { data: propertyCategories } = await supabase
    .from('property_categories')
    .select('*')
    .order('id')

  const { data: serviceCategories } = await supabase
    .from('service_categories')
    .select('*')
    .order('id')

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden bg-background">
          <div className="container relative z-10 px-4 sm:px-8 max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl md:text-7xl">
                Find the Perfect <span className="text-primary italic">Venue</span> & <span className="text-primary italic">Vendors</span>
              </h1>
              <p className="max-w-2xl mx-auto mt-6 text-xl text-muted-foreground">
                Pakistan's first centralized marketplace for wedding halls, villas, caterers, decorators, and everything your event needs.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 mt-10 sm:flex-row">
                <Button size="lg" className="w-full sm:w-auto px-10">
                  Book a Property
                </Button>
                <Button size="lg" variant="outline" className="w-full sm:w-auto px-10">
                  Hire Services
                </Button>
              </div>
            </div>
          </div>

          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        </section>

        {/* Properties Categories */}
        <section className="py-20 bg-background">
          <div className="container px-4 sm:px-8 max-w-7xl mx-auto">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
                🏠 Explore Properties
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                The perfect space for every occasion
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              {propertyCategories?.map((category: any) => {
                const Icon = icons[category.icon || 'Building'] || Building
                return (
                  <Link
                    key={category.id}
                    href={`/properties/category/${category.slug}`}
                    className="group flex flex-col items-center p-6 rounded-2xl border border-border bg-card transition-all hover:border-primary hover:shadow-lg hover:-translate-y-1"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="mt-4 text-sm font-semibold text-center leading-tight">
                      {category.name}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* Services Categories */}
        <section className="py-20 bg-card/50">
          <div className="container px-4 sm:px-8 max-w-7xl mx-auto">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
                🛠️ Discover Services
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Professional partners to execute your vision
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-3">
              {serviceCategories?.map((category: any) => {
                const Icon = icons[category.icon || 'Sparkles'] || Sparkles
                return (
                  <Link
                    key={category.id}
                    href={`/services/category/${category.slug}`}
                    className="group flex items-center p-6 rounded-2xl border border-border bg-card transition-all hover:border-primary hover:shadow-lg"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        Find top {category.name.toLowerCase()} experts
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24">
          <div className="container px-4 sm:px-8 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <h2 className="text-4xl font-black text-foreground">
                All in one platform for your <span className="text-primary italic">next event</span> in Pakistan.
              </h2>
              <div className="grid gap-6">
                {[
                  { title: "Verified Listings", desc: "No scams. We manually inspect and verify event property owners." },
                  { title: "Transparent Pricing", desc: "See estimates and price ranges before you inquire." },
                  { title: "360° Walkthroughs", desc: "Tour the halls virtually before ever stepping inside." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="aspect-[4/3] rounded-3xl bg-primary/5 border-2 border-dashed border-primary/20 flex items-center justify-center">
                <span className="text-primary font-bold text-xl opacity-40">Property & Service Showcase</span>
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-2xl shadow-2xl border border-border flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                  <span className="text-2xl">✓</span>
                </div>
                <div>
                  <p className="font-bold text-sm">150+ Verified Venues</p>
                  <p className="text-xs text-muted-foreground">Across Karachi, Lahore & ISB</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-zinc-950 text-white py-12">
        <div className="container px-4 sm:px-8 max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <span className="text-3xl font-black text-primary">Eventifi</span>
            <p className="mt-4 text-zinc-400 max-w-xs">
              Pakistan's leading marketplace for event spaces and professional services. Join the revolution.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Marketplace</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><Link href="/properties">Browse Venues</Link></li>
              <li><Link href="/services">Find Services</Link></li>
              <li><Link href="/locations">Top Cities</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Partner</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><Link href="/signup">List Property</Link></li>
              <li><Link href="/signup">Join as Vendor</Link></li>
              <li><Link href="/partner/guide">Partner Guide</Link></li>
            </ul>
          </div>
        </div>
        <div className="container px-4 sm:px-8 max-w-7xl mx-auto mt-12 pt-8 border-t border-zinc-800 text-center text-xs text-zinc-500">
          © {new Date().getFullYear()} Eventifi Pakistan. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
