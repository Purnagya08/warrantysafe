'use client'
import Navbar from '@/components/layout/Navbar'
import Sidebar from '@/components/layout/Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex pt-16">
        <Sidebar />
        <main className="flex-1 md:ml-56 p-6 bg-gray-50 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  )
}
