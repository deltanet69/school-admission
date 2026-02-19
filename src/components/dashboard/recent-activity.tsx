"use client"

import { getRecentActivities, ActivityItem } from "@/app/actions/activity"
import { useEffect, useState } from "react"
import { UserPlus, CheckCircle, XCircle, CreditCard, FileText, Loader2, ArrowRight, GraduationCap, User } from "lucide-react"
import Link from "next/link"

export function RecentActivity() {
    const [activities, setActivities] = useState<ActivityItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const data = await getRecentActivities()
                setActivities(data)
            } catch (error) {
                console.error("Failed to load activities", error)
            } finally {
                setLoading(false)
            }
        }

        fetchActivities()

        // Poll every 30 seconds for specific real-time feel
        const interval = setInterval(fetchActivities, 30000)
        return () => clearInterval(interval)
    }, [])

    const getIcon = (type: string) => {
        switch (type) {
            case 'registration': return <UserPlus className="h-4 w-4 text-blue-500" />
            case 'approval': return <CheckCircle className="h-4 w-4 text-emerald-500" />
            case 'rejection': return <XCircle className="h-4 w-4 text-red-500" />
            case 'payment': return <CreditCard className="h-4 w-4 text-amber-500" />
            case 'teacher_added': return <GraduationCap className="h-4 w-4 text-purple-500" />
            case 'student_added': return <User className="h-4 w-4 text-indigo-500" />
            default: return <FileText className="h-4 w-4 text-gray-500" />
        }
    }

    const getBgColor = (type: string) => {
        switch (type) {
            case 'registration': return 'bg-blue-50'
            case 'approval': return 'bg-emerald-50'
            case 'rejection': return 'bg-red-50'
            case 'payment': return 'bg-amber-50'
            case 'teacher_added': return 'bg-purple-50'
            case 'student_added': return 'bg-indigo-50'
            default: return 'bg-gray-50'
        }
    }

    const getLink = (activity: ActivityItem) => {
        // Fallback to dashboard if no entityId (though logic ensures there should be one)
        if (!activity.entityId) return '/dashboard'

        switch (activity.type) {
            case 'teacher_added': return `/dashboard/teachers/${activity.entityId}`
            case 'student_added': return `/dashboard/students/${activity.entityId}`
            default: return `/dashboard/admission/${activity.entityId}`
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-[#303030] flex items-center gap-2">
                    Recent Activity
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                </h3>
            </div>

            <div className="space-y-3 relative min-h-[200px] max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                    </div>
                ) : activities.length > 0 ? (
                    activities.map((activity) => (
                        <Link
                            key={activity.id}
                            href={getLink(activity)}
                            className="flex gap-3 items-start group p-2 -mx-2 rounded-lg hover:bg-gray-50 transition-colors block cursor-pointer"
                        >
                            <div className={`mt-0.5 min-w-[32px] h-8 rounded-full flex items-center justify-center ${getBgColor(activity.type)}`}>
                                {getIcon(activity.type)}
                            </div>
                            <div className="space-y-0.5 flex-1">
                                <p className="text-sm font-medium text-[#303030] leading-tight group-hover:text-blue-600 transition-colors">
                                    {activity.title}
                                </p>
                                <p className="text-xs text-muted-foreground line-clamp-1">
                                    {activity.description}
                                </p>
                                <p className="text-[10px] text-gray-400 pt-1">
                                    {activity.time}
                                </p>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
                )}
            </div>

            <Link
                href="/dashboard/activities"
                className="inline-flex w-full items-center justify-center gap-2 py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors"
            >
                View All Activities <ArrowRight className="h-3 w-3" />
            </Link>
        </div>
    )
}
