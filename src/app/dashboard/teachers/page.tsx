
import { DataTable } from "@/components/ui/data-table"
import { columns } from "@/components/teachers/teacher-columns"
import { TeacherModal } from "@/components/teachers/teacher-modal"
import { TeacherListView } from "@/components/teachers/teacher-list-view"
import { Teacher } from "@/types"
import { supabase } from "@/lib/supabaseClient"
export const revalidate = 0


async function getTeachers(): Promise<Teacher[]> {
    const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching teachers:', JSON.stringify(error, null, 2))
        return []
    }

    return (data as Teacher[]) || []
}

export default async function TeachersPage() {
    const data = await getTeachers()

    return (
        <div className="flex h-full flex-1 flex-col space-y-8 mx-4 md:mx-8 lg:mx-20">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Teachers</h2>
                    <p className="text-muted-foreground">
                        Manage your school teachers here.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <TeacherModal />
                </div>
            </div>
            <TeacherListView data={data} />
        </div>
    )
}
