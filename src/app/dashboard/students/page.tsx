
import { DataTable } from "@/components/ui/data-table"
import { columns } from "@/components/students/student-columns"
import { StudentModal } from "@/components/students/student-modal"
import { StudentListView } from "@/components/students/student-list-view"
import { Student } from "@/types"
import { supabase } from "@/lib/supabaseClient"

export const revalidate = 0


async function getStudents(): Promise<Student[]> {
    const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching students:', error)
        return []
    }

    return (data as Student[]) || []
}

export default async function StudentsPage() {
    const data = await getStudents()

    const filters = [
        {
            column: "grade",
            title: "Grade",
            options: [
                { label: "Kindergarten 1", value: "Kindergarten 1" },
                { label: "Kindergarten 2", value: "Kindergarten 2" },
                { label: "Pre-School 1", value: "Pre-School 1" },
                { label: "Pre-School 2", value: "Pre-School 2" },
            ],
        },
        {
            column: "status",
            title: "Status",
            options: [
                { label: "Active", value: "active" },
                { label: "Graduated", value: "graduated" },
                { label: "Dropped", value: "dropped" },
            ],
        },
    ]

    return (
        <div className="flex h-full flex-1 flex-col space-y-8 mx-4 md:mx-8 lg:mx-20">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Students</h2>
                    <p className="text-muted-foreground">
                        Manage your school students here.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <StudentModal />
                </div>
            </div>
            <StudentListView
                data={data}
                filters={filters}
            />
        </div>
    )
}
