"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Loader2, Plus, Upload, X } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Student } from "@/types"

const studentSchema = z.object({
    // Student Details
    name: z.string().min(2, "Name must be at least 2 characters"),
    nis: z.string().min(1, "NIS is required"),
    email: z.string().email("Invalid email").optional().or(z.literal("")),
    phone: z.string().optional(),
    gender: z.string().min(1, "Gender is required"),
    place_of_birth: z.string().optional(),
    date_of_birth: z.string().optional(),
    address: z.string().optional(),
    profile_picture: z.string().optional(),

    // Academic Info
    grade: z.string().min(1, "Grade is required"),
    enrollment_year: z.string().optional(),
    status: z.enum(["active", "graduated", "dropped"]),

    // Parent Details
    parent_name: z.string().min(1, "Parent name is required"),
    parent_dob: z.string().optional(),
    parent_email: z.string().email("Invalid email").optional().or(z.literal("")),
    parent_phone: z.string().min(1, "Parent phone is required"),
})

type StudentFormValues = z.infer<typeof studentSchema>

interface StudentModalProps {
    student?: Student
    trigger?: React.ReactNode
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export function StudentModal({ student, trigger, open: controlledOpen, onOpenChange }: StudentModalProps) {
    const [openState, setOpenState] = useState(false)
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const router = useRouter()

    const isControlled = typeof controlledOpen !== "undefined"
    const open = isControlled ? controlledOpen : openState
    const setOpen = isControlled ? onOpenChange : setOpenState

    const form = useForm<StudentFormValues>({
        resolver: zodResolver(studentSchema),
        defaultValues: {
            name: "",
            nis: "",
            email: "",
            phone: "",
            gender: "",
            place_of_birth: "",
            date_of_birth: "",
            address: "",
            profile_picture: "",
            grade: "",
            enrollment_year: new Date().getFullYear().toString(),
            status: "active",
            parent_name: "",
            parent_dob: "",
            parent_email: "",
            parent_phone: "",
        },
    })

    useEffect(() => {
        if (student) {
            form.reset({
                name: student.name,
                nis: student.nis,
                email: student.email || "",
                phone: student.phone || "",
                gender: student.gender || "",
                place_of_birth: student.place_of_birth || "",
                date_of_birth: student.date_of_birth ? new Date(student.date_of_birth).toISOString().split('T')[0] : "",
                address: student.address || "",
                profile_picture: student.profile_picture || "",
                grade: student.grade,
                enrollment_year: student.enrollment_year || "",
                status: student.status,
                parent_name: student.parent_name || "",
                parent_dob: student.parent_dob ? new Date(student.parent_dob).toISOString().split('T')[0] : "",
                parent_email: student.parent_email || "",
                parent_phone: student.parent_phone || "",
            })
        }
    }, [student, form])

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true)
            const file = e.target.files?.[0]
            if (!file) return

            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('student-avatars')
                .upload(filePath, file)

            if (uploadError) {
                throw uploadError
            }

