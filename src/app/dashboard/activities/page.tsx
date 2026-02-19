import { RecentActivityList } from "./activity-list";

export default function ActivitiesPage() {
    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#303030]">All Activity History</h1>
                <p className="text-gray-500">View and filter all system events and updates</p>
            </div>

            <RecentActivityList />
        </div>
    )
}
