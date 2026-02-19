"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getRecentActivities, ActivityItem } from "@/app/actions/activity"
import { useEffect, useState, useTransition } from "react"
import { UserPlus, CheckCircle, XCircle, CreditCard, FileText, Loader2, Search, CalendarIcon, GraduationCap, User } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { DateRange } from "react-day-picker"

export function RecentActivityList() {
    const [activities, setActivities] = useState<ActivityItem[]>([])
    const [isPending, startTransition] = useTransition()
    const [searchQuery, setSearchQuery] = useState("")
    const [date, setDate] = useState<DateRange | undefined>()

    useEffect(() => {
        startTransition(async () => {
            // Note: In a real app, we would pass filters to the server action
            // For now, we fetch recent (20) and filter client side or we need to update server action to accept filters
            // Let's assume we want to fetch MORE for this page. 
            // We might need a new server action getFilteredActivities
            const data = await getRecentActivities()
            setActivities(data)
        })
    }, [])

    // Client-side filtering for demonstration of the "Custom Date" requirement 
    // coupled with the limited data fetch.
    const filteredActivities = activities.filter(activity => {
        const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            activity.description.toLowerCase().includes(searchQuery.toLowerCase())

        // Date filtering logic would go here

        return matchesSearch
    })

    const getIcon = (type: string) => {
        switch (type) {
            case 'registration': return <UserPlus className="h-5 w-5 text-blue-500" />
            case 'approval': return <CheckCircle className="h-5 w-5 text-emerald-500" />
            case 'rejection': return <XCircle className="h-5 w-5 text-red-500" />
            case 'payment': return <CreditCard className="h-5 w-5 text-amber-500" />
            case 'teacher_added': return <GraduationCap className="h-5 w-5 text-purple-500" />
            case 'student_added': return <User className="h-5 w-5 text-indigo-500" />
            default: return <FileText className="h-5 w-5 text-gray-500" />
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
        if (!activity.entityId) return '/dashboard'
        switch (activity.type) {
            case 'teacher_added': return `/dashboard/teachers/${activity.entityId}`
            case 'student_added': return `/dashboard/students/${activity.entityId}`
            default: return `/dashboard/admission/${activity.entityId}`
        }
    }

    return (
        <Card className="border-none shadow-md bg-white">
            <CardHeader className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center border-b border-gray-100 pb-4">

                <div className="flex gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                            placeholder="Search activity..."
                            className="pl-9 bg-gray-50 border-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex bg-gray-100 p-1 rounded-lg">
                    {['Daily', 'Weekly', 'Monthly'].map((p) => (
                        <button
                            key={p}
                            className="px-3 py-1.5 text-xs font-medium rounded-md text-gray-500 hover:text-gray-900 transition-colors"
                        >
                            {p}
                        </button>
                    ))}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"ghost"}
                                size="sm"
                                className={cn(
                                    "px-3 py-1.5 text-xs font-medium rounded-md hover:bg-white hover:shadow-sm transition-all h-auto",
                                    date && "bg-white text-blue-600 shadow-sm"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-3 w-3" />
                                Custom
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                            <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={date?.from}
                                selected={date}
                                onSelect={setDate}
                                numberOfMonths={2}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                {isPending ? (
                    <div className="p-12 flex justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {filteredActivities.length > 0 ? (
                            filteredActivities.map((activity) => (
                                <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors group">
                                    <div className="flex gap-4 items-start">
                                        <div className={`mt-1 min-w-[40px] h-10 rounded-full flex items-center justify-center ${getBgColor(activity.type)}`}>
                                            {getIcon(activity.type)}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex justify-between items-start">
                                                <Link href={getLink(activity)} className="hover:underline">
                                                    <h4 className="font-semibold text-[#303030] group-hover:text-blue-600 transition-colors">
                                                        {activity.title}
                                                    </h4>
                                                </Link>
                                                <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                                                    {activity.time}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                {activity.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-12 text-center text-gray-500">
                                No activities found.
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