            const { data } = supabase.storage.from('student-avatars').getPublicUrl(filePath)
            form.setValue("profile_picture", data.publicUrl)
        } catch (error: any) {
            console.error("Upload failed catch:", error)
            alert(`Error uploading image! \n\nDetails: ${error.message || JSON.stringify(error)} \n\nHints: \n1. Check if 'student-avatars' bucket exists. \n2. Check if the bucket is PUBLIC. \n3. Check RLS policies.`)
        } finally {
            setUploading(false)
        }
    }

    const onSubmit = async (data: StudentFormValues) => {
        setLoading(true)
        try {
            const payload = {
                name: data.name,
                nis: data.nis,
                email: data.email,
                phone: data.phone,
                gender: data.gender,
                place_of_birth: data.place_of_birth,
                date_of_birth: data.date_of_birth || null,
                address: data.address,
                profile_picture: data.profile_picture,
                grade: data.grade,
                enrollment_year: data.enrollment_year,
                status: data.status,
                parent_name: data.parent_name,
                parent_dob: data.parent_dob || null,
                parent_email: data.parent_email,
                parent_phone: data.parent_phone,
            }

            if (student?.id) {
                // Update
                const { error } = await supabase
                    .from('students')
                    .update(payload)
                    .eq('id', student.id)

                if (error) throw error
            } else {
                // Insert
                const { error } = await supabase
                    .from('students')
                    .insert(payload)

                if (error) throw error
            }

            setOpen?.(false)
            if (!student) form.reset() // only reset if adding new
            router.refresh()
        } catch (error: any) {
            console.error('Error saving student:', error.message)
            alert(`Error saving student: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {trigger !== null && (
                <DialogTrigger asChild>
                    {trigger || (
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add Student
                        </Button>
                    )}
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-[950px] max-h-[90vh] p-0">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle>{student ? "Edit Student" : "Add Student"}</DialogTitle>
                    <DialogDescription>
                        {student ? "Update student details." : "Add a new student into the system."}
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-[calc(90vh-120px)] px-6 pb-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                            {/* Student Details */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Student Details</h3>
                                <Separator />

                                <div className="flex justify-center mb-6">
                                    <FormField control={form.control} name="profile_picture" render={({ field }) => (
                                        <FormItem className="flex flex-col items-center">
                                            <div className="relative">
                                                <div className="h-32 w-32 rounded-full overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
                                                    {field.value ? (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img src={field.value} alt="Profile" className="h-full w-full object-cover" />
                                                    ) : (
                                                        <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                                                            {uploading ? <Loader2 className="h-8 w-8 animate-spin text-gray-400" /> : <Upload className="h-8 w-8 text-gray-400" />}
                                                            <span className="text-xs text-gray-500 mt-1">{uploading ? "Uploading..." : "Upload Photo"}</span>
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                className="hidden"
                                                                onChange={handleUpload}
                                                                disabled={uploading}
                                                            />
                                                        </label>
                                                    )}
                                                </div>
                                                {field.value && (
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="icon"
                                                        className="absolute -top-1 -right-1 h-7 w-7 rounded-full shadow-md z-10"
                                                        onClick={() => field.onChange("")}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField control={form.control} name="name" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Name*</FormLabel>
                                            <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="nis" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>NIS*</FormLabel>
                                            <FormControl><Input placeholder="12345" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField control={form.control} name="email" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl><Input type="email" placeholder="student@school.com" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="phone" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone</FormLabel>
                                            <FormControl><Input placeholder="08..." {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField control={form.control} name="gender" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Gender*</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger></FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Male">Male</SelectItem>
                                                    <SelectItem value="Female">Female</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="place_of_birth" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Place of Birth</FormLabel>
                                            <FormControl><Input placeholder="City" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField control={form.control} name="date_of_birth" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Date of Birth</FormLabel>
                                            <FormControl><Input type="date" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="address" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Address</FormLabel>
                                            <FormControl><Input placeholder="Full Address" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </div>
                            </div>

                            {/* Academic Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Academic Information</h3>
                                <Separator />
                                <div className="grid grid-cols-3 gap-4">
                                    <FormField control={form.control} name="grade" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Class/Grade*</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="Select Grade" /></SelectTrigger></FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Kindergarten 1">Kindergarten 1</SelectItem>
                                                    <SelectItem value="Kindergarten 2">Kindergarten 2</SelectItem>
                                                    <SelectItem value="Pre-School 1">Pre-School 1</SelectItem>
                                                    <SelectItem value="Pre-School 2">Pre-School 2</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="enrollment_year" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Enrollment Year</FormLabel>
                                            <FormControl><Input placeholder="2024" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="status" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Status</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
                                                <SelectContent>
                                                    <SelectItem value="active">Active</SelectItem>
                                                    <SelectItem value="graduated">Graduated</SelectItem>
                                                    <SelectItem value="dropped">Dropped</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </div>
                            </div>

                            {/* Parent Details */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Parent Details</h3>
                                <Separator />
                                <FormField control={form.control} name="parent_name" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Parent Name*</FormLabel>
                                        <FormControl><Input placeholder="Parent Full Name" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField control={form.control} name="parent_email" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Parent Email</FormLabel>
                                            <FormControl><Input type="email" placeholder="parent@example.com" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="parent_phone" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Parent Phone*</FormLabel>
                                            <FormControl><Input placeholder="08..." {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </div>
                                <FormField control={form.control} name="parent_dob" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Parent Date of Birth</FormLabel>
                                        <FormControl><Input type="date" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>

                            <DialogFooter>
                                <Button type="submit" disabled={loading || uploading}>
                                    {(loading || uploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Student
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
