import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import {
  Building, Camera, Heart, Music, Palette, Utensils, Waves, Trophy, Trees, Sparkles, Video, Truck, Users, Calendar, Home,
  Menu, MapPin, Search, ArrowRight, Castle, Hotel, Tent, type LucideIcon
} from 'lucide-react'

// Icon mapping helper
const icons: Record<string, LucideIcon> = {
  Building, Camera, Waves, Trophy, Trees, Utensils, Music, Palette, Video, Truck, Users, Calendar, Heart, Sparkles, Home, Castle, Hotel, Tent
}

const fallbackImages = [
  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop",
]

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
    <div className="bg-gray-50 text-slate-900 antialiased selection:bg-orange-500 selection:text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-white/85 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-orange-500/30">E</div>
              <span className="font-bold text-2xl text-slate-900 tracking-tight">Eventifi</span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link href="/search" className="text-slate-600 hover:text-orange-600 font-medium transition-colors">Explore</Link>
              <Link href="/event-builder" className="text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1 transition-colors"><Sparkles className="w-4 h-4" /> Event Builder</Link>
              <Link href="/about" className="text-slate-600 hover:text-orange-600 font-medium transition-colors">About</Link>
              <button className="px-6 py-2.5 rounded-full bg-slate-900 text-white font-medium hover:bg-orange-600 transition-all duration-300 shadow-lg hover:shadow-orange-500/30 transform hover:-translate-y-0.5">
                Get Started
              </button>
            </div>
            {/* Mobile Menu Button */}
            <button
              type="button"
              aria-label="Toggle menu"
              className="md:hidden text-slate-600 p-2 rounded-lg hover:bg-slate-100 active:scale-95 transition-all"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-20 min-h-[85vh] flex items-center justify-center overflow-hidden bg-slate-900">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2069&auto=format&fit=crop" className="w-full h-full object-cover opacity-20" alt="Events Background" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/80 to-slate-900"></div>
        </div>

        {/* Abstract Glows */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>

        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 text-center mt-10">
          <span className="inline-block py-1.5 px-4 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-sm font-semibold mb-8 backdrop-blur-md">
            ✨ The #1 Marketplace for Events in Pakistan
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6 tracking-tight">
            Celebrate Life, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">We Handle the Rest.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-2xl mx-auto font-light">
            Discover and book the finest venues, photographers, and caterers for your next big celebration. Verified listings, transparent pricing.
          </p>

          {/* Search Bar */}
          <form action="/search" method="GET" className="bg-white p-2 rounded-2xl shadow-2xl max-w-4xl mx-auto flex flex-col md:flex-row gap-2 items-center transform hover:scale-[1.01] transition-all duration-300 focus-within:scale-[1.01]">
            <div className="flex-1 w-full flex items-center px-4 h-14 bg-gray-50 rounded-xl border border-transparent hover:border-orange-200 focus-within:bg-white focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-500/20 transition-all">
              <MapPin className="text-orange-500 w-5 h-5 mr-3 shrink-0" />
              <input
                type="text"
                name="city"
                placeholder="Location (e.g. Lahore)"
                aria-label="Location"
                className="bg-transparent w-full outline-none text-slate-700 placeholder-slate-400 font-medium"
              />
            </div>
            <div className="hidden md:block w-px h-8 bg-gray-200"></div>
            <div className="flex-1 w-full flex items-center px-4 h-14 bg-gray-50 rounded-xl border border-transparent hover:border-orange-200 focus-within:bg-white focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-500/20 transition-all">
              <Search className="text-orange-500 w-5 h-5 mr-3 shrink-0" />
              <input
                type="text"
                name="q"
                placeholder="Search Venues or Services..."
                aria-label="Search venues or services"
                className="bg-transparent w-full outline-none text-slate-700 placeholder-slate-400 font-medium"
              />
            </div>
            <button type="submit" className="w-full md:w-auto px-10 h-14 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2">
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Properties Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-2">Find Your Space</h2>
              <p className="text-slate-500 text-lg">Curated properties for every occasion.</p>
            </div>
            <Link href="/properties" className="hidden md:flex items-center text-orange-600 font-bold hover:text-orange-700 transition-colors">
              View All <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {propertyCategories?.slice(0, 6).map((category, index) => {
              const Icon = icons[category.icon || 'Castle'] || Castle
              const imageSrc = fallbackImages[index % fallbackImages.length]
              return (
                <Link href={`/properties/category/${category.slug}`} key={category.id} className="group relative h-96 rounded-[2rem] overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 block">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10"></div>
                  <img src={imageSrc} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" alt={category.name} />
                  <div className="absolute bottom-0 left-0 p-8 z-20 w-full">
                    <div className="flex items-center gap-2 text-orange-400 mb-2">
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-bold tracking-wider uppercase">Property</span>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-1">{category.name}</h3>
                    <p className="text-slate-300 font-medium">Explore Properties</p>
                  </div>
                </Link>
              )
            })}
            {(!propertyCategories || propertyCategories.length === 0) && (
              <div className="col-span-1 md:col-span-3 text-center py-20 text-slate-500">
                Fetching properties...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]"></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="text-orange-500 font-bold tracking-wider uppercase text-sm">Everything You Need</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-3">Premium Event Services</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {serviceCategories?.map((category) => {
              const Icon = icons[category.icon || 'Sparkles'] || Sparkles
              return (
                <Link href={`/services/category/${category.slug}`} key={category.id} className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-3xl border border-slate-700 hover:border-orange-500/50 transition-all hover:bg-slate-800 group cursor-pointer block">
                  <div className="w-14 h-14 bg-orange-500/10 text-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-500 group-hover:text-white transition-all">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                  <p className="text-slate-400">Find top {category.name.toLowerCase()} experts for your event.</p>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4 text-white font-bold text-2xl">
            <div className="w-6 h-6 bg-orange-500 rounded"></div> Eventifi
          </div>
          <p className="text-sm mb-8">Making celebrations simpler, better, and more memorable.</p>
          <p className="text-xs text-slate-600">© {new Date().getFullYear()} Eventifi. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
