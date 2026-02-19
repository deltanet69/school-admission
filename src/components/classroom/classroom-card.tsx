import { Card, CardContent } from "@/components/ui/card"
import { Classroom } from "@/types"
import { Users, ArrowRight, School, Baby } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface ClassroomCardProps {
    classroom: Classroom
    studentCount: number
}

export function ClassroomCard({ classroom, studentCount }: ClassroomCardProps) {
    // Determine icon and color based on classroom name
    let Icon = School
    let iconColor = "text-blue-500"
    let iconBg = "bg-blue-100"

    if (classroom.name.toLowerCase().includes("pre")) {
        Icon = Baby
        iconColor = "text-blue-500"
        iconBg = "bg-blue-100"
    } else if (classroom.name.toLowerCase().includes("kinder")) {
        Icon = School
        iconColor = "text-green-500"
        iconBg = "bg-green-100"
    }

    // Alternating colors for specific names if desired to match design
    if (classroom.name === "Pre School 1") {
        iconColor = "text-blue-500"
        iconBg = "bg-blue-100"
    } else if (classroom.name === "Pre-School 2") {
        iconColor = "text-purple-500"
        iconBg = "bg-purple-100"
    } else if (classroom.name === "Kindergarten 1") {
        iconColor = "text-orange-500"
        iconBg = "bg-orange-100"
    } else if (classroom.name === "Kindergarten 2") {
        iconColor = "text-green-500"
        iconBg = "bg-green-100"
    }


    return (
        <Card className="hover:shadow-xl transition-shadow duration-500 border-none shadow-sm">
            <CardContent className="px-6 flex flex-col justify-between h-full space-y-4">
                <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-full ${iconBg}`}>
                        <Icon className={`h-6 w-6 ${iconColor}`} />
                    </div>
                </div>

                <div>
                    <h3 className="font-medium text-2xl">{classroom.name}</h3>
                    <div className="flex mb-8 items-center mt-2 text-muted-foreground bg-muted/50 px-2 py-1 rounded w-fit text-sm">
                        <Users className="h-3 w-3 mr-2" />
                        <span>{studentCount} Students</span>
                    </div>
                </div>

                <div className="flex items-center justify-between ">
                    <Badge variant="secondary" className="bg-green-100 text-md text-green-700 hover:bg-green-100 font-normal">
                        Active
                    </Badge>
                    <Link
                        href={`/dashboard/classroom/${classroom.slug || classroom.id}`}
                        className="text-blue-500 hover:text-blue-700 flex items-center text-md font-medium"
                    >
                        View <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}
