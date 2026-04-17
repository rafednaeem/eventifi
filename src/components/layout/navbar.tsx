'use client'

import Link from 'next/link'
import { logout } from '@/app/(auth)/actions'
import { Button } from '@/components/ui'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'

export function Navbar() {
    const [user, setUser] = useState<User | null>(null)
    const supabase = createClient()

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setUser(data.user)
        })
    }, [supabase.auth])

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-xl">
            <div className="container flex h-20 items-center justify-between px-4 sm:px-8 max-w-7xl mx-auto">
                <Link href="/" className="flex items-center space-x-2">
                    <span className="text-2xl font-black tracking-tighter text-white">Eventifi<span className="text-primary font-serif italic">.</span></span>
                </Link>

                <div className="flex items-center space-x-4">
                    {user ? (
                        <>
                            <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                                Dashboard
                            </Link>
                            <form action={logout}>
                                <Button variant="outline" size="sm" type="submit" className="active:scale-95">
                                    Sign Out
                                </Button>
                            </form>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
                                Sign In
                            </Link>
                            <Link href="/signup">
                                <Button size="sm" className="active:scale-95">Get Started</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}
