
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export function MainNav({
    className,
    ...props
}: React.HTMLAttributes<HTMLElement>) {
    const pathname = usePathname()

    const routes = [
        {
            href: '/dashboard',
            label: 'Dashboard',
            active: pathname === '/dashboard',
        },
        {
            href: '/dashboard/teachers',
            label: 'Teacher',
            active: pathname?.startsWith('/dashboard/teachers'),
        },
        {
            href: '/dashboard/students',
            label: 'Student',
            active: pathname?.startsWith('/dashboard/students'),
        },
        {
            href: '/dashboard/classroom',
            label: 'Class Room',
            active: pathname?.startsWith('/dashboard/classroom'),
        },
        {
            href: '/dashboard/admission',
            label: 'Admission',
            active: pathname?.startsWith('/dashboard/admission'),
        },
        {
            href: '/dashboard/updates',
            label: 'Updates Center',
            active: pathname?.startsWith('/dashboard/updates'),
        },
        {
            href: '/dashboard/admin',
            label: 'Administrator',
            active: pathname?.startsWith('/dashboard/admin'),
        },
    ]

    return (
        <nav
            className={cn('flex items-center space-x-4 md:space-x-8 overflow-x-auto scrollbar-hide px-1', className)}
            style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
            {...props}
        >
            {routes.map((route) => (
                <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                        'text-sm md:text-md font-medium transition-colors hover:text-primary pb-2 border-b-2 px-2 md:p-2 whitespace-nowrap',
                        route.active
                            ? 'text-[#4285F4] border-[#4285F4]'
                            : 'text-[#303030] border-transparent'
                    )}
                >
                    {route.label}
                </Link>
            ))}
        </nav>
    )
}
