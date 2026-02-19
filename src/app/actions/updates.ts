'use server'

import { supabase } from "@/lib/supabaseClient"
import { Update } from "@/types"
import { revalidatePath } from "next/cache"

export async function getUpdates() {
    const { data, error } = await supabase
        .from('updates')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching updates:', error)
        return []
    }

    return data as Update[]
}

export async function createUpdate(formData: FormData) {
    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const category = formData.get('category') as string

    if (!title || !content) {
        return { error: "Title and content are required" }
    }

    const { error } = await supabase
        .from('updates')
        .insert({
            title,
            content,
            category,
            author_id: null, // Optional for now
            is_published: true
        })

    if (error) {
        console.error('Error creating update:', error)
        return { error: "Failed to create update" }
    }

    revalidatePath('/dashboard/updates')
    return { success: true }
}

export async function deleteUpdate(id: string) {
    const { error } = await supabase
        .from('updates')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting update:', error)
        return { error: "Failed to delete update" }
    }

    revalidatePath('/dashboard/updates')
    return { success: true }
}
