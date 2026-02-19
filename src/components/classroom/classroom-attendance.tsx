"use client"

import { useState, useEffect, useCallback } from "react"
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns"
import { Calendar as CalendarIcon, Save, Download, FileText, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/lib/supabaseClient"
import { toast } from "sonner"

interface Student {
    id: string
    name: string
    nis: string
}

interface AttendanceRecord {
    id?: string
    student_id: string
    date: string
    status: 'present' | 'absent' | 'late' | 'permission' | 'unrecorded' | ''
    check_in_time: string | null
    check_out_time: string | null
    remarks: string | null
}

export function ClassroomAttendance({ classroomId, students }: { classroomId: string, students: Student[] }) {
    const [date, setDate] = useState<Date>(new Date())
    const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('daily')

    // Data States
    const [dailyData, setDailyData] = useState<Record<string, AttendanceRecord>>({})
    const [periodData, setPeriodData] = useState<AttendanceRecord[]>([])

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [filterStatus, setFilterStatus] = useState("all")

    // Fetch Attendance based on View Mode
    const fetchAttendance = useCallback(async () => {
        if (!date) return
        setLoading(true)

        let query = supabase
            .from('attendance')
            .select('*')
            .eq('classroom_id', classroomId)

        if (viewMode === 'daily') {
            const dateString = format(date, 'yyyy-MM-dd')
            query = query.eq('date', dateString)
        } else if (viewMode === 'weekly') {
            const start = format(startOfWeek(date, { weekStartsOn: 1 }), 'yyyy-MM-dd')
            const end = format(endOfWeek(date, { weekStartsOn: 1 }), 'yyyy-MM-dd')
            query = query.gte('date', start).lte('date', end)
        } else if (viewMode === 'monthly') {
            const start = format(startOfMonth(date), 'yyyy-MM-dd')
            const end = format(endOfMonth(date), 'yyyy-MM-dd')
            query = query.gte('date', start).lte('date', end)
        }

        const { data, error } = await query

        if (error) {
            console.error("Error fetching attendance:", error)
            toast.error("Failed to fetch attendance data")
        } else {
            if (viewMode === 'daily') {
                const recordMap: Record<string, AttendanceRecord> = {}
                if (data) {
                    data.forEach((record: any) => {
                        recordMap[record.student_id] = record
                    })
                }
                setDailyData(recordMap)
            } else {
                setPeriodData(data || [])
            }
        }
        setLoading(false)
    }, [classroomId, date, viewMode])

    useEffect(() => {
        fetchAttendance()
    }, [fetchAttendance])

    // Calculate Summary Stats (Daily)
    const totalStudents = students.length
    const presentCount = Object.values(dailyData).filter(r => r.status === 'present').length

    // Handle input changes
    const updateRecord = (studentId: string, field: keyof AttendanceRecord, value: any) => {
        setDailyData(prev => {
            const current = prev[studentId] || {
                student_id: studentId,
                date: format(date, 'yyyy-MM-dd'),
                status: 'unrecorded',
                check_in_time: null,
                check_out_time: null,
                remarks: ''
            }

            let updatedRecord = { ...current, [field]: value }

            // Auto-Logic: Set Present -> Auto Check-in Time
            if (field === 'status' && value === 'present' && !current.check_in_time) {
                updatedRecord.check_in_time = format(new Date(), 'HH:mm')
            }

            // Auto-Logic: Set Check-in Time -> Auto Present
            if (field === 'check_in_time' && value && (current.status === 'unrecorded' || !current.status)) {
                updatedRecord.status = 'present'
            }

            return {
                ...prev,
                [studentId]: updatedRecord
            }
        })
    }

    // Bulk Save
    const handleSave = async () => {
        setSaving(true)
        const recordsToUpsert = Object.values(dailyData).map(record => ({
            ...record,
            classroom_id: classroomId,
            date: format(date, 'yyyy-MM-dd'),
            recorded_by: 'Teacher (System)'
        }))

        const { error } = await supabase
            .from('attendance')
            .upsert(recordsToUpsert, { onConflict: 'student_id, date' })

        if (error) {
            toast.error("Failed to save attendance: " + error.message)
        } else {
            toast.success("Attendance saved successfully")
            fetchAttendance()
        }
        setSaving(false)
    }

    // CSV Export
    const handleExportCSV = () => {
        const headers = ["Date", "Student Name", "NIS", "Status", "Check In", "Check Out", "Notes"]
        const rows = students.map(student => {
            const record = dailyData[student.id]
            return [
                format(date, 'yyyy-MM-dd'),
                student.name,
                student.nis,
                record?.status || "Unrecorded",
                record?.check_in_time || "-",
                record?.check_out_time || "-",
                record?.remarks || "-"
            ]
        })

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n")

        const encodedUri = encodeURI(csvContent)
        const link = document.createElement("a")
        link.setAttribute("href", encodedUri)
        link.setAttribute("download", `attendance_${format(date, 'yyyy-MM-dd')}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterStatus === 'all' || (dailyData[student.id]?.status || 'unrecorded') === filterStatus)
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-2">
                    <Select value={viewMode} onValueChange={(val: any) => setViewMode(val)}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="View" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                    </Select>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant={"outline"} className={cn("w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground")}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} initialFocus />
                        </PopoverContent>
                    </Popover>
                    {viewMode === 'daily' && (
                        <Button onClick={handleSave} disabled={saving}>
                            {saving ? "Saving..." : <><Save className="mr-2 h-4 w-4" /> Save Attendance</>}
                        </Button>
                    )}
                </div>
                <div className="flex gap-2">
                    {viewMode === 'daily' && (
                        <Button variant="outline" onClick={handleExportCSV}>
                            <FileText className="mr-2 h-4 w-4" /> Export CSV
                        </Button>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search student..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                    />
                </div>
                {viewMode === 'daily' && (
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-[150px]">
                            <Filter className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="Filter Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="present">Present</SelectItem>
                            <SelectItem value="late">Late</SelectItem>
                            <SelectItem value="absent">Absent</SelectItem>
                            <SelectItem value="permission">Permission</SelectItem>
                            <SelectItem value="unrecorded">Unrecorded</SelectItem>
                        </SelectContent>
                    </Select>
                )}
            </div>

            {viewMode === 'daily' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Daily Attendance</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Total Siswa {totalStudents} | Siswa Hadir {presentCount}
                        </p>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[200px]">Student</TableHead>
                                        <TableHead className="min-w-[120px]">Check In</TableHead>
                                        <TableHead className="min-w-[120px]">Check Out</TableHead>
                                        <TableHead className="w-[140px]">Status</TableHead>
                                        <TableHead className="min-w-[200px]">Notes</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center h-24">Loading student data...</TableCell>
                                        </TableRow>
                                    ) : filteredStudents.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center h-24">No students found</TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredStudents.map((student) => {
                                            const record = dailyData[student.id] || {}
                                            const currentStatus = record.status || 'unrecorded'

                                            return (
                                                <TableRow key={student.id}>
                                                    <TableCell>
                                                        <div className="font-medium">{student.name}</div>
                                                        <div className="text-xs text-muted-foreground">{student.nis}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Input
                                                            type="time"
                                                            value={record.check_in_time || ""}
                                                            onChange={(e) => updateRecord(student.id, 'check_in_time', e.target.value)}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Input
                                                            type="time"
                                                            value={record.check_out_time || ""}
                                                            onChange={(e) => updateRecord(student.id, 'check_out_time', e.target.value)}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Select
                                                            value={currentStatus}
                                                            onValueChange={(val) => updateRecord(student.id, 'status', val)}
                                                        >
                                                            <SelectTrigger className={cn(
                                                                "w-full",
                                                                currentStatus === 'absent' && "text-red-600 bg-red-50 border-red-200",
                                                                currentStatus === 'late' && "text-orange-600 bg-orange-50 border-orange-200",
                                                                currentStatus === 'permission' && "text-blue-600 bg-blue-50 border-blue-200",
                                                                currentStatus === 'present' && "text-green-600 bg-green-50 border-green-200",
                                                                currentStatus === 'unrecorded' && "text-muted-foreground bg-gray-50 border-gray-200"
                                                            )}>
                                                                <SelectValue placeholder="-" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="unrecorded" className="text-muted-foreground">- (Unrecorded)</SelectItem>
                                                                <SelectItem value="present" className="text-green-600">Present</SelectItem>
                                                                <SelectItem value="late" className="text-orange-600">Late</SelectItem>
                                                                <SelectItem value="permission" className="text-blue-600">Permission</SelectItem>
                                                                <SelectItem value="absent" className="text-red-600">Absent</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Input
                                                            placeholder="Add notes..."
                                                            value={record.remarks || ""}
                                                            onChange={(e) => updateRecord(student.id, 'remarks', e.target.value)}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            )}

            {viewMode === 'weekly' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Weekly Attendance</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            {format(startOfWeek(date, { weekStartsOn: 1 }), 'MMM d')} - {format(endOfWeek(date, { weekStartsOn: 1 }), 'MMM d, yyyy')}
                        </p>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[200px]">Student</TableHead>
                                        {eachDayOfInterval({
                                            start: startOfWeek(date, { weekStartsOn: 1 }),
                                            end: endOfWeek(date, { weekStartsOn: 1 })
                                        }).map((day, i) => ( // Use 'day' but limit to 5 days (Mon-Fri) usually, but interval gives 7.
                                            // Let's hide Sat/Sun if empty or just show 5 days if valid.
                                            // Or just show Mon-Fri
                                            i < 5 && (
                                                <TableHead key={i} className="text-center min-w-[50px]">{format(day, 'EEE dd')}</TableHead>
                                            )
                                        ))}
                                        <TableHead className="text-right">Total Present</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {students.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())).map(student => {
                                        const studentRecords = periodData.filter(r => r.student_id === student.id)
                                        const weeklyPresent = studentRecords.filter(r => r.status === 'present').length

                                        return (
                                            <TableRow key={student.id}>
                                                <TableCell className="font-medium">
                                                    <div>{student.name}</div>
                                                    <div className="text-xs text-muted-foreground">{student.nis}</div>
                                                </TableCell>
                                                {eachDayOfInterval({
                                                    start: startOfWeek(date, { weekStartsOn: 1 }),
                                                    end: endOfWeek(date, { weekStartsOn: 1 })
                                                }).map((day, i) => (
                                                    i < 5 && (
                                                        <TableCell key={i} className="text-center p-2">
                                                            {(() => {
                                                                const dayStr = format(day, 'yyyy-MM-dd')
                                                                const record = studentRecords.find(r => r.date === dayStr)
                                                                if (!record?.status || record.status === 'unrecorded') return <span className="text-muted-foreground">-</span>
                                                                if (record.status === 'present') return <div className="mx-auto w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs">P</div>
                                                                if (record.status === 'late') return <div className="mx-auto w-6 h-6 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xs">L</div>
                                                                if (record.status === 'absent') return <div className="mx-auto w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-xs">A</div>
                                                                if (record.status === 'permission') return <div className="mx-auto w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs">I</div>
                                                                return null
                                                            })()}
                                                        </TableCell>
                                                    )
                                                ))}
                                                <TableCell className="text-right font-bold">{weeklyPresent}</TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            )}

            {viewMode === 'monthly' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Monthly Attendance Summary</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            {format(date, 'MMMM yyyy')}
                        </p>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[300px]">Student</TableHead>
                                        <TableHead className="text-center">Present</TableHead>
                                        <TableHead className="text-center">Late</TableHead>
                                        <TableHead className="text-center">Permission</TableHead>
                                        <TableHead className="text-center">Absent</TableHead>
                                        <TableHead className="text-right">Attendance %</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {students.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())).map(student => {
                                        const studentRecords = periodData.filter(r => r.student_id === student.id)
                                        const present = studentRecords.filter(r => r.status === 'present').length
                                        const late = studentRecords.filter(r => r.status === 'late').length
                                        const permission = studentRecords.filter(r => r.status === 'permission').length
                                        const absent = studentRecords.filter(r => r.status === 'absent').length

                                        // Effective Working Days (simplification: count of records or business days in month?)
                                        // For now, let's use count of days passed in month excluding weekends, OR just count of recorded days?
                                        // Let's use 20 days as standard denominator or just count of records if dynamic? 
                                        // Better: Count of days having AT LEAST ONE record for ANY student in this class? 
                                        // Or just sum of statuses.
                                        const totalRecorded = present + late + permission + absent
                                        const percentage = totalRecorded > 0 ? Math.round(((present + late) / totalRecorded) * 100) : 0

                                        return (
                                            <TableRow key={student.id}>
                                                <TableCell className="font-medium">
                                                    <div>{student.name}</div>
                                                    <div className="text-xs text-muted-foreground">{student.nis}</div>
                                                </TableCell>
                                                <TableCell className="text-center font-medium text-green-600">{present}</TableCell>
                                                <TableCell className="text-center font-medium text-orange-600">{late}</TableCell>
                                                <TableCell className="text-center font-medium text-blue-600">{permission}</TableCell>
                                                <TableCell className="text-center font-medium text-red-600">{absent}</TableCell>
                                                <TableCell className="text-right">
                                                    <Badge variant={percentage > 80 ? 'default' : percentage > 50 ? 'secondary' : 'destructive'}>
                                                        {percentage}%
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
