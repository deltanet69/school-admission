import { DataTable } from "@/components/ui/data-table"
import { columns } from "@/components/admission/admission-columns"
import { AdmissionStats } from "@/components/admission/admission-stats"
import { supabase } from "@/lib/supabaseClient"
import { Admission } from "@/types"
import { AdmissionActions } from "@/components/admission/admission-actions"

export const revalidate = 0

async function getAdmissions(): Promise<Admission[]> {
    const { data, error } = await supabase
        .from('admissions')
        .select('*')
        .order('submission_date', { ascending: false })

    if (error) {
        console.error('Error fetching admissions:', error)
        return []
    }

    return data as Admission[]
}

export default async function AdmissionPage() {
    const data = await getAdmissions()

    const stats = {
        total: data.length,
        pending: data.filter(a => a.status === 'pending').length,
        approved: data.filter(a => a.status === 'approved').length,
        rejected: data.filter(a => a.status === 'rejected').length,
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Admissions</h2>
                    <p className="text-muted-foreground">
                        Manage new student applications and enrollments.
                    </p>
                </div>
                <AdmissionActions />
            </div>

            <AdmissionStats
                // ... stats
                total={stats.total}
                pending={stats.pending}
                approved={stats.approved}
                rejected={stats.rejected}
            />

            <div className="bg-white p-6 rounded-xl border shadow-sm">
                <div className="mb-4">
                    <h3 className="text-lg font-semibold">Recent Applications</h3>
                </div>
                <DataTable
                    data={data}
                    columns={columns}
                    searchKey="applicant_name"
                    facetedFilters={[
                        {
                            column: "status",
                            title: "Status",
                            options: [
                                { label: "Approved", value: "approved" },
                                { label: "Pending", value: "pending" },
                                { label: "Rejected", value: "rejected" },
                            ]
                        }
                    ]}
                />
            </div>
        </div>
    )
}
