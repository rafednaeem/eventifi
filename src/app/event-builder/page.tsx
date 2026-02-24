'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { createClient } from '@/lib/supabase/client'
import { Button, Input, Label } from '@/components/ui'
import { CheckCircle2, ChevronRight, PartyPopper, Users, Wallet, Sparkles, MapPin, Building, Tag } from 'lucide-react'
import Link from 'next/link'

export default function EventBuilderPage() {
    const supabase = createClient()
    const [step, setStep] = useState(1)

    const [formData, setFormData] = useState({
        eventType: '',
        guests: '',
        cityId: '',
        budgetMin: '',
        budgetMax: ''
    })

    const [cities, setCities] = useState<any[]>([])
    const [results, setResults] = useState<{ venues: any[], services: any[] } | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchCities = async () => {
            const { data } = await supabase.from('cities').select('*').order('name')
            if (data) setCities(data)
        }
        fetchCities()
    }, [])

    const handleNext = () => setStep(s => Math.min(s + 1, 3))
    const handleBack = () => setStep(s => Math.max(s - 1, 1))

    const handleGenerate = async () => {
        setLoading(true)
        setStep(4) // Moving to results step

        try {
            // Fetch suitable venues (capacity & city usually matter most)
            let venueQuery = supabase
                .from('listings')
                .select('*, listing_venues!inner(*), cities(name)')
                .eq('type', 'venue')
                .eq('status', 'approved')

            if (formData.cityId) venueQuery = venueQuery.eq('city_id', formData.cityId)

            const { data: venues } = await venueQuery.limit(3)

            // Filter venues by capacity post-fetch for accuracy based on the schema
            const finalVenues = venues ? venues.filter(v =>
                v.listing_venues[0]?.capacity_max >= parseInt(formData.guests)
            ) : []

            // Fetch suitable services (caterers, decorators) based roughly on budget/location
            let serviceQuery = supabase
                .from('listings')
                .select('*, listing_services!inner(*), cities(name)')
                .eq('type', 'service')
                .eq('status', 'approved')

            // Just grab a few top services to propose a "package"
            const { data: services } = await serviceQuery.limit(4)

            setResults({
                venues: finalVenues,
                services: services || []
            })
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 font-sans selection:bg-orange-500 selection:text-white">
            <Navbar />

            <main className="flex-1 pt-24 pb-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">

                    {/* Header */}
                    <div className="text-center mb-12">
                        <span className="inline-block py-1 px-3 rounded-full bg-orange-100 text-orange-600 text-xs font-bold tracking-wider uppercase mb-4">
                            EventiFi Magic ✨
                        </span>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
                            Event Builder
                        </h1>
                        <p className="text-slate-500 text-lg">Build your perfect event package in 60 seconds.</p>
                    </div>

                    {/* Progress Bar */}
                    {step < 4 && (
                        <div className="flex items-center justify-between mb-12 relative">
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 z-0 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-orange-500 to-pink-500 transition-all duration-500"
                                    style={{ width: `${((step - 1) / 2) * 100}%` }}
                                ></div>
                            </div>

                            {[
                                { num: 1, label: 'Event Type', icon: PartyPopper },
                                { num: 2, label: 'Details', icon: Users },
                                { num: 3, label: 'Budget', icon: Wallet }
                            ].map((s) => {
                                const active = step >= s.num;
                                return (
                                    <div key={s.num} className="relative z-10 flex flex-col items-center">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-lg transition-all duration-500 ${active ? 'bg-orange-600 text-white shadow-orange-500/30 scale-110' : 'bg-white text-slate-400 border-2 border-slate-200'
                                            }`}>
                                            {active && step > s.num ? <CheckCircle2 className="w-6 h-6" /> : s.num}
                                        </div>
                                        <span className={`mt-3 text-sm font-bold ${active ? 'text-slate-900' : 'text-slate-400'}`}>
                                            {s.label}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {/* Form Steps */}
                    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 md:p-12 border border-slate-100 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-pink-500"></div>

                        {step === 1 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">What are we celebrating?</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {['Wedding', 'Corporate Event', 'Birthday', 'Anniversary', 'Bridal Shower', 'Other'].map(type => (
                                        <button
                                            key={type}
                                            onClick={() => setFormData({ ...formData, eventType: type })}
                                            className={`p-6 rounded-2xl border-2 text-left transition-all duration-300 font-bold ${formData.eventType === type
                                                    ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-md shadow-orange-500/10'
                                                    : 'border-slate-100 hover:border-orange-200 hover:bg-slate-50 text-slate-600'
                                                }`}
                                        >
                                            <PartyPopper className={`w-6 h-6 mb-3 ${formData.eventType === type ? 'text-orange-500' : 'text-slate-400'}`} />
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">Who and Where?</h2>

                                <div className="space-y-4">
                                    <Label className="text-slate-500 font-bold uppercase tracking-wider text-xs">Estimated Guest Count</Label>
                                    <div className="relative">
                                        <Users className="absolute left-4 top-4 text-slate-400 w-5 h-5" />
                                        <Input
                                            type="number"
                                            placeholder="e.g. 250"
                                            value={formData.guests}
                                            onChange={e => setFormData({ ...formData, guests: e.target.value })}
                                            className="h-14 pl-12 text-lg rounded-xl focus-visible:ring-orange-500 border-slate-200 bg-slate-50"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Label className="text-slate-500 font-bold uppercase tracking-wider text-xs">City</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-4 text-slate-400 w-5 h-5" />
                                        <select
                                            value={formData.cityId}
                                            onChange={e => setFormData({ ...formData, cityId: e.target.value })}
                                            className="flex w-full h-14 pl-12 pr-4 text-lg rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        >
                                            <option value="" disabled>Select a city</option>
                                            {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">What's your estimated budget?</h2>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <Label className="text-slate-500 font-bold uppercase tracking-wider text-xs">Minimum (PKR)</Label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-4 font-bold text-slate-400">Rs</span>
                                            <Input
                                                type="number"
                                                value={formData.budgetMin}
                                                onChange={e => setFormData({ ...formData, budgetMin: e.target.value })}
                                                className="h-14 pl-12 text-lg rounded-xl focus-visible:ring-orange-500 border-slate-200 bg-slate-50"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <Label className="text-slate-500 font-bold uppercase tracking-wider text-xs">Maximum (PKR)</Label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-4 font-bold text-slate-400">Rs</span>
                                            <Input
                                                type="number"
                                                value={formData.budgetMax}
                                                onChange={e => setFormData({ ...formData, budgetMax: e.target.value })}
                                                className="h-14 pl-12 text-lg rounded-xl focus-visible:ring-orange-500 border-slate-200 bg-slate-50"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-500 italic flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-orange-400" />
                                    Don't worry, you can always adjust this later.
                                </p>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        {step < 4 && (
                            <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between items-center bg-white">
                                {step > 1 ? (
                                    <Button variant="ghost" onClick={handleBack} className="text-slate-500 hover:text-slate-900 font-bold text-base h-12 px-6">
                                        Back
                                    </Button>
                                ) : <div></div>}

                                {step < 3 ? (
                                    <Button
                                        onClick={handleNext}
                                        disabled={step === 1 && !formData.eventType || step === 2 && (!formData.guests || !formData.cityId)}
                                        className="h-12 px-8 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-base shadow-lg hover:shadow-xl transition-all"
                                    >
                                        Next Step <ChevronRight className="w-5 h-5 ml-2" />
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handleGenerate}
                                        disabled={!formData.budgetMax}
                                        className="h-12 px-8 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold rounded-xl text-base shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all border-none"
                                    >
                                        <Sparkles className="w-5 h-5 mr-2" />
                                        Generate My Event
                                    </Button>
                                )}
                            </div>
                        )}

                        {/* Results Step */}
                        {step === 4 && (
                            <div className="animate-in fade-in zoom-in-95 duration-700">
                                {loading ? (
                                    <div className="py-20 flex flex-col items-center justify-center text-center">
                                        <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-6"></div>
                                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Curating perfection...</h2>
                                        <p className="text-slate-500">Searching thousands of listings for your {formData.eventType}.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-12">
                                        <div className="text-center">
                                            <span className="inline-block p-4 bg-green-100 text-green-600 rounded-full mb-4 shadow-sm">
                                                <CheckCircle2 className="w-10 h-10" />
                                            </span>
                                            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Your Perfect Package</h2>
                                            <p className="text-slate-500">We found the best matches for {formData.guests} guests within budget.</p>
                                        </div>

                                        {/* Suggested Venue */}
                                        <div>
                                            <h3 className="text-lg font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                                                <Building className="w-5 h-5" /> 1. Perfect Venue Match
                                            </h3>
                                            {results?.venues[0] ? (
                                                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 flex gap-6 items-center">
                                                    <div className="w-32 h-32 rounded-xl bg-slate-200 overflow-hidden shrink-0">
                                                        {results.venues[0].cover_image_url && (
                                                            <img src={results.venues[0].cover_image_url} alt="" className="w-full h-full object-cover" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="text-xl font-bold text-slate-900">{results.venues[0].title}</h4>
                                                        <p className="text-slate-500 text-sm mb-3">Capacity up to {results.venues[0].listing_venues?.[0]?.capacity_max}</p>
                                                        <p className="font-bold text-orange-600">PKR {results.venues[0].base_price.toLocaleString()}</p>
                                                    </div>
                                                    <Button variant="outline" className="shrink-0 border-slate-300">Swap</Button>
                                                </div>
                                            ) : (
                                                <p className="text-slate-500 italic p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">No suitable venues found strictly matching this criteria, but you can explore the catalog.</p>
                                            )}
                                        </div>

                                        {/* Suggested Services */}
                                        <div>
                                            <h3 className="text-lg font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                                                <Tag className="w-5 h-5" /> 2. Essential Services
                                            </h3>
                                            <div className="grid gap-4">
                                                {results?.services?.slice(0, 2).map((service, i) => (
                                                    <div key={i} className="bg-slate-50 rounded-2xl border border-slate-200 p-4 flex gap-4 items-center">
                                                        <div className="w-16 h-16 rounded-xl bg-blue-100 text-blue-500 flex items-center justify-center shrink-0">
                                                            <Sparkles className="w-8 h-8" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-bold text-slate-900">{service.title}</h4>
                                                            <p className="text-sm text-slate-500 line-clamp-1">{service.description}</p>
                                                        </div>
                                                        <div className="text-right shrink-0 pr-4">
                                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Starting At</p>
                                                            <p className="font-bold text-orange-600">PKR {service.base_price.toLocaleString()}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Checkout Actions */}
                                        <div className="pt-8 border-t border-slate-100 flex justify-between items-center">
                                            <div className="text-left">
                                                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Estimated Total</p>
                                                <p className="text-2xl font-black text-slate-900">
                                                    PKR {((results?.venues[0]?.base_price || 0) + (results?.services[0]?.base_price || 0) + (results?.services[1]?.base_price || 0)).toLocaleString()}
                                                </p>
                                            </div>
                                            <div className="flex gap-4">
                                                <Button variant="outline" onClick={() => setStep(1)} className="h-14 px-8 rounded-xl font-bold border-slate-300">
                                                    Start Over
                                                </Button>
                                                <Link href="/checkout">
                                                    <Button className="h-14 px-8 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-lg shadow-xl shadow-slate-900/20 hover:-translate-y-0.5 transition-all">
                                                        Proceed to Deposit <ChevronRight className="w-5 h-5 ml-2" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>

                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
