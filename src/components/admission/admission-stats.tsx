import { Card, CardContent } from "@/components/ui/card"
import { Users, Clock, CheckCircle, XCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

interface AdmissionStatsProps {
    total: number
    pending: number
    approved: number
    rejected: number
}

export function AdmissionStats({ total, pending, approved, rejected }: AdmissionStatsProps) {
    const stats = [
        {
            title: "Total Applications",
            count: total,
            icon: Users,
            color: "text-blue-500",
            bg: "bg-blue-100",
            description: "All time submissions",
            link: "#"
        },
        {
            title: "Pending Review",
            count: pending,
            icon: Clock,
            color: "text-orange-500",
            bg: "bg-orange-100",
            description: "Requires action",
            link: "#"
        },
        {
            title: "Approved",
            count: approved,
            icon: CheckCircle,
            color: "text-green-500",
            bg: "bg-green-100",
            description: "Enrolled students",
            link: "#"
        },
        {
            title: "Rejected",
            count: rejected,
            icon: XCircle,
            color: "text-red-500",
            bg: "bg-red-100",
            description: "Not eligible",
            link: "#"
        }
    ]

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
                <Card key={index} className="hover:shadow-xl transition-shadow duration-500 border-none shadow-sm">
                    <CardContent className="px-6 flex flex-col justify-between h-full space-y-4 pt-6">
                        <div className="flex items-start justify-between mb-2">
                            <div className={`p-3 rounded-full ${stat.bg}`}>
                                <stat.icon className={`h-6 w-6 ${stat.color}`} />
                            </div>
                        </div>

                        <div>
                            <h3 className="font-medium text-lg text-muted-foreground">{stat.title}</h3>
                            <div className="flex mb-4 items-center mt-2 text-foreground font-bold text-3xl">
                                <span>{stat.count}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="text-sm text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                                {stat.description}
                            </div>
                            <Link
                                href={stat.link}
                                className={`flex items-center text-sm font-medium ${stat.color} hover:underline`}
                            >
                                View <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
