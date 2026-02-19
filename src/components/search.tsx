
'use client'

import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function SearchComponent() {
    return (
        <Button variant="ghost" size="icon" className="text-[#303030]">
            <Search className="h-10 w-10" />
        </Button>
    )
}
