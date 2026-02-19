import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, GraduationCap, School } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"

async function getStats() {
    // Parallel fetching for performance
    const [
        { count: studentCount },
        { count: teacherCount },
        { count: classCount }
    ] = await Promise.all([
        supabase.from('students').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('teachers').select('*', { count: 'exact', head: true }),
        supabase.from('classrooms').select('*', { count: 'exact', head: true })
    ])

    return {
        studentCount: studentCount || 0,
        teacherCount: teacherCount || 0,
        classCount: classCount || 0
    }
}

export async function DashboardStats() {
    const { studentCount, teacherCount, classCount } = await getStats()

    const stats = [
        {
            title: "Total Students",
            value: studentCount,
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-100",
            gradient: "from-blue-500 to-blue-600",
            description: "Active Students"
        },
        {
            title: "Total Teachers",
            value: teacherCount,
            icon: GraduationCap,
            color: "text-purple-600",
            bg: "bg-purple-100",
            gradient: "from-purple-500 to-purple-600",
            description: "Certified Teachers"
        },
        {
            title: "Total Classes",
            value: classCount,
            icon: School,
            color: "text-orange-600",
            bg: "bg-orange-100",
            gradient: "from-orange-500 to-orange-600",
            description: "Active Classrooms"
        }
    ]

    return (
        <div className="grid gap-6 md:grid-cols-3">
            {stats.map((stat, index) => (
                <Card key={index} className="relative overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300 group">
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-[0.03] group-hover:opacity-[0.08] transition-opacity`} />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xl font-semibold text-muted-foreground">
                            {stat.title}
                        </CardTitle>
                        <div className={`h-10 w-10 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                            <stat.icon className="h-5 w-5" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-[#303030] mt-2">{stat.value}</div>
                        <p className="text-xs text-muted-foreground mt-1 font-medium">
                            {stat.description}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
