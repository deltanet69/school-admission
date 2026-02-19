"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/lib/supabaseClient"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface ScheduleModalProps {
    isOpen: boolean
    onClose: () => void
    classroomId: string
    initialData?: any // To be typed properly
    onSuccess: () => void
}

export function ScheduleModal({ isOpen, onClose, classroomId, initialData, onSuccess }: ScheduleModalProps) {
    const [loading, setLoading] = useState(false)
    const [teachers, setTeachers] = useState<any[]>([])

    // Form States
    const [subject, setSubject] = useState("")
    const [teacherId, setTeacherId] = useState("")
    const [day, setDay] = useState("Monday")
    const [startTime, setStartTime] = useState("")
    const [endTime, setEndTime] = useState("")
    const [type, setType] = useState("academic")

    useEffect(() => {
        if (isOpen) {
            fetchTeachers()
            if (initialData) {
                setSubject(initialData.subject)
                setTeacherId(initialData.teacher_id || "no-teacher") // Handle null teacher
                setDay(initialData.day_of_week)
                setStartTime(initialData.start_time)
                setEndTime(initialData.end_time)
                setType(initialData.type || "academic")
            } else {
                resetForm()
            }
        }
    }, [isOpen, initialData])

    const fetchTeachers = async () => {
        const { data } = await supabase.from("teachers").select("id, name").order("name")
        if (data) setTeachers(data)
    }

    const resetForm = () => {
        setSubject("")
        setTeacherId("")
        setDay("Monday")
        setStartTime("")
        setEndTime("")
        setType("academic")
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const payload = {
            classroom_id: classroomId,
            subject,
            teacher_id: teacherId === "no-teacher" ? null : teacherId,
            day_of_week: day,
            start_time: startTime,
            end_time: endTime,
            type,
        }

        let error
        if (initialData?.id) {
            const { error: updateError } = await supabase
                .from("schedules")
                .update(payload)
                .eq("id", initialData.id)
            error = updateError
        } else {
            const { error: insertError } = await supabase
                .from("schedules")
                .insert([payload])
            error = insertError
        }

        setLoading(false)

        if (error) {
            toast.error(error.message)
        } else {
            toast.success(initialData ? "Schedule updated" : "Schedule created")
            onSuccess()
            onClose()
        }
    }

    const handleDelete = async () => {
        if (!initialData?.id) return
        if (!confirm("Are you sure you want to delete this schedule?")) return

        setLoading(true)
        const { error } = await supabase.from("schedules").delete().eq("id", initialData.id)
        setLoading(false)

        if (error) {
            toast.error(error.message)
        } else {
            toast.success("Schedule deleted")
            onSuccess()
            onClose()
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{initialData ? "Edit Schedule" : "Add Schedule"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                            id="subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="e.g. Mathematics"
                            required
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="type">Type</Label>
                        <Select value={type} onValueChange={setType}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="academic">Academic</SelectItem>
                                <SelectItem value="activity">Activity</SelectItem>
                                <SelectItem value="break">Break</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="teacher">Teacher</Label>
                        <Select value={teacherId} onValueChange={setTeacherId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select teacher" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="no-teacher">No Teacher (Self Study/Break)</SelectItem>
                                {teachers.map((t) => (
                                    <SelectItem key={t.id} value={t.id}>
                                        {t.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="day">Day</Label>
                        <Select value={day} onValueChange={setDay}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select day" />
                            </SelectTrigger>
                            <SelectContent>
                                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((d) => (
                                    <SelectItem key={d} value={d}>
                                        {d}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="start">Start Time</Label>
                            <Input
                                id="start"
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="end">End Time</Label>
                            <Input
                                id="end"
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <DialogFooter className="flex justify-between items-center sm:justify-between">
                        {initialData && (
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={handleDelete}
                                disabled={loading}
                            >
                                Delete
                            </Button>
                        )}
                        <div className="flex gap-2">
                            <Button type="button" variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
