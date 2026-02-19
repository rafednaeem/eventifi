'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, isBefore, startOfToday } from 'date-fns'
import { cn, Button } from '@/components/ui'

interface Availability {
    date: string
}

export function PropertyAvailability({ propertyId }: { propertyId: string }) {
    const supabase = createClient()
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [availability, setAvailability] = useState<string[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchAvailability() {
            setLoading(true)
            const start = format(startOfMonth(currentMonth), 'yyyy-MM-dd')
            const end = format(endOfMonth(currentMonth), 'yyyy-MM-dd')

            const { data } = await supabase
                .from('availability')
                .select('date')
                .eq('property_id', propertyId)
                .gte('date', start)
                .lte('date', end)

            if (data) setAvailability(data.map(a => a.date))
            setLoading(false)
        }
        fetchAvailability()
    }, [currentMonth, propertyId])

    const days = eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth),
    })

    const firstDayOfMonth = startOfMonth(currentMonth).getDay()
    const blanks = Array(firstDayOfMonth).fill(null)

    return (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-border bg-zinc-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-bold">Venue Availability</h3>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                    >
                        <ChevronLeft className="h-3 w-3" />
                    </Button>
                    <span className="text-[11px] font-black uppercase tracking-tighter w-24 text-center">
                        {format(currentMonth, 'MMM yyyy')}
                    </span>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                    >
                        <ChevronRight className="h-3 w-3" />
                    </Button>
                </div>
            </div>

            <div className="p-4">
                <div className="grid grid-cols-7 gap-px mb-2">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                        <div key={day} className="text-center text-[9px] font-black text-muted-foreground">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-1 relative">
                    {loading && (
                        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-lg" />
                    )}
                    {blanks.map((_, i) => <div key={`blank-${i}`} />)}
                    {days.map((day: Date) => {
                        const dateStr = format(day, 'yyyy-MM-dd')
                        const isBlocked = availability.includes(dateStr)
                        const isPast = isBefore(day, startOfToday())

                        return (
                            <div
                                key={dateStr}
                                className={cn(
                                    "aspect-square flex items-center justify-center rounded-lg text-[10px] font-bold transition-all",
                                    isPast ? "text-muted-foreground/30" :
                                        isBlocked ? "bg-red-50 text-red-600 border border-red-100 shadow-sm" :
                                            "bg-green-50 text-green-700 border border-green-100",
                                    isToday(day) && "ring-1 ring-primary"
                                )}
                            >
                                {format(day, 'd')}
                                {isBlocked && (
                                    <div className="absolute top-0.5 right-0.5 h-1 w-1 rounded-full bg-red-400" />
                                )}
                            </div>
                        )
                    })}
                </div>

                <div className="mt-4 pt-4 border-t border-border flex items-center justify-center gap-4 text-[9px] font-black uppercase tracking-widest leading-none">
                    <div className="flex items-center gap-1">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        <span className="text-muted-foreground">Available</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="h-2 w-2 rounded-full bg-red-500" />
                        <span className="text-muted-foreground">Booked / Unavailable</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
