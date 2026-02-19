import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Info, Users, Calendar, ClipboardCheck, Bell } from "lucide-react"
import Link from "next/link"
import { ClassroomInfo } from "@/components/classroom/classroom-info"
import { ClassroomStudents } from "@/components/classroom/classroom-students"
import { ClassroomSchedule } from "@/components/classroom/classroom-schedule"
import { ClassroomAttendance } from "@/components/classroom/classroom-attendance"

import { supabase } from "@/lib/supabaseClient"
import { Classroom } from "@/types"
import { notFound } from "next/navigation"

export const revalidate = 0

async function getClassroom(slugOrId: string): Promise<Classroom | null> {
    // Try by slug first
    let { data, error } = await supabase
        .from('classrooms')
        .select(`
            *,
            teachers (
                name
            )
        `)
        .eq('slug', slugOrId)
        .single()

    // Fallback to ID
    if (!data) {
        const { data: byId } = await supabase
            .from('classrooms')
            .select(`
                *,
                teachers (
                    name
                )
            `)
            .eq('id', slugOrId)
            .single()
        data = byId
    }

    if (!data) {
        return null
    }

    return data as Classroom
}

export default async function ClassroomDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const classroom = await getClassroom(slug)

    if (!classroom) {
        notFound()
    }

    // Fetch students in this grade
    const { data: students } = await supabase
        .from('students')
        .select('*')
        .eq('grade', classroom.name)
        .order('name')

    const studentList = students || []

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center space-x-4">
                <Link href="/dashboard/classroom">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h2 className="text-3xl font-bold tracking-tight">{classroom.name}</h2>
            </div>

            <Tabs defaultValue="info" className="space-y-6">
                <TabsList className="h-auto w-full justify-start gap-6 bg-transparent p-0 overflow-x-auto select-none">
                    <TabsTrigger
                        value="info"
                        className="relative h-auto w-auto flex-none rounded-none border-0 bg-transparent p-0 font-medium text-muted-foreground text-base shadow-none transition-colors data-[state=active]:!bg-transparent data-[state=active]:!shadow-none data-[state=active]:text-blue-700 data-[state=active]:font-bold hover:text-blue-700"
                    >
                        Info
                    </TabsTrigger>
                    <TabsTrigger
                        value="students"
                        className="relative h-auto w-auto flex-none rounded-none border-0 bg-transparent p-0 font-medium text-muted-foreground text-base shadow-none transition-colors data-[state=active]:!bg-transparent data-[state=active]:!shadow-none data-[state=active]:text-blue-700 data-[state=active]:font-bold hover:text-blue-700"
                    >
                        Students
                    </TabsTrigger>
                    <TabsTrigger
                        value="schedule"
                        className="relative h-auto w-auto flex-none rounded-none border-0 bg-transparent p-0 font-medium text-muted-foreground text-base shadow-none transition-colors data-[state=active]:!bg-transparent data-[state=active]:!shadow-none data-[state=active]:text-blue-700 data-[state=active]:font-bold hover:text-blue-700"
                    >
                        Schedule
                    </TabsTrigger>
                    <TabsTrigger
                        value="attendance"
                        className="relative h-auto w-auto flex-none rounded-none border-0 bg-transparent p-0 font-medium text-muted-foreground text-base shadow-none transition-colors data-[state=active]:!bg-transparent data-[state=active]:!shadow-none data-[state=active]:text-blue-700 data-[state=active]:font-bold hover:text-blue-700"
                    >
                        Attendance
                    </TabsTrigger>
                    <TabsTrigger
                        value="announcements"
                        className="relative h-auto w-auto flex-none rounded-none border-0 bg-transparent p-0 font-medium text-muted-foreground text-base shadow-none transition-colors data-[state=active]:!bg-transparent data-[state=active]:!shadow-none data-[state=active]:text-blue-700 data-[state=active]:font-bold hover:text-blue-700"
                    >
                        Announcements
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="info" className="space-y-4 pt-4">
                    <ClassroomInfo classroom={classroom} studentCount={studentList.length} />
                </TabsContent>
                <TabsContent value="students" className="space-y-4">
                    <ClassroomStudents
                        students={studentList}
                        classroomId={classroom.id}
                        classroomSlug={classroom.slug || classroom.id}
                    />
                </TabsContent>
                <TabsContent value="schedule" className="space-y-4">
                    <ClassroomSchedule classroomId={classroom.id} />
                </TabsContent>
                <TabsContent value="attendance" className="py-4">
                    <ClassroomAttendance classroomId={classroom.id} students={studentList} />
                </TabsContent>
                <TabsContent value="announcements" className="py-4">
                    <div className="text-sm text-muted-foreground">Announcements and events content goes here.</div>
                </TabsContent>
            </Tabs>
        </div >
    )
}
