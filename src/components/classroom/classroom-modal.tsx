
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2, Plus } from "lucide-react"

const classroomSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    grade_level: z.string().min(1, "Grade Level is required"),
    academic_year: z.string().min(1, "Academic Year is required"),
})

type ClassroomFormValues = z.infer<typeof classroomSchema>

export function ClassroomModal() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const form = useForm<ClassroomFormValues>({
        resolver: zodResolver(classroomSchema),
        defaultValues: {
            name: "",
            grade_level: "",
            academic_year: "",
        },
    })

    const onSubmit = async (data: ClassroomFormValues) => {
        setLoading(true)
        try {
            // API call to create classroom
            console.log(data)
            setOpen(false)
            form.reset()
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Classroom
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Classroom</DialogTitle>
                    <DialogDescription>
                        Add a new classroom to the system. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Class Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="10-Science-1" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="grade_level"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Grade Level</FormLabel>
                                    <FormControl>
                                        <Input placeholder="10" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="academic_year"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Academic Year</FormLabel>
                                    <FormControl>
                                        <Input placeholder="2023/2024" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save changes
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
