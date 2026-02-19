import { getRegistrationData } from "@/app/actions/chart-data"
import { RegistrationChartClient } from "./registration-chart-client"

export async function RegistrationChart() {
    // Fetch initial monthly data server-side for SEO and fast first paint
    const data = await getRegistrationData('monthly')
    // @ts-ignore - The data shape from server action matches the client expectation
    return <RegistrationChartClient initialData={data} />
}
