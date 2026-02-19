
"use client"

import { useState } from "react"
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
import { Loader2, Plus, X } from "lucide-react"

const teacherSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    nip: z.string().min(1, "NIP is required"),
    subject_specialty: z.string().min(1, "Subject is required"),
    phone: z.string().min(10, "Phone number must be valid"),
    status: z.string().min(1, "Status is required"),
    email: z.string().email("Invalid email address"),
    position: z.string().min(1, "Position is required"),
    last_education: z.string().min(1, "Education is required"),
    profile_picture: z.string().optional(),
})

type TeacherFormValues = z.infer<typeof teacherSchema>

interface TeacherModalProps {
    teacher?: any
    trigger?: React.ReactNode
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export function TeacherModal({ teacher, trigger, open: controlledOpen, onOpenChange }: TeacherModalProps) {
    const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
    const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen
    const setOpen = onOpenChange || setUncontrolledOpen
    const [uploading, setUploading] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const form = useForm<TeacherFormValues>({
        resolver: zodResolver(teacherSchema),
        defaultValues: {
            name: teacher?.name || "",
            nip: teacher?.nip || "",
            subject_specialty: teacher?.subject_specialty || "",
            phone: teacher?.phone || "",
            status: teacher?.status || "active",
            email: teacher?.email || "",
            position: teacher?.position || "",
            last_education: teacher?.last_education || "",
            profile_picture: teacher?.profile_picture || "",
        },
    })

    const onSubmit = async (data: TeacherFormValues) => {
        setLoading(true)
        try {
            if (teacher?.id) {
                // Update
                const { error } = await supabase.from('teachers').update({
                    name: data.name,
                    nip: data.nip,
                    subject_specialty: data.subject_specialty,
                    phone: data.phone,
                    status: data.status,
                    email: data.email,
                    position: data.position,
                    last_education: data.last_education,
                    profile_picture: data.profile_picture,
                }).eq('id', teacher.id)

                if (error) throw error
            } else {
                // Insert
                const { error } = await supabase.from('teachers').insert({
                    name: data.name,
                    nip: data.nip,
                    subject_specialty: data.subject_specialty,
                    phone: data.phone,
                    status: data.status,
                    email: data.email,
                    position: data.position,
                    last_education: data.last_education,
                    profile_picture: data.profile_picture,
                })

                if (error) throw error
            }

            setOpen(false)
            form.reset()
            router.refresh()
        } catch (error: any) {
            console.error('Error saving teacher:', error)
            alert(`Error saving teacher: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true)
            if (!e.target.files || e.target.files.length === 0) {
                return
            }
            const file = e.target.files[0]
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `${fileName}`

            // 1. Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('student-avatars') // Reusing student-avatars as per plan, or user can create teacher-avatars
                .upload(filePath, file)

            if (uploadError) {
                // Hint for common errors
                if (uploadError.message.includes("Bucket not found")) {
                    alert("Error: Bucket 'student-avatars' not found. Please create it in Supabase > Storage.")
                } else if (uploadError.message.includes("row-level security")) {
                    alert("Error: Permission denied. Please run the RLS SQL script to allow uploads.")
                } else {
                    alert(`Error uploading image: ${uploadError.message}`)
                }
                throw uploadError
            }

            // 2. Get Public URL
            const { data } = supabase.storage.from('student-avatars').getPublicUrl(filePath)

            // 3. Set form value
            form.setValue('profile_picture', data.publicUrl)
        } catch (error: any) {
            console.error('Error uploading image:', error)
        } finally {
            setUploading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {trigger !== null && (
                <DialogTrigger asChild>
                    {trigger || (
                        <Button className="text-md p-4 cursor-pointer">
                            <Plus className="mr-2 h-4 w-4" /> Add Teachers
                        </Button>
                    )}
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] p-0">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle>{teacher ? "Edit Teacher" : "Add Teacher"}</DialogTitle>
                    <DialogDescription>
                        {teacher ? "Update teacher details" : "Add a new teacher to the system. Click save when you're done."}
                    </DialogDescription>
                </DialogHeader>
                <div className="p-6 pt-2 overflow-y-auto max-h-[calc(90vh-120px)]">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* Profile Picture Upload */}
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
                                                        {uploading ? <Loader2 className="h-8 w-8 animate-spin text-gray-400" /> : <Plus className="h-8 w-8 text-gray-400" />}
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

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name*</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="John Doe" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="nip"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>NIP*</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="1234567890" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Phone*</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="+1234567890" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="john@school.com" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="position"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Position (Jabatan)*</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select position" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="Kepala Sekolah">Kepala Sekolah</SelectItem>
                                                        <SelectItem value="Wakil Kepala Sekolah">Wakil Kepala Sekolah</SelectItem>
                                                        <SelectItem value="Wali Kelas">Wali Kelas</SelectItem>
                                                        <SelectItem value="Bendahara">Bendahara</SelectItem>
                                                        <SelectItem value="Sekretaris">Sekretaris</SelectItem>
                                                        <SelectItem value="Guru BK">Guru BK</SelectItem>
                                                        <SelectItem value="Guru Kelas">Guru Kelas</SelectItem>
                                                        <SelectItem value="Guru Ektrakurikuler">Guru Ektrakurikuler</SelectItem>
                                                        <SelectItem value="Guru Pengganti">Guru Pengganti</SelectItem>
                                                        <SelectItem value="Staff TU">Staff TU</SelectItem>
                                                        <SelectItem value="Staff IT">Staff IT</SelectItem>
                                                        <SelectItem value="Staff Multimedia">Staff Multimedia</SelectItem>
                                                        <SelectItem value="Staff Office">Staff Office</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="last_education"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Last Education*</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select education" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="S3">S3</SelectItem>
                                                        <SelectItem value="S2">S2</SelectItem>
                                                        <SelectItem value="S1">S1</SelectItem>
                                                        <SelectItem value="D3">D3</SelectItem>
                                                        <SelectItem value="D2">D2</SelectItem>
                                                        <SelectItem value="SMA">SMA</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="subject_specialty"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Subject*</FormLabel>
                                                <FormControl>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select subject" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="Mathematics">Mathematics</SelectItem>
                                                            <SelectItem value="Science">Science</SelectItem>
                                                            <SelectItem value="English">English</SelectItem>
                                                            <SelectItem value="History">History</SelectItem>
                                                            <SelectItem value="Art">Art</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="status"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Status*</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select status" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="active">Active</SelectItem>
                                                        <SelectItem value="inactive">Inactive</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <DialogFooter>
                                <Button type="submit" disabled={loading}>
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save changes
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    )
}
