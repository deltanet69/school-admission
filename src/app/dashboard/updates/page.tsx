import { Button } from "@/components/ui/button"
import { getUpdates } from "@/app/actions/updates"
import { CreateUpdateModal } from "@/components/updates/create-update-modal"
import { UpdateCard } from "@/components/updates/update-card"

export const revalidate = 0

export default async function UpdatesPage() {
    const updates = await getUpdates()

    return (
        <div className="flex-1 space-y-4  mr-20 ml-20">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Updates Center</h2>
                    <p className="text-muted-foreground">Announcements and news for the school.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <CreateUpdateModal />
                </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {updates.length > 0 ? (
                    updates.map((update) => (
                        <UpdateCard key={update.id} update={update} />
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                        No updates found. Create one to get started.
                    </div>
                )}
            </div>
        </div>
    )
}
