'use client'

import { useState } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { createClient } from '@/lib/supabase/client'
import { Button, Input, Label } from '@/components/ui'
import { ShieldCheck, CreditCard, ChevronRight, MapPin, Calendar, Clock, Lock } from 'lucide-react'
import Link from 'next/link'
import { createMockBooking } from './actions'

export default function CheckoutPage() {
    // In a real flow, this would read from a global Cart state or query params.
    // For MVP, we're mocking the payload derived from the Event Builder.
    const [cart] = useState({
        venue: { id: '1', title: 'Grand Marquis Hall', price: 150000, type: 'Venue' },
        services: [
            { id: '2', title: 'Premium Catering (250 pax)', price: 75000, type: 'Catering' },
            { id: '3', title: 'Floral Decor Bronze', price: 25000, type: 'Decoration' }
        ]
    })

    const totalAmount = cart.venue.price + cart.services.reduce((acc, s) => acc + s.price, 0)
    const depositAmount = totalAmount * 0.10 // 10% MVP platform hold
    const remainingAmount = totalAmount - depositAmount

    const [isProcessing, setIsProcessing] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsProcessing(true)

        try {
            // Mock payment delay
            await new Promise(r => setTimeout(r, 2000))

            // Insert into `bookings` and `booking_items` via Server Action
            await createMockBooking(totalAmount, depositAmount)

            setIsSuccess(true)
        } catch (error) {
            console.error(error)
            alert('Failed to process booking. Are you logged in?')
        } finally {
            setIsProcessing(false)
        }
    }

    if (isSuccess) {
        return (
            <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
                <Navbar />
                <main className="flex-1 flex items-center justify-center pt-24 pb-20 px-4">
                    <div className="bg-white rounded-3xl shadow-xl p-12 max-w-lg w-full text-center border border-slate-100">
                        <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShieldCheck className="w-10 h-10" />
                        </div>
                        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Booking Requested!</h1>
                        <p className="text-slate-500 mb-8">
                            Your 10% deposit of PKR {depositAmount.toLocaleString()} has been secured safely. The listing owners have been notified to approve your request.
                        </p>
                        <div className="bg-slate-50 rounded-xl p-6 mb-8 text-left border border-slate-200">
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Request Summary</p>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm font-medium">
                                    <span className="text-slate-600">Total Event Cost</span>
                                    <span className="text-slate-900">PKR {totalAmount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm font-medium text-green-600">
                                    <span>Deposit Paid Today</span>
                                    <span>- PKR {depositAmount.toLocaleString()}</span>
                                </div>
                                <div className="pt-3 border-t border-slate-200 flex justify-between font-bold">
                                    <span className="text-slate-900">Remaining to Owners</span>
                                    <span className="text-slate-900">PKR {remainingAmount.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                        <Link href="/dashboard">
                            <Button className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-lg">
                                View My Dashboard
                            </Button>
                        </Link>
                    </div>
                </main>
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 font-sans selection:bg-orange-500 selection:text-white">
            <Navbar />

            <main className="flex-1 pt-24 pb-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">

                    <div className="mb-10">
                        <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">
                            Secure Checkout
                        </h1>
                        <p className="text-slate-500 text-lg">Review your package and pay the 10% platform deposit to hold your dates.</p>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-12">

                        {/* Payment Details Form */}
                        <div className="lg:col-span-7 space-y-8">
                            <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    <CreditCard className="w-6 h-6 text-orange-500" /> Payment Details
                                </h2>

                                <form onSubmit={handlePayment} className="space-y-6">
                                    <div className="space-y-4">
                                        <Label className="text-slate-500 font-bold uppercase tracking-wider text-xs">Cardholder Name</Label>
                                        <Input required type="text" placeholder="John Doe" className="h-14 text-lg rounded-xl focus-visible:ring-orange-500 bg-slate-50" />
                                    </div>

                                    <div className="space-y-4">
                                        <Label className="text-slate-500 font-bold uppercase tracking-wider text-xs">Card Number</Label>
                                        <div className="relative">
                                            <CreditCard className="absolute left-4 top-4 w-6 h-6 text-slate-400" />
                                            <Input required type="text" placeholder="0000 0000 0000 0000" className="h-14 pl-14 font-mono text-lg rounded-xl focus-visible:ring-orange-500 bg-slate-50" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <Label className="text-slate-500 font-bold uppercase tracking-wider text-xs">Expiry Date</Label>
                                            <Input required type="text" placeholder="MM/YY" className="h-14 text-lg rounded-xl focus-visible:ring-orange-500 bg-slate-50 text-center" />
                                        </div>
                                        <div className="space-y-4">
                                            <Label className="text-slate-500 font-bold uppercase tracking-wider text-xs">CVC</Label>
                                            <Input required type="text" placeholder="123" className="h-14 text-lg rounded-xl focus-visible:ring-orange-500 bg-slate-50 text-center" />
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={isProcessing}
                                        className="w-full h-16 mt-8 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xl shadow-xl shadow-slate-900/20 hover:-translate-y-0.5 transition-all group"
                                    >
                                        {isProcessing ? (
                                            <span className="flex items-center gap-3">
                                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                Processing...
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                <Lock className="w-5 h-5 text-slate-400" />
                                                Pay Deposit (PKR {depositAmount.toLocaleString()})
                                            </span>
                                        )}
                                    </Button>
                                    <p className="text-center text-sm text-slate-400 mt-4 flex justify-center items-center gap-2">
                                        <ShieldCheck className="w-4 h-4" /> Payments are secured by Stripe.
                                    </p>
                                </form>
                            </div>
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:col-span-5">
                            <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8 sticky top-28">
                                <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>

                                <div className="space-y-6">
                                    {/* Venue */}
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-slate-900">{cart.venue.title}</h4>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{cart.venue.type}</p>
                                        </div>
                                        <div className="font-bold text-slate-900">
                                            PKR {cart.venue.price.toLocaleString()}
                                        </div>
                                    </div>

                                    {/* Services */}
                                    {cart.services.map(s => (
                                        <div key={s.id} className="flex justify-between items-start pt-4 border-t border-slate-100">
                                            <div>
                                                <h4 className="font-bold text-slate-600">{s.title}</h4>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{s.type}</p>
                                            </div>
                                            <div className="font-bold text-slate-600">
                                                PKR {s.price.toLocaleString()}
                                            </div>
                                        </div>
                                    ))}

                                    {/* Totals */}
                                    <div className="pt-6 border-t-2 border-slate-100 space-y-4">
                                        <div className="flex justify-between text-slate-500 font-medium">
                                            <span>Subtotal</span>
                                            <span>PKR {totalAmount.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-orange-600 font-bold text-lg bg-orange-50 p-4 rounded-xl border border-orange-100">
                                            <span className="flex flex-col">
                                                Deposit to Pay Now
                                                <span className="text-xs font-medium text-orange-400">10% Platform Hold</span>
                                            </span>
                                            <span>PKR {depositAmount.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-slate-400 font-medium text-sm pt-4">
                                            <span>Remaining Balance</span>
                                            <span>PKR {remainingAmount.toLocaleString()}</span>
                                        </div>
                                        <p className="text-xs text-center text-slate-400 italic">
                                            Remaining balance is paid directly to the vendors.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    )
}
