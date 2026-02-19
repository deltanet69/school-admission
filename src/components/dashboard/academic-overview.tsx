import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function AcademicOverview() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="w-1.5 h-8 bg-blue-600 rounded-full shadow-sm"></div>
                <h3 className="text-xl font-bold text-[#303030]">Academic Overview</h3>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex flex-wrap gap-4 w-full sm:w-auto items-center">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Level:</span>
                        <Select defaultValue="all">
                            <SelectTrigger className="w-[140px] h-9 border-gray-200 bg-gray-50/50 focus:ring-blue-100">
                                <SelectValue placeholder="Select Level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Levels</SelectItem>
                                <SelectItem value="k1">Kindergarten</SelectItem>
                                <SelectItem value="p1">Primary</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Status:</span>
                        <Select defaultValue="all">
                            <SelectTrigger className="w-[140px] h-9 border-gray-200 bg-gray-50/50 focus:ring-blue-100">
                                <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="relative w-full sm:w-[300px]">
                    <Input placeholder="Search tasks..." className="pl-10 h-10 rounded-full border-gray-200 bg-gray-50/50 focus-visible:ring-blue-100" />
                    <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                </div>
            </div>

            <div className="space-y-3">
                {[
                    { title: "Tugas Mewarnai Buku Gambar", tag: "Kindergarten K1", tagColor: "bg-amber-100 text-amber-700", time: "25 min ago", due: "7 collected", status: "On progress", statusColor: "text-blue-600", progressId: 1 },
                    { title: "Belajar Menulis Huruf Hijaiyah", tag: "Kindergarten K1", tagColor: "bg-amber-100 text-amber-700", time: "2 hours ago", due: "10 collected", status: "Finished", statusColor: "text-green-600", progressId: 2 },
                    { title: "Hafalan Surat Pendek (An-Nas)", tag: "Kindergarten K2", tagColor: "bg-lime-100 text-lime-700", time: "3 hours ago", due: "10 collected", status: "Finished", statusColor: "text-green-600", progressId: 2 },
                    { title: "Pengenalan Angka 1-10", tag: "Pre-School P2", tagColor: "bg-pink-100 text-pink-700", time: "5 hours ago", due: "10 collected", status: "Finished", statusColor: "text-green-600", progressId: 2 },
                ].map((task, i) => (
                    <Card key={i} className="border-none shadow-sm hover:shadow-md hover:translate-x-1 transition-all duration-300 group">
                        <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="space-y-2">
                                <h4 className="font-semibold text-lg text-[#303030] group-hover:text-blue-600 transition-colors">{task.title}</h4>
                                <div className="flex flex-wrap gap-2 items-center">
                                    <span className={`text-xs px-2.5 py-1 rounded-md font-semibold ${task.tagColor}`}>{task.tag}</span>
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                        {task.time}
                                    </span>
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                        {task.due}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 md:min-w-[120px] justify-end">
                                <div className={`h-2 w-2 rounded-full ${task.status === 'On progress' ? 'bg-blue-500 animate-pulse' : 'bg-green-500'}`}></div>
                                <span className={`text-sm font-semibold ${task.statusColor}`}>{task.status}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <div className="text-center pt-2">
                <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">View All Tasks</Button>
            </div>
        </div>
    )
}
