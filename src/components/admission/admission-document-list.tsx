"use client"

import { Button } from "@/components/ui/button"
import { FileText, Download, Eye } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"

interface AdmissionDocumentListProps {
    documents: Record<string, string | null> | undefined
}

export function AdmissionDocumentList({ documents }: AdmissionDocumentListProps) {
    const [downloading, setDownloading] = useState<string | null>(null)

    const handleDownload = async (url: string, filename: string) => {
        try {
            setDownloading(url)
            const response = await fetch(url)
            if (!response.ok) throw new Error("Download failed")

            const blob = await response.blob()
            const blobUrl = window.URL.createObjectURL(blob)

            const link = document.createElement('a')
            link.href = blobUrl
            link.download = filename
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(blobUrl)

            toast.success(`Downloaded ${filename}`)
        } catch (error) {
            console.error("Download error:", error)
            toast.error(`Failed to download ${filename}`)
        } finally {
            setDownloading(null)
        }
    }

    if (!documents || Object.keys(documents).length === 0) {
        return (
            <div className="text-center py-6 text-muted-foreground">
                <FileText className="h-10 w-10 mx-auto mb-2 opacity-20" />
                <p>No documents uploaded.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(documents).map(([key, url]) => {
                if (!url) return null;
                const label = key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
                // Extract extension from URL if possible, or default to generic
                const extension = url.split('.').pop()?.split('?')[0] || 'file';
                const filename = `${label}.${extension}`;

                return (
                    <div key={key} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center text-blue-600">
                                <FileText className="h-5 w-5" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate" title={label}>{label}</p>
                                <p className="text-xs text-muted-foreground truncate">Document uploaded</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Link href={url} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" size="icon" className="h-8 w-8" title="View">
                                    <Eye className="h-4 w-4" />
                                </Button>
                            </Link>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                title="Download"
                                onClick={() => handleDownload(url, filename)}
                                disabled={downloading === url}
                            >
                                <Download className={`h-4 w-4 ${downloading === url ? 'animate-pulse' : ''}`} />
                            </Button>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
