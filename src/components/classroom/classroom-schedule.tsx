"use client"

import { useState, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Clock, User, Plus, Filter, Calendar as CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/lib/supabaseClient"
import { useParams } from "next/navigation"
import { ScheduleModal } from "./schedule-modal"

export function ClassroomSchedule({ classroomId }: { classroomId: string }) {
    // const params = useParams()
    // const classroomId = params.id as string

    const [schedules, setSchedules] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedSchedule, setSelectedSchedule] = useState<any>(null)
    const [filterDay, setFilterDay] = useState<string>("all")

    const fetchSchedules = useCallback(async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from("schedules")
            .select(`
                *,
                teachers ( name )
            `)
            .eq("classroom_id", classroomId)
            .order("start_time")

        if (data) {
            setSchedules(data)
        }
        setLoading(false)
    }, [classroomId])

    useEffect(() => {
        fetchSchedules()
    }, [fetchSchedules])

    const handleAddClick = () => {
        setSelectedSchedule(null)
        setIsModalOpen(true)
    }

    const handleEditClick = (schedule: any) => {
        setSelectedSchedule(schedule)
        setIsModalOpen(true)
    }

    // Helper to generate time slots dynamically based on data or defaults
    const generateTimeSlots = () => {
        const times = new Set<string>()
        schedules.forEach(s => times.add(`${s.start_time.slice(0, 5)} - ${s.end_time.slice(0, 5)}`))
        // Add default slots if empty to maintain structure
        if (times.size === 0) {
            return ["07:30 - 08:30", "08:30 - 09:30", "09:30 - 10:00", "10:00 - 11:30", "11:30 - 12:30", "12:30 - 14:00"]
        }
        return Array.from(times).sort()
    }

    const timeSlots = generateTimeSlots()
    const allDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    const days = filterDay === "all" ? allDays : [filterDay]

    // Helper to find schedule for a specific day and time slot
    const getScheduleForSlot = (day: string, timeSlot: string) => {
        return schedules.find(s => {
            const slotStart = timeSlot.split(" - ")[0]
            const sTime = s.start_time.slice(0, 5)
            return s.day_of_week === day && sTime === slotStart
        })
    }

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'academic': return "bg-blue-100 text-blue-700 border-blue-200"
            case 'activity': return "bg-red-100 text-red-700 border-red-200"
            case 'break': return "bg-gray-100 text-gray-500 border-gray-200"
            default: return "bg-green-100 text-green-700 border-green-200"
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-2">
                    <h3 className="text-lg font-medium">Weekly Class Schedule</h3>
                    <Select value={filterDay} onValueChange={setFilterDay}>
                        <SelectTrigger className="w-[130px] h-8">
                            <Filter className="mr-2 h-3.5 w-3.5" />
                            <SelectValue placeholder="Filter Day" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Days</SelectItem>
                            {allDays.map(day => <SelectItem key={day} value={day}>{day}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center gap-3">
                    <div className="hidden md:flex gap-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Academic</Badge>
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Activity</Badge>
                        <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">Break</Badge>
                    </div>
                    <Button size="sm" onClick={handleAddClick}>
                        <Plus className="mr-2 h-4 w-4" /> Add Schedule
                    </Button>
                </div>
            </div>

            <ScrollArea className="w-full pb-4 border rounded-xl bg-white shadow-sm">
                <div className="min-w-[800px]">
                    {/* Header Row */}
                    <div className="grid grid-cols-[100px_repeat(auto-fit,minmax(150px,1fr))] bg-muted/50 border-b" style={{ gridTemplateColumns: `100px repeat(${days.length}, 1fr)` }}>
                        <div className="p-4 text-center font-semibold text-sm text-muted-foreground border-r">Time</div>
                        {days.map(day => (
                            <div key={day} className="p-4 text-center font-semibold text-sm border-r last:border-r-0">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Schedule Grid */}
                    <div className="divide-y text-sm">
                        {loading ? (
                            <div className="p-8 text-center text-muted-foreground">Loading schedule...</div>
                        ) : timeSlots.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground flex flex-col items-center gap-2">
                                <CalendarIcon className="h-8 w-8 opacity-20" />
                                No schedule data found. Click "Add Schedule" to create one.
                            </div>
                        ) : (
                            timeSlots.map((time, index) => (
                                <div key={time} className="grid border-b last:border-b-0 group hover:bg-muted/5 transition-colors" style={{ gridTemplateColumns: `100px repeat(${days.length}, 1fr)` }}>
                                    {/* Time Column */}
                                    <div className="p-4 flex items-center justify-center text-xs font-medium text-muted-foreground border-r bg-muted/10 group-hover:bg-muted/20">
                                        <Clock className="w-3 h-3 mr-1.5" />
                                        {time}
                                    </div>

                                    {/* Days Columns */}
                                    {days.map((day) => {
                                        const session = getScheduleForSlot(day, time)
                                        if (!session) return <div key={day} className="border-r last:border-r-0 bg-gray-50/30" onClick={() => handleAddClick()} />

                                        return (
                                            <div key={day} className="p-2 border-r last:border-r-0 relative">
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div
                                                                onClick={() => handleEditClick(session)}
                                                                className={`
                                                                    h-full w-full rounded-lg p-3 text-left border cursor-pointer
                                                                    transition-all duration-200 hover:shadow-md hover:scale-[1.02]
                                                                    flex flex-col justify-between gap-1
                                                                    ${getTypeColor(session.type || 'academic')}
                                                                `}>
                                                                <div className="font-semibold text-sm line-clamp-2">{session.subject}</div>
                                                                {session.teachers && session.teachers.name && (
                                                                    <div className="flex items-center text-xs opacity-90">
                                                                        <User className="w-3 h-3 mr-1" />
                                                                        <span className="truncate">{session.teachers.name}</span>
                                                                    </div>
                                                                )}
                                                                {session.type === 'break' && (
                                                                    <div className="text-[10px] uppercase tracking-wider font-bold opacity-60 mt-1">Break</div>
                                                                )}
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent side="top" className="text-xs">
                                                            <p className="font-semibold">{session.subject}</p>
                                                            {session.teachers?.name && <p>Teacher: {session.teachers.name}</p>}
                                                            <p className="text-muted-foreground mt-1">{time}</p>
                                                            <p className="text-xs opacity-50 mt-1">Click to edit</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                        )
                                    })}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </ScrollArea>

            <ScheduleModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                classroomId={classroomId}
                initialData={selectedSchedule}
                onSuccess={fetchSchedules}
            />
        </div>
    )
}
