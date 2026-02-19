"use client"

import { useState } from "react"
import { Teacher } from "@/types"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "@/components/teachers/teacher-columns"
import { Button } from "@/components/ui/button"
import { LayoutGrid, List, Search } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User } from "lucide-react"

interface TeacherListViewProps {
    data: Teacher[]
}

export function TeacherListView({ data }: TeacherListViewProps) {
    const [view, setView] = useState<'list' | 'card'>('list')
    const [searchTerm, setSearchTerm] = useState('')

    // Teachers usually don't have complex faceted filters in the current page, 
    // but the page only had 'searchKey="name"'. We'll stick to search for now, 
    // or add 'position' filter if needed. The current TeacherPage doesn't define filters, so we just use search.

    const filteredData = data.filter(teacher => {
        return teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
    })

    return (
        <div className="space-y-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    {/* Text Search */}
                    <div className="relative w-full sm:w-64 bg-white">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8"
                        />
                    </div>
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
                    {filteredData.map((teacher) => (
                        <div key={teacher.id} className="bg-white rounded-xl border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden group relative">
                            {/* Decorative Gradient Header */}
                            <div className="h-20 bg-gradient-to-r from-orange-500/10 to-amber-500/10 absolute top-0 w-full" />

                            <div className="p-6 flex flex-col items-center text-center space-y-4 pt-10 relative">
                                <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-white shadow-md group-hover:scale-105 transition-transform duration-300">
                                    {teacher.profile_picture ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={teacher.profile_picture}
                                            alt={teacher.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-400">
                                            <User className="h-10 w-10 opacity-50" />
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-1 w-full">
                                    <Link href={`/dashboard/teachers/${teacher.slug || teacher.id}`} className="hover:underline">
                                        <h4 className="font-bold text-lg text-gray-900 group-hover:text-primary transition-colors line-clamp-1">{teacher.name}</h4>
                                    </Link>
                                    <Badge variant="outline" className="font-normal border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
                                        {teacher.position || 'Teacher'}
                                    </Badge>
                                </div>
                            </div>
                            <div className="border-t bg-gray-50/50 p-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground px-6 ">
                                <div className="flex flex-col items-start">
                                    <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">NIP</span>
                                    <span className="font-mono text-gray-700 truncate w-full text-left" title={teacher.nip}>{teacher.nip || '-'}</span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Status</span>
                                    <span className={`font-medium capitalize ${teacher.status === 'active' ? 'text-green-600' : 'text-red-500'}`}>{teacher.status}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredData.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground space-y-3">
                            <div className="p-4 rounded-full bg-muted/50">
                                <Search className="h-8 w-8 opacity-50" />
                            </div>
                            <p>No teachers found matching your search.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
