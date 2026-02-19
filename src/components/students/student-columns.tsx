"use client"

import { ColumnDef, Row, Column } from "@tanstack/react-table"
import { Student } from "@/types"
import { MoreHorizontal, ArrowUpDown, User, Eye, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useState } from "react"
import { StudentModal } from "./student-modal"
import { supabase } from "@/lib/supabaseClient"
import { Badge } from "@/components/ui/badge"

/* eslint-disable @next/next/no-img-element */

export const columns: ColumnDef<Student>[] = [
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
            const [imgError, setImgError] = useState(false)

            return (
                <div className="flex items-center gap-3 px-6">
                    <div className="h-10 w-10 rounded-full overflow-hidden border shrink-0">
                        {student.profile_picture && !imgError ? (
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
                        <Link href={`/dashboard/students/${student.slug || student.id}`} className="hover:underline font-semibold text-gray-900">
                            {student.name}
                        </Link>
                        <span className="text-sm text-muted-foreground">{student.nis || '-'}</span>
                    </div>
                </div>
            )
        },
    },
    {
        accessorKey: "grade",
        header: "Class/Grade",
        filterFn: (row: Row<Student>, id: string, value: string[]) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }: { row: Row<Student> }) => {
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
        filterFn: (row: Row<Student>, id: string, value: string[]) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        id: "actions",
        cell: ({ row }: { row: Row<Student> }) => {
            const student = row.original
            const [showEditModal, setShowEditModal] = useState(false)

            return (
                <>
                    <div className="flex items-center justify-end gap-2 px-6">
                        <Link href={`/dashboard/students/${student.slug || student.id}`}>
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
                </>
            )
        },
    },
]
