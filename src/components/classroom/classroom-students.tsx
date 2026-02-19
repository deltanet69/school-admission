"use client"

import { DataTable } from "@/components/ui/data-table"
import { ColumnDef, Row, Column } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, LayoutGrid, List, Search } from "lucide-react"
import { Student } from "@/types"
import React from "react"
import { Input } from "@/components/ui/input"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { User, Eye, Pencil, Trash2 } from "lucide-react"
import { StudentModal } from "@/components/students/student-modal"
import { supabase } from "@/lib/supabaseClient"

// Note: Columns need to be defined *inside* or have access to the openModal function if we want to use the modal there too.
// Or we can just pass the handling logic. For simplicity, we'll redefine columns inside the component or make a factory.

export function ClassroomStudents({ students, classroomId, classroomSlug }: { students: Student[], classroomId: string, classroomSlug?: string }) {
    const [view, setView] = React.useState<'list' | 'card'>('list')
    const [searchTerm, setSearchTerm] = React.useState('')

    // Use slug for returnTo if available, otherwise ID
    const returnIdentifier = classroomSlug || classroomId

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const columns: ColumnDef<Student>[] = [
        {
            accessorKey: "name",
            header: ({ column }) => {
                return (
                    <Button className="grid grid-cols-2 font-bold uppercase ml-5"
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        User
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const student = row.original
                const [imgError, setImgError] = React.useState(false)

                return (
                    <div className="flex items-center gap-3 px-6">
                        <div className="h-10 w-10 rounded-full overflow-hidden border shrink-0">
                            {student.profile_picture && !imgError ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={student.profile_picture}
                                    alt={student.name}
                                    className="h-full w-full object-cover"
                                    onError={() => setImgError(true)}
                                />
                            ) : (
                                <div className="h-full w-full bg-muted flex items-center justify-center">
                                    <User className="h-5 w-5 text-muted-foreground" />
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col">
                            <Link
                                href={`/dashboard/students/${student.slug || student.id}?returnTo=/dashboard/classroom/${returnIdentifier}`}
                                className="hover:underline font-semibold text-gray-900"
                            >
                                {student.name}
                            </Link>
                            <span className="text-sm text-muted-foreground">{student.nis || '-'}</span>
                        </div>
                    </div>
                )
            },
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("status") as string
                const isActive = status === 'active'
                return (
                    <Badge
                        variant="outline"
                        className={`capitalize border-0 px-3 py-1 ${isActive
                            ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                            : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                    >
                        {status}
                    </Badge>
                )
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const student = row.original
                const [showEditModal, setShowEditModal] = React.useState(false)

                return (
                    <div className="flex items-center justify-end gap-2 px-6">
                        <Link href={`/dashboard/students/${student.slug || student.id}?returnTo=/dashboard/classroom/${returnIdentifier}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                <Eye className="h-4 w-4" />
                            </Button>
                        </Link>

                        <StudentModal
                            student={student}
                            open={showEditModal}
                            onOpenChange={setShowEditModal}
                            trigger={
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50">
                                    <Pencil className="h-4 w-4" />
                                </Button>
                            }
                        />

                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={async () => {
                                if (confirm("Are you sure you want to delete this student?")) {
                                    const { error } = await supabase.from("students").delete().eq("id", student.id)
                                    if (error) {
                                        alert("Error deleting student: " + error.message)
                                    } else {
                                        window.location.reload()
                                    }
                                }
                            }}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                )
            },
        },
    ]

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                    />
                </div>
                <div className="flex items-center space-x-2 bg-muted p-1 rounded-lg shrink-0">
                    <Button
                        variant={view === 'list' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setView('list')}
                        className="h-8 w-8 p-0"
                    >
                        <List className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={view === 'card' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setView('card')}
                        className="h-8 w-8 p-0"
                    >
                        <LayoutGrid className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {view === 'list' ? (
                <DataTable columns={columns} data={filteredStudents} />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredStudents.map((student) => (
                        <div key={student.id}
                            className="bg-white rounded-xl border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group"
                        >
                            <div className="p-6 flex flex-col items-center text-center space-y-4">
                                <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-muted group-hover:border-primary/20 transition-colors">
                                    {student.profile_picture ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={student.profile_picture}
                                            alt={student.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-400">
                                            No Img
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <Link
                                        href={`/dashboard/students/${student.slug || student.id}?returnTo=/dashboard/classroom/${returnIdentifier}`}
                                        className="font-semibold text-lg text-gray-900 group-hover:text-primary transition-colors line-clamp-1 group-hover:underline"
                                    >
                                        {student.name}
                                    </Link>
                                    <p className="text-sm text-muted-foreground">{student.nis}</p>
                                </div>
                                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                    ${student.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {student.status}
                                </div>
                            </div>
                            <div className="border-t bg-gray-50/50 p-3 flex justify-between items-center text-xs text-muted-foreground px-6">
                                <span>Grade: {student.grade}</span>
                            </div>
                        </div>
                    ))}
                    {filteredStudents.length === 0 && (
                        <div className="col-span-full text-center py-12 text-muted-foreground">
                            No students found.
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
