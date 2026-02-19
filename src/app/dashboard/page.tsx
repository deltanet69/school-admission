import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RegistrationChart } from "@/components/dashboard/registration-chart"
import { RightSidebar } from "@/components/dashboard/right-sidebar"
import { AcademicOverview } from "@/components/dashboard/academic-overview"

export const revalidate = 0 // Ensure real-time data

export default function DashboardPage() {
    return (
        <div className="flex flex-col lg:flex-row gap-8 mx-4 md:mx-8 lg:mx-20 animate-in fade-in duration-500">
            {/* Main Content */}
            <div className="flex-1 space-y-8">
                <div>
                    <h2 className="text-3xl font-extrabold tracking-tight text-[#303030]">Dashboard Overview</h2>
                    <p className="text-muted-foreground mt-1 text-lg">
                        Welcome to Jakarta Cosmopolite Islamic School Management Dashboard
                    </p>
                </div>

                <DashboardStats />

                <section className="space-y-4">
                    <RegistrationChart />
                </section>

                <AcademicOverview />
            </div>

            {/* Right Sidebar */}
            <div className="w-full lg:w-[350px] mt-6 lg:mt-24">
                <RightSidebar />
            </div>
        </div>
    )
}
