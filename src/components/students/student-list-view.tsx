"use client"

import { useState } from "react"
import { Student } from "@/types"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "@/components/students/student-columns"
import { Button } from "@/components/ui/button"
import { LayoutGrid, List, Search, User } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface StudentListViewProps {
    data: Student[]
    filters?: {
        column: string
        title: string
        options: { label: string, value: string }[]
    }[]
}

export function StudentListView({ data, filters }: StudentListViewProps) {
    const [view, setView] = useState<'list' | 'card'>('list')
    const [searchTerm, setSearchTerm] = useState('')
    const [filterValues, setFilterValues] = useState<Record<string, string>>({})

    const filteredData = data.filter(student => {
        // Search Filter (Name)
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase())

        // Faceted Filters (Grade, Status, etc)
        const matchesFilters = filters?.every(filter => {
            const filterValue = filterValues[filter.column]
            if (!filterValue || filterValue === 'all') return true

            const itemValue = (student as any)[filter.column]
            return String(itemValue).toLowerCase() === filterValue.toLowerCase()
        }) ?? true

        return matchesSearch && matchesFilters
    })

    const handleFilterChange = (column: string, value: string) => {
        setFilterValues(prev => ({ ...prev, [column]: value }))
    }

    return (
        <div className="space-y-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    {/* Text Search */}
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8"
                        />
                    </div>

                    {/* Dynamic Filters */}
                    {filters?.map((filter) => (
                        <Select
                            key={filter.column}
                            value={filterValues[filter.column] || ""}
                            onValueChange={(val) => handleFilterChange(filter.column, val)}
                        >
                            <SelectTrigger className="w-full sm:w-[150px]">
                                <SelectValue placeholder={filter.title} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All {filter.title}</SelectItem>
                                {filter.options.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    ))}
                </div>

                {/* View Toggles - Hidden on Mobile */}
                <div className="hidden md:flex items-center space-x-2 bg-muted p-1 rounded-lg shrink-0">
                    <Button
                        variant={view === 'list' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setView('list')}
                        className="h-8 w-8 p-0"
                    >
                        <List className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={view === 'card' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setView('card')}
                        className="h-8 w-8 p-0"
                    >
                        <LayoutGrid className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* List View - Hidden on Mobile if active */}
            <div className={view === 'list' ? 'hidden md:block' : 'hidden'}>
                <DataTable
                    columns={columns}
                    data={filteredData}
                />
            </div>

            {/* Card View - Visible if active OR if List is active but on Mobile (Forced) */}
            <div className={view === 'card' ? 'block' : 'block md:hidden'}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredData.map((student) => (
                        <div key={student.id} className="bg-white rounded-xl border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden group relative">
                            {/* Decorative Gradient Header */}
                            <div className="h-20 bg-gradient-to-r from-blue-500/10 to-purple-500/10 absolute top-0 w-full" />

                            <div className="p-6 flex flex-col items-center text-center space-y-4 pt-10 relative">
                                <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-white shadow-md group-hover:scale-105 transition-transform duration-300">
                                    {student.profile_picture ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={student.profile_picture}
                                            alt={student.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-400">
                                            <User className="h-10 w-10 opacity-50" />
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-1 w-full">
                                    <Link href={`/dashboard/students/${student.slug || student.id}`} className="hover:underline">
                                        <h4 className="font-bold text-lg text-gray-900 group-hover:text-primary transition-colors line-clamp-1">{student.name}</h4>
                                    </Link>
                                    <p className="text-sm text-muted-foreground font-mono">{student.nis}</p>
                                </div>

                                <Badge variant={student.status === 'active' ? 'default' : 'secondary'} className={`capitalize ${student.status === 'active' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}>
                                    {student.status}
                                </Badge>
                            </div>
                            <div className="border-t bg-gray-50/50 p-3 flex justify-between items-center text-xs text-muted-foreground px-6">
                                <span className="font-medium text-gray-500">Class</span>
                                <span className="font-semibold text-gray-700">{student.grade || '-'}</span>
                            </div>
                        </div>
                    ))}
                    {filteredData.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground space-y-3">
                            <div className="p-4 rounded-full bg-muted/50">
                                <Search className="h-8 w-8 opacity-50" />
                            </div>
                            <p>No students found matching your filters.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
