"use server"

import { supabase } from "@/lib/supabaseClient"
import { startOfDay, endOfDay, subDays, subWeeks, subMonths, format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, isSameDay } from "date-fns"

export type ChartPeriod = "daily" | "weekly" | "monthly" | "custom"

interface DateRange {
    from: Date
    to: Date
}

export async function getRegistrationData(period: ChartPeriod = "monthly", customRange?: { from: string, to: string }) {
    const today = new Date()
    let startDate: Date
    let endDate: Date = today
    let interval: Date[]
    let dateFormat: string

    switch (period) {
        case "daily":
            startDate = subDays(today, 6) // Last 7 days including today
            interval = eachDayOfInterval({ start: startDate, end: today })
            dateFormat = "MMM dd"
            break
        case "weekly":
            startDate = subWeeks(today, 6) // Last 7 weeks including this week
            interval = eachWeekOfInterval({ start: startDate, end: today })
            dateFormat = "'Week' w"
            break
        case "custom":
            if (!customRange?.from || !customRange?.to) return []
            startDate = new Date(customRange.from)
            endDate = new Date(customRange.to)
            // Determine interval based on duration
            const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays <= 31) {
                interval = eachDayOfInterval({ start: startDate, end: endDate })
                dateFormat = "MMM dd"
            } else if (diffDays <= 180) {
                interval = eachWeekOfInterval({ start: startDate, end: endDate })
                dateFormat = "'Week' w"
            } else {
                interval = eachMonthOfInterval({ start: startDate, end: endDate })
                dateFormat = "MMM yyyy"
            }
            break
        case "monthly":
        default:
            startDate = subMonths(today, 11) // Last 12 months (1 year)
            interval = eachMonthOfInterval({ start: startDate, end: today })
            dateFormat = "MMM yyyy"
            break
    }

    // Fetch admissions with status
    const { data: admissions, error } = await supabase
        .from('admissions')
        .select('created_at, status')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString()) // Add upper bound
        .order('created_at', { ascending: true })

    if (error) {
        // Suppress noisy error logs during dev if network is unstable
        // console.error("Error fetching chart data:", JSON.stringify(error, null, 2))
        return []
    }

    // Aggregate data
    const aggregatedData = interval.map(date => {
        let label = format(date, dateFormat)

        // Define boundaries for the current interval step
        let stepStart: Date, stepEnd: Date

        if (period === "daily" || (period === "custom" && dateFormat === "MMM dd")) {
            stepStart = startOfDay(date)
            stepEnd = endOfDay(date)
        } else if (period === "weekly" || (period === "custom" && dateFormat === "'Week' w")) {
            stepStart = startOfWeek(date)
            stepEnd = endOfWeek(date)
        } else {
            stepStart = startOfMonth(date)
            stepEnd = endOfMonth(date)
        }

        const intervalAdmissions = admissions.filter(a => {
            const admissionDate = new Date(a.created_at)
            return admissionDate >= stepStart && admissionDate <= stepEnd
        })

        return {
            date: label,
            total: intervalAdmissions.length,
            approved: intervalAdmissions.filter(a => a.status === 'approved').length,
            rejected: intervalAdmissions.filter(a => a.status === 'rejected').length
        }
    })

    return aggregatedData
}
