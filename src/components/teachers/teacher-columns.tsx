
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Teacher } from "@/types"
import { MoreHorizontal, ArrowUpDown, Eye, Pencil, Trash2 } from "lucide-react"
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
import { TeacherModal } from "./teacher-modal"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"

export const columns: ColumnDef<Teacher>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button className="grid grid-cols-2 font-bold uppercase ml-5"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    User
                    <ArrowUpDown className="ml-0 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const photoUrl = row.original.profile_picture
            const name = row.original.name
            const email = row.original.email

            return (
                <div className="flex items-center gap-4 py-1 px-6">
                    <div className="h-10 w-10 rounded-full overflow-hidden bg-muted flex items-center justify-center border shrink-0">
                        {photoUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={photoUrl} alt={name} className="h-full w-full object-cover" />
                        ) : (
                            <span className="text-xs text-muted-foreground">No Img</span>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <Link href={`/dashboard/teachers/${row.original.slug || row.original.id}`} className="hover:underline font-semibold text-gray-900">
                            {name}
                        </Link>
                        <span className="text-sm text-muted-foreground">{email || '-'}</span>
                    </div>
                </div>
            )
        },
    },
    {
        accessorKey: "subject_specialty",
        header: "Subject",
    },
    {
        accessorKey: "position",
        header: "Position",
    },
    {
        accessorKey: "last_education",
        header: "Education",
    },
    {
        accessorKey: "nip",
        header: "NIP",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            return (
                <Badge
                    variant={status === 'active' ? 'default' : 'secondary'}
                    className={`capitalize ${status === 'active' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                >
                    {status}
                </Badge>
            )
        }
    },
    {
        id: "actions",
        cell: ({ row }) => <TeacherActions teacher={row.original} />,
    },
]

function TeacherActions({ teacher }: { teacher: Teacher }) {
    const [showDeleteAlert, setShowDeleteAlert] = useState(false)
    const router = useRouter()

    const handleDelete = async () => {
        try {
            const { error } = await supabase.from('teachers').delete().eq('id', teacher.id)
            if (error) throw error
            router.refresh()
        } catch (error: any) {
            alert(`Error deleting teacher: ${error.message}`)
        }
    }

    return (
        <>
            <div className="flex items-center justify-end gap-2 px-6">
                <Link href={`/dashboard/teachers/${teacher.slug || teacher.id}`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                        <Eye className="h-4 w-4" />
                    </Button>
                </Link>

                <div onSelect={(e) => e.preventDefault()}>
                    <TeacherModal
                        teacher={teacher}
                        trigger={
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50">
                                <Pencil className="h-4 w-4" />
                            </Button>
                        }
                    />
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => setShowDeleteAlert(true)}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>

            <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete
                            <span className="font-bold"> {teacher.name}</span> and remove their data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
