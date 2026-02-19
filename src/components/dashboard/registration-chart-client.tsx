"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { useState, useEffect, useTransition } from "react"
import { getRegistrationData, ChartPeriod } from "@/app/actions/chart-data"
import { Loader2, CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { DateRange } from "react-day-picker"

interface ChartDataPoint {
    date: string
    total: number
    approved: number
    rejected: number
}

interface RegistrationChartClientProps {
    initialData: ChartDataPoint[]
}

export function RegistrationChartClient({ initialData }: RegistrationChartClientProps) {
    const [period, setPeriod] = useState<ChartPeriod>("monthly")
    const [data, setData] = useState<ChartDataPoint[]>(initialData)
    const [isPending, startTransition] = useTransition()
    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(),
        to: new Date(),
    })
    const [isCustomOpen, setIsCustomOpen] = useState(false)

    useEffect(() => {
        if (period === 'monthly' && data === initialData && !date?.from) return

        const fetchData = async () => {
            // If custom, ensure we have dates
            if (period === 'custom' && (!date?.from || !date?.to)) return

            const customRange = period === 'custom' && date?.from && date?.to ? {
                from: date.from.toISOString(),
                to: date.to.toISOString()
            } : undefined

            const newData = await getRegistrationData(period, customRange)
            // @ts-ignore - Data shape matches
            setData(newData)
        }

        startTransition(() => {
            fetchData()
        })
    }, [period, date])

    const handlePeriodChange = (p: ChartPeriod) => {
        setPeriod(p)
        if (p === 'custom') {
            setIsCustomOpen(true)
        }
    }

    return (
        <Card className="border-none overflow-hidden bg-white text-[#303030] relative">
            <CardHeader className="flex flex-col sm:flex-row items-center justify-between pb-2 border-b border-gray-100 gap-4">
                <div className="w-full sm:w-auto">
                    <CardTitle className="text-lg font-bold text-[#303030]">Student Registration Trends</CardTitle>
                    <p className="text-sm text-gray-400">Admission status breakdown</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        {(['daily', 'weekly', 'monthly'] as ChartPeriod[]).map((p) => (
                            <button
                                key={p}
                                onClick={() => handlePeriodChange(p)}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-all duration-200 capitalize ${period === p
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-900'
                                    }`}
                            >
                                {p}
                            </button>
                        ))}
                        <button
                            onClick={() => handlePeriodChange('custom')}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all duration-200 capitalize ${period === 'custom'
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            Custom
                        </button>
                    </div>

                    {period === 'custom' && (
                        <Popover open={isCustomOpen} onOpenChange={setIsCustomOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    id="date"
                                    variant={"outline"}
                                    size="sm"
                                    className={cn(
                                        "w-[240px] justify-start text-left font-normal bg-white border-gray-200",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date?.from ? (
                                        date.to ? (
                                            <>
                                                {format(date.from, "LLL dd, y")} -{" "}
                                                {format(date.to, "LLL dd, y")}
                                            </>
                                        ) : (
                                            format(date.from, "LLL dd, y")
                                        )
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="end">
                                <Calendar
                                    initialFocus
                                    mode="range"
                                    defaultMonth={date?.from}
                                    selected={date}
                                    onSelect={setDate}
                                    numberOfMonths={2}
                                />
                            </PopoverContent>
                        </Popover>
                    )}
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="h-[350px] w-full relative">
                    {isPending && (
                        <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center backdrop-blur-[1px]">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                        </div>
                    )}
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="fillBlue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="fillGreen" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="fillRed" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                dy={10}
                                minTickGap={30}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    borderColor: '#E5E7EB',
                                    borderRadius: '12px',
                                    color: '#000',
                                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                                }}
                                cursor={{ stroke: '#9CA3AF', strokeWidth: 1, strokeDasharray: '4 4' }}
                            />

                            {/* Total Admission - Blue */}
                            <Area
                                type="monotone"
                                dataKey="total"
                                name="Total Applications"
                                stroke="#3B82F6"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#fillBlue)"
                                animationDuration={1000}
                            />

                            {/* Approved - Green */}
                            <Area
                                type="monotone"
                                dataKey="approved"
                                name="Approved"
                                stroke="#10B981"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#fillGreen)"
                                animationDuration={1000}
                            />

                            {/* Rejected - Red */}
                            <Area
                                type="monotone"
                                dataKey="rejected"
                                name="Rejected"
                                stroke="#EF4444"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#fillRed)"
                                animationDuration={1000}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
