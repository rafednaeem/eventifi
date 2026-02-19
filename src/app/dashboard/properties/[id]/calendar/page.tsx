'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Loader2, Check, X, AlertCircle } from 'lucide-react'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, isBefore, startOfToday } from 'date-fns'
import { cn } from '@/components/ui'

interface Availability {
    id: string
    date: string
    reason: string | null
}

export default function PropertyCalendar({ params }: { params: { id: string } }) {
    const supabase = createClient()
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [availability, setAvailability] = useState<Availability[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState<string | null>(null)
    const [propertyName, setPropertyName] = useState('')

    useEffect(() => {
        fetchData()
    }, [currentMonth])

    async function fetchData() {
        setLoading(true)

        // Fetch property name
        const { data: prop } = await supabase
            .from('properties')
            .select('name')
            .eq('id', params.id)
            .single()
        if (prop) setPropertyName(prop.name)

        // Fetch availability for current month range
        const start = format(startOfMonth(currentMonth), 'yyyy-MM-dd')
        const end = format(endOfMonth(currentMonth), 'yyyy-MM-dd')

        const { data } = await supabase
            .from('availability')
            .select('*')
            .eq('property_id', params.id)
            .gte('date', start)
            .lte('date', end)

        setAvailability(data || [])
        setLoading(false)
    }

    async function toggleDate(date: Date) {
        if (isBefore(date, startOfToday())) return

        const dateStr = format(date, 'yyyy-MM-dd')
        setSaving(dateStr)

        const existing = availability.find(a => a.date === dateStr)

        if (existing) {
            // Remove block
            const { error } = await supabase
                .from('availability')
                .delete()
                .eq('id', existing.id)

            if (!error) {
                setAvailability(prev => prev.filter(a => a.id !== existing.id))
            }
        } else {
            // Add block
            const { data, error } = await supabase
                .from('availability')
                .insert({
                    property_id: params.id,
                    date: dateStr,
                    reason: 'Booked'
                })
                .select()
                .single()

            if (!error && data) {
                setAvailability(prev => [...prev, data])
            }
        }
        setSaving(null)
    }

    const days = eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth),
    })

    // Calendar grid math
    const firstDayOfMonth = startOfMonth(currentMonth).getDay()
    const blanks = Array(firstDayOfMonth).fill(null)

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Availability Calendar</h1>
                    <p className="text-muted-foreground mt-2">
                        Managing: <span className="font-bold text-foreground">{propertyName || 'Loading...'}</span>
                    </p>
                </div>
                <div className="flex items-center gap-4 bg-card border border-border rounded-xl p-1 shadow-sm">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0"
                        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-bold min-w-[120px] text-center">
                        {format(currentMonth, 'MMMM yyyy')}
                    </span>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0"
                        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Calendar Card */}
                <div className="lg:col-span-2 bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-border bg-zinc-50/50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CalendarIcon className="h-5 w-5 text-primary" />
                            <h2 className="font-bold">Booking Status</h2>
                        </div>
                        <div className="flex items-center gap-4 text-xs">
                            <div className="flex items-center gap-1.5">
                                <div className="h-3 w-3 rounded-full bg-zinc-100 border border-zinc-200" />
                                <span className="text-muted-foreground font-medium">Available</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="h-3 w-3 rounded-full bg-primary border border-primary/20 shadow-sm shadow-primary/30" />
                                <span className="text-muted-foreground font-medium">Blocked</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-7 gap-px mb-4">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground py-2">
                                    {day}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-2">
                            {blanks.map((_, i) => <div key={`blank-${i}`} />)}
                            {days.map((day: Date) => {
                                const dateStr = format(day, 'yyyy-MM-dd')
                                const isBlocked = availability.some(a => a.date === dateStr)
                                const isPast = isBefore(day, startOfToday())
                                const isCurrentlySaving = saving === dateStr

                                return (
                                    <button
                                        key={dateStr}
                                        disabled={isPast || isCurrentlySaving}
                                        onClick={() => toggleDate(day)}
                                        className={cn(
                                            "group relative aspect-square flex flex-col items-center justify-center rounded-2xl border transition-all duration-200",
                                            isPast ? "bg-zinc-50 border-zinc-100 opacity-40 cursor-not-allowed" :
                                                isBlocked ? "bg-primary border-primary text-white shadow-xl shadow-primary/20 scale-[0.98]" :
                                                    "bg-zinc-100 border-zinc-200 hover:border-primary/50 hover:bg-white hover:scale-105 hover:shadow-lg active:scale-95",
                                            isToday(day) && !isBlocked && "ring-2 ring-primary ring-offset-2"
                                        )}
                                    >
                                        <span className={cn(
                                            "text-sm font-black",
                                            isBlocked ? "text-white" : "text-zinc-600"
                                        )}>
                                            {format(day, 'd')}
                                        </span>

                                        {isCurrentlySaving ? (
                                            <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                                                <Loader2 className="h-4 w-4 animate-spin text-white" />
                                            </div>
                                        ) : isBlocked ? (
                                            <Check className="h-3 w-3 mt-1 text-white/70" />
                                        ) : !isPast && (
                                            <div className="h-1 w-1 rounded-full bg-transparent group-hover:bg-primary/40 mt-1 transition-colors" />
                                        )}

                                        {isToday(day) && (
                                            <div className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-primary" />
                                        )}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Legend / Info Card */}
                <div className="space-y-6">
                    <div className="bg-primary/5 border border-primary/10 rounded-3xl p-8">
                        <div className="flex items-center gap-3 mb-4 text-primary">
                            <AlertCircle className="h-6 w-6" />
                            <h3 className="text-xl font-bold">Manage Dates</h3>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Tap any date to mark it as <span className="text-primary font-bold">Blocked</span>.
                            Users will not be able to send inquiries for these dates.
                        </p>
                        <div className="mt-8 space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0 mt-0.5">
                                    <Check className="h-3 w-3" />
                                </div>
                                <p className="text-[11px] font-medium text-muted-foreground">Blocked dates are hidden from public calendars.</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0 mt-0.5">
                                    <Check className="h-3 w-3" />
                                </div>
                                <p className="text-[11px] font-medium text-muted-foreground">Changes are saved instantly to the database.</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="h-5 w-5 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-500 shrink-0 mt-0.5">
                                    <X className="h-3 w-3" />
                                </div>
                                <p className="text-[11px] font-medium text-muted-foreground">Past dates cannot be modified.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-3xl p-8 space-y-4">
                        <h3 className="font-bold flex items-center gap-2">
                            <Loader2 className="h-4 w-4 text-primary" /> System Sync
                        </h3>
                        <p className="text-xs text-muted-foreground">
                            Your availability status is synced in real-time with the Inquiry engine. Manual blocks take priority over external bookings.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
