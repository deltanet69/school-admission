import { AdminTabs } from "@/components/admin/admin-tabs"
import { createServerSupabaseClient } from "@/lib/supabaseServer"
import { Admin } from "@/components/admin/admin-columns"
import { Teacher, Student } from "@/types"
import { Parent } from "@/components/admin/parent-columns"

export const revalidate = 0

async function getData() {
    const supabase = await createServerSupabaseClient()

    const [
        { data: admins, error: adminsError },
        { data: teachers },
        { data: students }
    ] = await Promise.all([
        supabase.from('admins').select('*').order('created_at', { ascending: false }),
        supabase.from('teachers').select('*').order('created_at', { ascending: false }),
        supabase.from('students').select('*').order('created_at', { ascending: false })
    ])

    if (adminsError) {
        console.error("[Dashboard] Error fetching admins:", adminsError.message)
    } else {
        console.log("[Dashboard] Fetched admins:", admins?.length)
        if (admins?.length === 0) {
            // Check session visibility
            const { data: { session } } = await supabase.auth.getSession()
            console.log("[Dashboard] Session status:", session ? "Active" : "None", "User:", session?.user?.email)
        }
    }

    const parents: Parent[] = (students || [])
        .filter(s => s.parent_name)
        .map(s => ({
            id: s.id, // using student id as key since we don't have parent table
            parent_name: s.parent_name!,
            parent_email: s.parent_email,
            parent_phone: s.parent_phone,
            student_name: s.name,
            student_grade: s.grade
        }))

    return {
        admins: (admins as Admin[]) || [],
        teachers: (teachers as Teacher[]) || [],
        students: (students as Student[]) || [],
        parents,
        userEmail: (await supabase.auth.getUser()).data.user?.email || 'None'
    }
}

export default async function AdminPage() {
    const { admins, teachers, students, parents, userEmail } = await getData()

    return (
        <div className="flex h-full flex-1 flex-col space-y-8 mx-4 md:mx-8 lg:mx-20 animate-in fade-in duration-500">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
                    <p className="text-muted-foreground">
                        Manage system administrators, teachers, students, and parents.
                    </p>
                </div>
            </div>

            {/* Debug Info */}
            <div className="p-4 bg-slate-100 rounded-md text-xs font-mono mb-4 text-black">
                <p><strong>Debug Status:</strong></p>
                <p>Admins Count: {admins ? admins.length : 'NULL'}</p>
                <p>Teachers Count: {teachers ? teachers.length : 'NULL'}</p>
                <p>Session User: {userEmail}</p>
            </div>

            <AdminTabs
                admins={admins}
                teachers={teachers}
                students={students}
                parents={parents}
            />
        </div>
    )
}
