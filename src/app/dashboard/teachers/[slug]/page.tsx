
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Mail, Phone, User, Calendar, BookOpen, GraduationCap, Briefcase } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabaseClient"
import { Teacher } from "@/types"
import { notFound } from "next/navigation"
import { TeacherDetailActions } from "@/components/teachers/teacher-detail-actions"

/* eslint-disable @next/next/no-img-element */

export const revalidate = 0

async function getTeacher(slugOrId: string): Promise<Teacher | null> {
    // Try by slug first
    let { data, error } = await supabase
        .from('teachers')
        .select('*')
        .eq('slug', slugOrId)
        .single()

    // If not found by slug, try by ID
    if (!data) {
        const { data: byId } = await supabase
            .from('teachers')
            .select('*')
            .eq('id', slugOrId)
            .single()
        data = byId
    }

    if (!data) {
        return null
    }

    return data as Teacher
}

export default async function TeacherDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const teacher = await getTeacher(slug)

    if (!teacher) {
        notFound()
    }

    return (
        <div className="space-y-6 mx-4 md:mx-8 lg:mx-20">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link href="/dashboard/teachers">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h2 className="text-3xl font-bold tracking-tight">Teacher Details</h2>
                </div>
                <div className="hidden md:block">
                    <TeacherDetailActions teacher={teacher} />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Profile Card */}
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle>Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center text-center space-y-4">
                        <div className="relative h-32 w-32 rounded-full overflow-hidden border-2 border-primary">
                            {teacher.profile_picture ? (
                                <img
                                    src={teacher.profile_picture}
                                    alt={teacher.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="h-full w-full bg-muted flex items-center justify-center">
                                    <User className="h-16 w-16 text-muted-foreground" />
                                </div>
                            )}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">{teacher.name}</h3>
                            <p className="text-sm text-muted-foreground">{teacher.position || "Teacher"}</p>
                            <div className="mt-2 text-xs font-mono bg-muted px-2 py-1 rounded inline-block">
                                NIP: {teacher.nip}
                            </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${teacher.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                            {teacher.status.toUpperCase()}
                        </div>
                    </CardContent>
                </Card>

                {/* Details Column */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/20">
                                    <Mail className="h-7 w-7 text-primary" />
                                    <div>
                                        <p className="text-xs text-muted-foreground font-medium">Email</p>
                                        <p className="text-md font-medium">{teacher.email || "-"}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/20">
                                    <Phone className="h-7 w-7 text-primary" />
                                    <div>
                                        <p className="text-xs text-muted-foreground font-medium">Phone</p>
                                        <p className="text-md font-medium">{teacher.phone || "-"}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/20">
                                    <Calendar className="h-7 w-7 text-primary" />
                                    <div>
                                        <p className="text-xs text-muted-foreground font-medium">Join Date</p>
                                        <p className="text-md font-medium">
                                            {new Date(teacher.created_at).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Professional Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/20">
                                    <Briefcase className="h-7 w-7 text-primary" />
                                    <div>
                                        <p className="text-xs text-muted-foreground font-medium">Position (Jabatan)</p>
                                        <p className="text-md font-medium">{teacher.position || "-"}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/20">
                                    <BookOpen className="h-7 w-7 text-primary" />
                                    <div>
                                        <p className="text-xs text-muted-foreground font-medium">Subject Specialty</p>
                                        <p className="text-md font-medium">{teacher.subject_specialty || "-"}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/20">
                                    <GraduationCap className="h-7 w-7 text-primary" />
                                    <div>
                                        <p className="text-xs text-muted-foreground font-medium">Last Education</p>
                                        <p className="text-md font-medium">{teacher.last_education || "-"}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Mobile Actions (Bottom) */}
            <div className="md:hidden mt-6 pb-6">
                <div className="flex flex-col gap-3">
                    <TeacherDetailActions teacher={teacher} />
                </div>
            </div>
        </div>
    )
}
