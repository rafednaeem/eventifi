'use client'

import { useEffect } from 'react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error('Listing Detail Error:', error)
    }, [error])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong!</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-w-full">
                {error.message}
                {error.digest && `\nDigest: ${error.digest}`}
            </pre>
            <button
                onClick={() => reset()}
                className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg"
            >
                Try again
            </button>
        </div>
    )
}
