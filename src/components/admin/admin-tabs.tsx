"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminListView } from "./admin-list-view"
import { ParentListView } from "./parent-list-view"
import { TeacherListView } from "@/components/teachers/teacher-list-view"
import { StudentListView } from "@/components/students/student-list-view"
import { Admin } from "./admin-columns"
import { Parent } from "./parent-columns"
import { Teacher, Student } from "@/types"

interface AdminTabsProps {
    admins: Admin[]
    teachers: Teacher[]
    students: Student[]
    parents: Parent[]
}

export function AdminTabs({ admins, teachers, students, parents }: AdminTabsProps) {
    return (
        <Tabs defaultValue="admins" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4 lg:w-[600px] h-12 p-1 bg-muted/50 rounded-xl">
                <TabsTrigger value="admins" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    Administrators
                </TabsTrigger>
                <TabsTrigger value="teachers" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    Teachers
                </TabsTrigger>
                <TabsTrigger value="students" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    Students
                </TabsTrigger>
                <TabsTrigger value="parents" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    Parents
                </TabsTrigger>
            </TabsList>

            <TabsContent value="admins" className="outline-none">
                <div className="mt-4">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold">System Administrators</h3>
                        <p className="text-sm text-muted-foreground">Manage access for admins and staff.</p>
                    </div>
                    <AdminListView data={admins} />
                </div>
            </TabsContent>

            <TabsContent value="teachers" className="outline-none">
                <div className="mt-4">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold">Teacher Directory</h3>
                        <p className="text-sm text-muted-foreground">View all registered teachers.</p>
                    </div>
                    <TeacherListView data={teachers} />
                </div>
            </TabsContent>

            <TabsContent value="students" className="outline-none">
                <div className="mt-4">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold">Student Directory</h3>
                        <p className="text-sm text-muted-foreground">View all enrolled students.</p>
                    </div>
                    <StudentListView data={students} />
                </div>
            </TabsContent>

            <TabsContent value="parents" className="outline-none">
                <div className="mt-4">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold">Parents & Guardians</h3>
                        <p className="text-sm text-muted-foreground">List of parents derived from student records.</p>
                    </div>
                    <ParentListView data={parents} />
                </div>
            </TabsContent>
        </Tabs>
    )
}
