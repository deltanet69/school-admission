"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, Clock } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useEffect, useState } from "react"
import { RecentActivity } from "@/components/dashboard/recent-activity"

export function RightSidebar() {
    const [currentTime, setCurrentTime] = useState<Date | null>(null)

    useEffect(() => {
        setCurrentTime(new Date())
        const timer = setInterval(() => {
            setCurrentTime(new Date())
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    // Formatting for Jakarta Time
    const formattedDate = currentTime ? new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: 'Asia/Jakarta'
    }).format(currentTime) : "Loading..."

    const formattedTime = currentTime ? new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Asia/Jakarta'
    }).format(currentTime) : ""

    return (
        <div className="space-y-8">
            <Card className="border-none shadow-md bg-white overflow-hidden">
                <CardContent className="">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                            <Clock className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Jakarta Time</p>
                            <div className="flex flex-col">
                                <span className="text-lg font-bold text-[#303030]">{formattedDate}</span>
                                <span className="text-sm font-semibold text-blue-600">{formattedTime}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-600">Attendance</span>
                            <span className="text-sm font-bold text-blue-600">92%</span>
                        </div>
                        <Progress value={92} className="h-2.5 bg-blue-50" indicatorClassName="bg-blue-600" />
                    </div>

                    <div className="text-sm text-blue-600 font-medium hover:text-blue-700 cursor-pointer flex items-center gap-1 transition-colors">
                        See Attendance Details &rarr;
                    </div>
                </CardContent>
            </Card>

            <Card className="border-none shadow-md bg-white overflow-hidden">
                <CardContent className="p-6">
                    <RecentActivity />
                </CardContent>
            </Card>
        </div>
    )
}
