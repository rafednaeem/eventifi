import { Navbar } from '@/components/layout/navbar'
import { DashboardSidebar } from '@/components/dashboard/sidebar'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <div className="flex flex-1 container mx-auto max-w-7xl px-4 sm:px-8">
                <DashboardSidebar />
                <main className="flex-1 py-8 md:px-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
