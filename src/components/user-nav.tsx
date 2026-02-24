'use client'

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { createBrowserClient } from '@supabase/auth-helpers-nextjs'
import { supabaseUrl, supabaseAnonKey } from '@/lib/supabaseClient'
import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

interface AdminProfile {
    name: string
    role: string
    email: string
    avatar_url?: string
}

export function UserNav() {
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<AdminProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const supabase = createBrowserClient(
        supabaseUrl,
        supabaseAnonKey
    )

    useEffect(() => {
        const getUser = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            const currentUser = session?.user ?? null
            setUser(currentUser)

            if (currentUser) {
                // Fetch the admin profile to get the real name and avatar
                const { data: adminProfile } = await supabase
                    .from('admins')
                    .select('name, role, email, avatar_url')
                    .eq('email', currentUser.email)
                    .single()
                setProfile(adminProfile)
            }

            setLoading(false)
        }
        getUser()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    if (loading) return <div className="animate-pulse h-12 w-12 rounded-full bg-gray-200" />

    if (!user) {
        return (
            <Button variant="outline" onClick={() => router.push('/login')}>
                Log In
            </Button>
        )
    }

    const displayName = profile?.name || user.email?.split('@')[0] || 'Admin'
    const displayRole = profile?.role || 'Administrator'
    const initials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    const avatarUrl = profile?.avatar_url || "/avatars/01.png"

    return (
        <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end mr-2">
                <span className="text-md font-medium">{displayName}</span>
                <span className="text-sm text-[#4285F4]">{displayRole}</span>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-12 w-12 rounded-full bg-gray-200">
                        <Avatar className="h-14 w-14">
                            <AvatarImage src={avatarUrl} alt={displayName} className="object-cover" />
                            <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-72" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{displayName}</p>
                            <p className="text-xs leading-none text-muted-foreground">
                                {user.email}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
                            Profile
                            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                        Log out
                        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
