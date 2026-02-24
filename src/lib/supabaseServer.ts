import { createServerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { supabaseUrl, supabaseAnonKey } from './supabaseClient'

export async function createServerSupabaseClient() {
    const cookieStore = await cookies()

    return createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
                set(name: string, value: string, options: any) {
                    try {
                        cookieStore.set({ name, value, ...options })
                    } catch {
                        // The `set` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing sessions.
                    }
                },
                remove(name: string, options: any) {
                    try {
                        cookieStore.set({ name, value: '', ...options })
                    } catch {
                        // The `delete` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing sessions.
                    }
                },
            },
        }
    )
}
