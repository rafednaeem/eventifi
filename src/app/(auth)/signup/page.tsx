'use client'

import Link from 'next/link'
import { useState } from 'react'
import { signup } from './actions'
import { Button, Input, Label } from '@/components/ui'

export default function SignupPage() {
    const [error, setError] = useState<string | null>(null)
    const [role, setRole] = useState<'user' | 'property_owner' | 'service_provider'>('user')

    async function handleSubmit(formData: FormData) {
        const result = await signup(formData)
        if (result?.error) {
            setError(result.error)
        }
    }

    return (
        <div className="mt-8 rounded-xl bg-card p-8 shadow-xl ring-1 ring-border">
            <h2 className="text-2xl font-bold text-foreground">Create Account</h2>
            <p className="mt-2 text-sm text-muted-foreground">
                Join the Eventifi community today.
            </p>

            <form action={handleSubmit} className="mt-6 space-y-4">
                {error && (
                    <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                        {error}
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input id="full_name" name="full_name" type="text" placeholder="John Doe" required />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" name="email" type="email" placeholder="name@example.com" required />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" name="password" type="password" required />
                </div>

                <div className="space-y-2">
                    <Label>I want to:</Label>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                        <button
                            type="button"
                            onClick={() => setRole('user')}
                            className={`rounded-md border p-2 text-xs font-medium transition-all ${role === 'user'
                                    ? 'border-primary bg-primary/10 text-primary shadow-sm'
                                    : 'border-input bg-background hover:bg-accent'
                                }`}
                        >
                            Browse & Book
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('property_owner')}
                            className={`rounded-md border p-2 text-xs font-medium transition-all ${role === 'property_owner'
                                    ? 'border-primary bg-primary/10 text-primary shadow-sm'
                                    : 'border-input bg-background hover:bg-accent'
                                }`}
                        >
                            List Property
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('service_provider')}
                            className={`rounded-md border p-2 text-xs font-medium transition-all ${role === 'service_provider'
                                    ? 'border-primary bg-primary/10 text-primary shadow-sm'
                                    : 'border-input bg-background hover:bg-accent'
                                }`}
                        >
                            List Services
                        </button>
                    </div>
                    <input type="hidden" name="role" value={role} />
                </div>

                <Button type="submit" className="w-full">
                    Create Account
                </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href="/login" className="font-semibold text-primary hover:underline">
                    Sign in
                </Link>
            </p>
        </div>
    )
}
