"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2, Pencil } from "lucide-react"
import { TeacherModal } from "./teacher-modal"
import { Teacher } from "@/types"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
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

export function TeacherDetailActions({ teacher }: { teacher: Teacher }) {
    const [showDeleteAlert, setShowDeleteAlert] = useState(false)
    const router = useRouter()

    const handleDelete = async () => {
        try {
            const { error } = await supabase.from('teachers').delete().eq('id', teacher.id)
            if (error) throw error
            router.push('/dashboard/teachers')
            router.refresh()
        } catch (error: any) {
            alert(`Error deleting teacher: ${error.message}`)
        }
    }

    return (
        <div className="flex gap-2 w-full">
            <TeacherModal
                teacher={teacher}
                trigger={
                    <Button>
                        <Pencil className="mr-2 h-4 w-4" /> Edit Teacher
                    </Button>
                }
            />

            <Button variant="destructive" onClick={() => setShowDeleteAlert(true)}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete Teacher
            </Button>

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
        </div>
    )
}
