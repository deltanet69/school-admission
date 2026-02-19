"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Pencil, Trash2, Shield, UserCog, Mail } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { AdminModal } from "./admin-modal"
import { useState } from "react"
import { deleteAdmin } from "@/app/actions/admin"
import { toast } from "sonner"

// Define the Admin type matching the DB structure roughly
export type Admin = {
    id: string
    name: string
    email: string
    role: "Super Admin" | "Admin" | "Staff"
    status: "Active" | "Inactive"
    created_at: string
}

export const columns: ColumnDef<Admin>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            return (
                <div className="flex items-center gap-2 pl-4">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <UserCog className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="font-medium text-gray-900">{row.getValue("name")}</span>
                </div>
            )
        }
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => {
            return (
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    {row.getValue("email")}
                </div>
            )
        }
    },
    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => {
            const role = row.getValue("role") as string
            return (
                <div className="flex items-center gap-2">
                    <Shield className="h-3 w-3 text-purple-500" />
                    <span>{role}</span>
                </div>
            )
        }
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            return (
                <Badge
                    variant={status === 'Active' ? 'default' : 'secondary'}
                    className={status === 'Active' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 shadow-none' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-none'}
                >
                    {status}
                </Badge>
            )
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const admin = row.original
            const [showEditModal, setShowEditModal] = useState(false)

            const handleDelete = async () => {
                if (confirm("Are you sure you want to delete this administrator?")) {
                    const res = await deleteAdmin(admin.id)
                    if (res.error) {
                        toast.error(res.error)
                    } else {
                        toast.success("Administrator deleted")
                    }
                }
            }

            return (
                <div className="flex items-center justify-end gap-2 pr-4">
                    <AdminModal
                        admin={admin}
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
                        onClick={handleDelete}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            )
        },
    },
]
