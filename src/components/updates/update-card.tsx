'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Calendar, User, Trash2, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { Update } from "@/types"
import { Button } from "@/components/ui/button"
import { deleteUpdate } from "@/app/actions/updates"
import { useState } from "react"
import { toast } from "sonner"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface UpdateCardProps {
    update: Update
}

export function UpdateCard({ update }: UpdateCardProps) {
    const [isDeleting, setIsDeleting] = useState(false)

    async function handleDelete() {
        setIsDeleting(true)
        const result = await deleteUpdate(update.id)
        setIsDeleting(false)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success("Update deleted")
        }
    }

    return (
        <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <CardTitle className="text-lg line-clamp-1" title={update.title}>{update.title}</CardTitle>
                        <CardDescription className="flex items-center mt-1">
                            <Calendar className="mr-1 h-3 w-3" />
                            {update.created_at ? format(new Date(update.created_at), 'MMM dd, yyyy') : 'N/A'}
                        </CardDescription>
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full 
                        ${update.category === 'Urgent' ? 'bg-red-100 text-red-800' :
                            update.category === 'Event' ? 'bg-purple-100 text-purple-800' :
                                'bg-primary/10 text-primary'}`}>
                        {update.category || 'General'}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-4">
                    {update.content}
                </p>
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground flex items-center justify-between border-t pt-4 mt-auto">
                <div className="flex items-center">
                    <User className="mr-1 h-3 w-3" /> Posted by {update.author_id ? 'Admin' : 'System'}
                </div>

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-red-500">
                            {isDeleting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete Update?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the update.
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
            </CardFooter>
        </Card>
    )
}
