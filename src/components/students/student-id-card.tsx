"use client"

import { Student } from "@/types"
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"
import { useRef, useState, useEffect } from "react"
import html2canvas from "html2canvas"

/* eslint-disable @next/next/no-img-element */

interface StudentIdCardProps {
    student: Student
}

export function StudentIdCard({ student }: StudentIdCardProps) {
    const cardRef = useRef<HTMLDivElement>(null)
    const [downloading, setDownloading] = useState(false)
    const [proxyProfileUrl, setProxyProfileUrl] = useState<string | null>(null)

    // Use Proxy URL or Base64 for local assets
    useEffect(() => {
        if (student.profile_picture) {
            // Use our own API proxy to fetch the image server-side and avoid CORS
            const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(student.profile_picture)}`
            setProxyProfileUrl(proxyUrl)
        }
    }, [student.profile_picture])

    const handleDownload = async () => {
        if (!cardRef.current) return

        setDownloading(true)
        try {
            // Wait for images to render
            await new Promise(resolve => setTimeout(resolve, 1000))

            const canvas = await html2canvas(cardRef.current, {
                useCORS: true,
                scale: 3,
                backgroundColor: null,
                logging: true,
                allowTaint: true,
                proxy: '/api/proxy-image',
            })

            const image = canvas.toDataURL("image/png")
            const link = document.createElement("a")
            link.href = image
            link.download = `ID-CARD-${student.name.replace(/\s+/g, '-')}.png`
            link.click()
        } catch (error) {
            console.error("Error downloading ID card:", error)
            alert("Failed to download card. Please check console.")
        } finally {
            setDownloading(false)
        }
    }

    return (
        <div className="flex flex-col items-center space-y-4">
            {/* Download Actions */}


            <p className="text-md text-muted-foreground text-center mb-4">
                Review the card before downloading.
            </p>

            <div className="w-full max-w-110 overflow-hidden flex justify-center relative">
                <div className="transform scale-[0.45] xs:scale-[0.55] sm:scale-75 md:scale-[0.60] lg:scale-100 origin-top h-[180px] xs:h-[220px] sm:h-[280px] md:h-[300px] lg:h-[350px]">
                    {/* Scale wrapper to fit mobile screens */}
                    <div
                        ref={cardRef}
                        // IMPORTANT: Using explicit inline styles for ALL colors to prevent html2canvas "unsupported color function" errors
                        // Do not use Tailwind classes for colors inside this ref if they resolve to complex vars
                        style={{
                            width: '600px',
                            height: '350px',
                            backgroundColor: '#ffffff',
                            position: 'relative',
                            overflow: 'hidden',
                            backgroundImage: `url('/cardbg.png')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            fontFamily: 'sans-serif',
                            color: '#1e293b',
                            flexShrink: 0,
                        }}
                    >
                        {/* Header Logo Area */}
                        <div style={{ position: 'absolute', top: '24px', left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 10 }}>
                            <img
                                src="/logo2.png"
                                alt="Horizon Academy"
                                style={{ height: '48px', objectFit: 'contain' }}
                            />
                        </div>

                        {/* Main Content Area */}
                        <div style={{
                            position: 'absolute',
                            top: '80px',
                            bottom: '50px',
                            left: '32px',
                            right: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '20px'
                        }}>
                            {/* Photo */}
                            <div style={{
                                width: '140px',
                                height: '150px',
                                backgroundColor: '#e5e7eb', // gray-200
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                flexShrink: 0,
                                overflow: 'hidden',
                                border: '2px solid #ffffff',
                                position: 'relative',
                                backgroundImage: `url(${proxyProfileUrl || student.profile_picture || ''})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat'
                            }}>
                                {!proxyProfileUrl && !student.profile_picture && (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', backgroundColor: '#f3f4f6', fontSize: '12px' }}>
                                        NO PHOTO
                                    </div>
                                )}
                            </div>

                            {/* Text Details - Using Table for consistent rendering in html2canvas */}
                            <div style={{
                                flex: 1,
                                fontSize: '14px',
                                fontWeight: 700, // Increased weight
                                paddingTop: '5px',
                                color: '#1e293b' // Slate-800
                            }}>
                                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                                    <tbody>
                                        <tr>
                                            <td style={{ width: '80px', verticalAlign: 'middle', textTransform: 'uppercase', color: '#475569', fontWeight: 600 }}>NAME</td>
                                            <td style={{ width: '15px', verticalAlign: 'middle', textAlign: 'center' }}>:</td>
                                            <td style={{ verticalAlign: 'middle', textTransform: 'uppercase', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: '180px', textOverflow: 'ellipsis' }}>{student.name}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ verticalAlign: 'middle', textTransform: 'uppercase', color: '#475569', fontWeight: 600 }}>NIS</td>
                                            <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>:</td>
                                            <td style={{ verticalAlign: 'middle', color: '#0f172a' }}>{student.nis}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ verticalAlign: 'middle', textTransform: 'uppercase', color: '#475569', fontWeight: 600 }}>D.O.B</td>
                                            <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>:</td>
                                            <td style={{ verticalAlign: 'middle', color: '#0f172a' }}>
                                                {student.date_of_birth ? new Date(student.date_of_birth).toLocaleDateString('en-GB') : '-'}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ verticalAlign: 'middle', textTransform: 'uppercase', color: '#475569', fontWeight: 600 }}>GRADE</td>
                                            <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>:</td>
                                            <td style={{ verticalAlign: 'middle', textTransform: 'uppercase', color: '#0f172a' }}>{student.grade}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ verticalAlign: 'top', textTransform: 'uppercase', color: '#475569', fontWeight: 600, paddingTop: '4px' }}>ADDRESS</td>
                                            <td style={{ verticalAlign: 'top', textAlign: 'center', paddingTop: '4px' }}>:</td>
                                            <td style={{ verticalAlign: 'top', textTransform: 'uppercase', color: '#0f172a', lineHeight: '1.25' }}>
                                                <div style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', maxHeight: '3em' }}>
                                                    {student.address || 'JAKARTA, DKI'}
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Footer */}
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '30px', display: 'flex' }}>
                            {/* Dark Blue Part */}
                            <div style={{ flex: 1, backgroundColor: '#1a1c4b', color: '#ffffff', fontSize: '10px', display: 'flex', alignItems: 'center', paddingLeft: '24px', paddingRight: '24px', gap: '16px' }}>
                                <span>horizon-academy.id</span>
                                <span>|</span>
                                <span>contact@horizon.id</span>
                                <span>|</span>
                                <span>08110028171</span>
                            </div>
                            {/* Yellow Part */}
                            <div style={{ width: '180px', backgroundColor: '#facc15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ color: '#1a1c4b', fontWeight: 'bold', fontSize: '14px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Student ID CARD</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-center w-full">
                <Button onClick={handleDownload} disabled={downloading} size="sm" variant="outline" className="gap-2">
                    {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                    {downloading ? "Generating..." : "Download PNG"}
                </Button>
            </div>


        </div>
    )
}
