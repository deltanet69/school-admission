
import { MainNav } from "@/components/main-nav"
import { SearchComponent } from "@/components/search"
import { UserNav } from "@/components/user-nav"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Bell, Settings } from "lucide-react"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen flex-col bg-[#F4F7FE]">
            {/* Main Header */}
            <header className="bg-white border-b px-4 md:px-8 py-3 md:py-4 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-2 md:gap-4">
                    <div className="relative h-12 w-32 md:h-16 md:w-50 transition-all duration-300">
                        <Image src="/logo2.png" alt="Horizon Academy Logo" fill className="object-contain" priority />
                    </div>
                    <Separator orientation="vertical" className="h-8 hidden md:block" />
                    {/* <h1 className="text-xl font-bold text-[#303030]">Horizon Academy</h1> */}
                </div>
                <div className="flex items-center gap-1 md:gap-6">
                    <div className="scale-75 md:scale-100">
                        <SearchComponent />
                    </div>
                    <div className="flex items-center gap-1 md:gap-4 text-[#303030]">
                        <Button variant="ghost" size="icon" className="relative h-9 w-9 md:h-10 md:w-10">
                            <Bell className="h-5 w-5 md:h-6 md:w-6" />
                            <span className="absolute top-1 right-1 h-2.5 w-2.5 md:h-3 md:w-3 rounded-full bg-red-500 border-2 border-white"></span>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 md:h-10 md:w-10">
                            <Settings className="h-5 w-5 md:h-6 md:w-6" />
                        </Button>
                    </div>
                    <UserNav />
                </div>
            </header>

            {/* Sub Header */}
            <div className="bg-white border-b px-4 md:px-8 h-12 flex items-center shadow-sm z-10 overflow-x-auto">
                <MainNav />
            </div>

            <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                {children}
            </main>
        </div>
    )
}
