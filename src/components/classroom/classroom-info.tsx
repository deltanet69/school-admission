import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, BookOpen, GraduationCap } from "lucide-react"

export function ClassroomInfo({ classroom, studentCount }: { classroom: any, studentCount: number }) {
    const stats = [
        {
            title: "Total Students",
            value: studentCount,
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-100",
            gradient: "from-blue-500 to-blue-600",
            description: "Enrolled in this class"
        },
        {
            title: "Homeroom Teacher",
            value: classroom.teachers?.name || "Not Assigned",
            icon: GraduationCap,
            color: "text-purple-600",
            bg: "bg-purple-100",
            gradient: "from-purple-500 to-purple-600",
            description: classroom.teachers ? "Assigned Teacher" : "No teacher assigned"
        },
        {
            title: "Grade Level",
            value: classroom.grade_level,
            icon: BookOpen,
            color: "text-orange-600",
            bg: "bg-orange-100",
            gradient: "from-orange-500 to-orange-600",
            description: "Current Grade"
        },
        {
            title: "Academic Year",
            value: classroom.academic_year,
            icon: Calendar,
            color: "text-emerald-600",
            bg: "bg-emerald-100",
            gradient: "from-emerald-500 to-emerald-600",
            description: "Active Session"
        }
    ]

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
                <Card key={index} className="relative overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300 group">
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-[0.03] group-hover:opacity-[0.08] transition-opacity`} />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            {stat.title}
                        </CardTitle>
                        <div className={`h-10 w-10 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                            <stat.icon className="h-5 w-5" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-[#303030] mt-2 truncate" title={String(stat.value)}>
                            {stat.value}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 font-medium">
                            {stat.description}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
