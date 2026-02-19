"use client"

import { DataTable } from "@/components/ui/data-table"
import { Parent, columns } from "./parent-columns"

interface ParentListViewProps {
    data: Parent[]
}

export function ParentListView({ data }: ParentListViewProps) {
    return (
        <div className="space-y-4">
            <div className="border rounded-lg shadow-sm bg-white">
                <DataTable
                    columns={columns}
                    data={data}
                    searchKey="parent_name"
                />
            </div>
        </div>
    )
}
