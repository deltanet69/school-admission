"use client"

import { DataTable } from "@/components/ui/data-table"
import { Admin, columns } from "./admin-columns"
import { AdminModal } from "./admin-modal"

interface AdminListViewProps {
    data: Admin[]
}

export function AdminListView({ data }: AdminListViewProps) {
    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <AdminModal />
            </div>
            <div className="border rounded-lg shadow-sm bg-white">
                <DataTable
                    columns={columns}
                    data={data}
                    searchKey="name"
                    facetedFilters={[
                        {
                            column: "role",
                            title: "Role",
                            options: [
                                { label: "Super Admin", value: "Super Admin" },
                                { label: "Admin", value: "Admin" },
                                { label: "Staff", value: "Staff" },
                            ]
                        }
                    ]}
                />
            </div>
        </div>
    )
}
