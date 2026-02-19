
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Admission } from "@/types"
import { MoreHorizontal, ArrowUpDown, Eye, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export const columns: ColumnDef<Admission>[] = [
    {
        accessorKey: "applicant_name",
        header: ({ column }) => {
            return (
                <Button className="grid grid-cols-2 font-bold uppercase ml-5"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Applicant
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const name = row.getValue("applicant_name") as string
            const initials = name
                ? name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
                : '??'

            return (
                <div className="flex items-center gap-3 px-6">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center border shrink-0">
                        <span className="font-semibold text-sm text-muted-foreground">{initials}</span>
                    </div>
                    <div className="flex flex-col">
                        <Link href={`/dashboard/admission/${row.original.id}`} className="hover:underline font-semibold text-gray-900">
                            {name}
                        </Link>
                    </div>
                </div>
            )
        }
    },
    {
        accessorKey: "program_selection",
        header: "Program",
        cell: ({ row }) => {
            const program = row.getValue("program_selection") as string
            return <div className="text-sm text-muted-foreground">{program || "-"}</div>
        }
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string

            let badgeClass = "bg-gray-100 text-gray-800"
            if (status === 'approved') badgeClass = "bg-green-100 text-green-700 hover:bg-green-200"
            if (status === 'pending') badgeClass = "bg-orange-100 text-orange-700 hover:bg-orange-200"
            if (status === 'rejected') badgeClass = "bg-red-100 text-red-700 hover:bg-red-200"

            return (
                <Badge
                    variant="secondary"
                    className={`capitalize ${badgeClass}`}
                >
                    {status}
                </Badge>
            )
        }
    },
    {
        accessorKey: "submission_date",
        header: "Date",
        cell: ({ row }) => {
            return <div className="text-sm text-muted-foreground">
                {new Date(row.getValue("submission_date")).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                })}
            </div>
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const admission = row.original

            return (
                <div className="flex items-center justify-end gap-2 px-6">
                    <Link href={`/dashboard/admission/${admission.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                            <Eye className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            )
        },
    },
]
