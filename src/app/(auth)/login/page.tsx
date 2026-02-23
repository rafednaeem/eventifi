'use client'

import Link from 'next/link'
import { useState, use } from 'react'
import { login } from './actions'
import { Button, Input, Label, PasswordInput } from '@/components/ui'

export default function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ message: string }>
}) {
    const { message } = use(searchParams)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(formData: FormData) {
        const result = await login(formData)
        if (result?.error) {
            setError(result.error)
        }
    }

    return (
        <div className="mt-8 rounded-xl bg-card p-8 shadow-xl ring-1 ring-border">
            <h2 className="text-2xl font-bold text-foreground">Sign In</h2>
            <p className="mt-2 text-sm text-muted-foreground">
                Welcome back! Please enter your details.
            </p>

            <form action={handleSubmit} className="mt-6 space-y-4">
                {error && (
                    <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                        {error}
                    </div>
                )}
                {message && (
                    <div className="rounded-md bg-primary/10 p-3 text-sm text-primary font-medium">
                        {message}
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" name="email" type="email" placeholder="name@example.com" required />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <PasswordInput id="password" name="password" required />
                </div>

                <Button type="submit" className="w-full">
                    Sign In
                </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="font-semibold text-primary hover:underline">
                    Sign up
                </Link>
            </p>
        </div>
    )
}
