"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Phone, Mail, User } from "lucide-react"

// Parent type derived from student data for display
export type Parent = {
    id: string // using student_id for uniqueness/key
    parent_name: string
    parent_email?: string
    parent_phone?: string
    student_name: string
    student_grade: string
}

export const columns: ColumnDef<Parent>[] = [
    {
        accessorKey: "parent_name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Parent Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            return (
                <div className="flex items-center gap-2 pl-4">
                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <User className="h-4 w-4 text-indigo-600" />
                    </div>
                    <span className="font-medium text-gray-900">{row.getValue("parent_name") || "N/A"}</span>
                </div>
            )
        }
    },
    {
        accessorKey: "contact",
        header: "Contact",
        cell: ({ row }) => {
            const phone = row.original.parent_phone
            const email = row.original.parent_email
            return (
                <div className="flex flex-col text-sm text-muted-foreground">
                    {phone && (
                        <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {phone}
                        </div>
                    )}
                    {email && (
                        <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {email}
                        </div>
                    )}
                    {!phone && !email && <span>-</span>}
                </div>
            )
        }
    },
    {
        accessorKey: "student_name",
        header: "Child",
        cell: ({ row }) => {
            return (
                <div className="font-medium">
                    {row.getValue("student_name")}
                </div>
            )
        }
    },
    {
        accessorKey: "student_grade",
        header: "Grade",
        cell: ({ row }) => {
            return (
                <div className="text-muted-foreground">
                    {row.getValue("student_grade")}
                </div>
            )
        }
    },
]
