import { ClassroomModal } from "@/components/classroom/classroom-modal"
import { Classroom } from "@/types"
import { supabase } from "@/lib/supabaseClient"
import { ClassroomCard } from "@/components/classroom/classroom-card"
import { SearchInput } from "@/components/ui/search-input"

export const revalidate = 0

async function getClassroomsData(query: string) {
    // 1. Fetch Classrooms with optional search
    let queryBuilder = supabase
        .from('classrooms')
        .select('*')
        .order('name')

    if (query) {
        queryBuilder = queryBuilder.ilike('name', `%${query}%`)
    }

    const { data: classrooms, error: classroomError } = await queryBuilder

    if (classroomError) {
        console.error('Error fetching classrooms:', classroomError)
        return { classrooms: [], counts: {} }
    }

    // 2. Fetch Student Counts
    // Optimization: If search filters classrooms, we only need counts for those.
    // However, since we fetch all students to group them, it might be heavy if students table is huge.
    // Ideally we'd use a view or RPC. For now we stick to fetching all students grade to map.
    // A better approach if we have filtered classrooms is to fetch counts only for those grades.

    // Let's optimize slightly: array of grades we are interested in.
    const gradesOfInterest = classrooms?.map(c => c.name) || []

    let studentQuery = supabase
        .from('students')
        .select('grade')

    // Only filter if we have specific classrooms (if search yielded few results)
    if (gradesOfInterest.length > 0) {
        studentQuery = studentQuery.in('grade', gradesOfInterest)
    }

    const { data: students, error: studentError } = await studentQuery

    const counts: Record<string, number> = {}

    if (students) {
        students.forEach(s => {
            if (s.grade) {
                counts[s.grade] = (counts[s.grade] || 0) + 1
            }
        })
    }

    return { classrooms: (classrooms as Classroom[]) || [], counts }
}

export default async function ClassroomPage({ searchParams }: { searchParams: Promise<{ query?: string }> }) {
    const { query } = await searchParams
    const { classrooms, counts } = await getClassroomsData(query || "")

    return (
        <div className="flex h-full flex-1 flex-col space-y-8 mx-4 md:mx-8 lg:mx-20">
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Classroom</h2>
                    <p className="text-muted-foreground">
                        Manage Your School Classroom Here
                    </p>
                </div>
                <ClassroomModal />
            </div>

            <SearchInput placeholder="Search classrooms..." />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {classrooms.length > 0 ? (
                    classrooms.map((classroom) => (
                        <ClassroomCard
                            key={classroom.id}
                            classroom={classroom}
                            studentCount={counts[classroom.name] || 0}
                        />
                    ))
                ) : (
                    <div className="col-span-full text-center py-10 text-muted-foreground">
                        No classrooms found.
                    </div>
                )}
            </div>
        </div>
    )
}
