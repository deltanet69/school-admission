"use client"

import { Button } from "@/components/ui/button"
import { Plus, Copy, Check } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"

export function AdmissionActions() {
    const [copied, setCopied] = useState(false)

    const handleCopyUrl = () => {
        const url = `${window.location.origin}/admission`
        navigator.clipboard.writeText(url)
        setCopied(true)
        toast.success("Admission URL copied to clipboard")

        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="flex items-center gap-2">
            <Button
                variant="outline"
                size="sm"
                className="h-9"
                onClick={handleCopyUrl}
            >
                {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                Copy URL
            </Button>
            <Link href="/admission" target="_blank">
                <Button size="sm" className="h-9 bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Application
                </Button>
            </Link>
        </div>
    )
}
