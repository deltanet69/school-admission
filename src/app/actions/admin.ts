"use server"

import { revalidatePath } from "next/cache"
import { supabase as supabaseAnon } from "@/lib/supabaseClient"
import { createServerSupabaseClient } from "@/lib/supabaseServer"

export type AdminInput = {
    id?: string
    name: string
    email: string
    role: "Super Admin" | "Admin" | "Staff"
    status: "Active" | "Inactive"
    password?: string // Only for creation
}

export async function createAdmin(input: AdminInput) {
    // 1. Create Auth User using ANON client (so we don't log out the current admin)
    const { data: authData, error: authError } = await supabaseAnon.auth.signUp({
        email: input.email,
        password: input.password || 'Temporary123!',
        options: {
            data: {
                name: input.name,
                role: 'admin'
            }
        }
    })

    if (authError) return { error: authError.message }
    if (!authData.user) return { error: "Failed to create auth user" }

    // 2. Create Admin Profile using REDIRECTED COOKIE client (to pass RLS)
    const supabase = await createServerSupabaseClient()

    // Verify session exists (logging only, relying on downstream RLS for enforcement)
    // Manual client might not hydrate local session but still sends valid cookies.
    // Verify session exists (logging only, relying on downstream RLS for enforcement)
    // Manual client might not hydrate local session but still sends valid cookies.
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
        console.warn("[createAdmin] No local session found (manual client), attempting request anyway...")
    } else {
        console.log("[createAdmin] Session found for:", session.user.email)
    }

    const { error: profileError } = await supabase
        .from('admins')
        .insert({
            user_id: authData.user.id,
            name: input.name,
            email: input.email,
            role: input.role,
            status: input.status
        })

    if (profileError) return { error: profileError.message }

    revalidatePath('/dashboard/admin')
    return { success: true }
}

export async function updateAdmin(input: AdminInput) {
    if (!input.id) return { error: "ID required for update" }

    const supabase = await createServerSupabaseClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return { error: "Unauthorized" }

    const { error } = await supabase
        .from('admins')
        .update({
            name: input.name,
            email: input.email,
            role: input.role,
            status: input.status,
            updated_at: new Date().toISOString()
        })
        .eq('id', input.id)

    if (error) return { error: error.message }

    revalidatePath('/dashboard/admin')
    return { success: true }
}

export async function deleteAdmin(id: string) {
    const supabase = await createServerSupabaseClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return { error: "Unauthorized" }

    // 1. Get user_id to delete auth user (optional)
    // const { data: admin } = await supabase.from('admins').select('user_id').eq('id', id).single()

    // 2. Delete Profile
    const { error } = await supabase.from('admins').delete().eq('id', id)
    if (error) return { error: error.message }

    // 3. Delete Auth User 
    // Requires Service Role, skipping for now as per previous plan.

    revalidatePath('/dashboard/admin')
    return { success: true }
}
