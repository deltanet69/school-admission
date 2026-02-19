import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, User, Phone, Mail, School, MapPin, Calendar, Briefcase, FileText, Heart, Activity } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabaseClient"
import { Admission } from "@/types"
import { notFound } from "next/navigation"
import { AdmissionActions } from "@/components/admission/admission-actions"
import { AdmissionDocumentList } from "@/components/admission/admission-document-list"

export const revalidate = 0

async function getAdmission(id: string): Promise<Admission | null> {
    const { data, error } = await supabase
        .from('admissions')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching admission:', error)
        return null
    }

    return data as Admission
}

export default async function AdmissionDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params
    const admission = await getAdmission(params.id)

    if (!admission) {
        notFound()
    }

    return (
        <div className="space-y-6 pb-20 mx-4 md:mx-8 lg:mx-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                    <Link href="/dashboard/admission">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">{admission.applicant_name}</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-muted-foreground text-sm">Applied for:</span>
                            <span className="font-semibold text-primary">{admission.program_selection || "N/A"}</span>
                            <span className="mx-2 text-gray-300">|</span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize 
                                ${admission.status === 'approved' ? 'bg-green-100 text-green-800' :
                                    admission.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                        'bg-yellow-100 text-yellow-800'}`}>
                                {admission.status}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content - Left 2 Columns */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Student Profile Section */}
                    <Card>
                        <CardHeader className="bg-gray-50/50 border-b">
                            <CardTitle className="flex items-center text-lg">
                                <User className="mr-2 h-5 w-5 text-primary" /> Student Profile
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Full Name</label>
                                    <p className="font-medium text-gray-900 mt-1">{admission.applicant_name}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Preferred Name</label>
                                    <p className="font-medium text-gray-900 mt-1">{admission.preferred_name || "-"}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Date of Birth</label>
                                    <p className="font-medium text-gray-900 mt-1">
                                        {admission.place_of_birth}, {admission.date_of_birth ? new Date(admission.date_of_birth).toLocaleDateString() : "-"}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Gender</label>
                                    <p className="font-medium text-gray-900 mt-1">{admission.gender || "-"}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Religion</label>
                                    <p className="font-medium text-gray-900 mt-1">{admission.religion || "-"}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Nationality</label>
                                    <p className="font-medium text-gray-900 mt-1">{admission.nationality || "-"}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Siblings</label>
                                    <p className="font-medium text-gray-900 mt-1">{admission.siblings_count !== undefined ? admission.siblings_count : "-"}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Family Data Section */}
                    <Card>
                        <CardHeader className="bg-gray-50/50 border-b">
                            <CardTitle className="flex items-center text-lg">
                                <Users className="mr-2 h-5 w-5 text-primary" /> Family Data
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Parent/Guardian Name</label>
                                    <p className="font-medium text-gray-900 mt-1">{admission.parent_name || "-"}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Email</label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium text-gray-900">{admission.parent_email || admission.email || "-"}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Phone (WA)</label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium text-gray-900">{admission.parent_phone || admission.phone || "-"}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Occupation</label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium text-gray-900">{admission.parent_occupation || "-"}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Monthly Income</label>
                                    <p className="font-medium text-gray-900 mt-1">{admission.monthly_income || "-"}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Additional Info Section */}
                    <Card>
                        <CardHeader className="bg-gray-50/50 border-b">
                            <CardTitle className="flex items-center text-lg">
                                <Activity className="mr-2 h-5 w-5 text-primary" /> Additional Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-6">
                                <div>
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Extracurricular Interests</label>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {admission.extracurricular_interests && admission.extracurricular_interests.length > 0 ? (
                                            admission.extracurricular_interests.map((interest, i) => (
                                                <span key={i} className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-sm font-medium border border-blue-100">
                                                    {interest}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-muted-foreground italic">None selected</span>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                                        Special Needs / Medical
                                        {admission.special_needs && admission.special_needs.length > 0 && (
                                            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                                        )}
                                    </label>
                                    <div className="mt-2 text-sm">
                                        {admission.special_needs && admission.special_needs.length > 0 ? (
                                            <div className="p-3 bg-red-50 border border-red-100 rounded-md text-red-800">
                                                <p className="font-semibold mb-1">Marked Conditions:</p>
                                                <ul className="list-disc list-inside">
                                                    {admission.special_needs.map((need, i) => (
                                                        <li key={i}>{need}</li>
                                                    ))}
                                                </ul>
                                                {admission.special_needs_note && (
                                                    <div className="mt-2 pt-2 border-t border-red-200 text-red-700">
                                                        <span className="font-semibold">Note:</span> {admission.special_needs_note}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-gray-900">No special needs or medical conditions declared.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submitted Documents Section */}
                    <Card>
                        <CardHeader className="bg-gray-50/50 border-b">
                            <CardTitle className="flex items-center text-lg">
                                <FileText className="mr-2 h-5 w-5 text-primary" /> Submitted Documents
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <AdmissionDocumentList documents={admission.documents || undefined} />
                        </CardContent>
                    </Card>

                    {/* Survey & Consents Section */}
                    <Card>
                        <CardHeader className="bg-gray-50/50 border-b">
                            <CardTitle className="flex items-center text-lg">
                                <School className="mr-2 h-5 w-5 text-primary" /> Survey & Consents
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Referral Source</label>
                                    <p className="font-medium text-gray-900 mt-1">{admission.referral_source || "Not specified"}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Declaration Agreement</label>
                                    <div className={`mt-1 flex items-center gap-2 font-medium ${admission.declaration_agreed ? 'text-green-600' : 'text-red-600'}`}>
                                        {admission.declaration_agreed ? (
                                            <>
                                                <div className="h-4 w-4 rounded-full bg-green-100 flex items-center justify-center border border-green-200">
                                                    <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                                Agreed to Terms & Policies
                                            </>
                                        ) : (
                                            "Not Agreed"
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar - Right Column */}
                <div className="space-y-6">
                    {/* Admin Console */}
                    <AdmissionActions admission={admission} />

                    {/* Meta Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Application Meta</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-muted-foreground">Submission Date</span>
                                <span className="font-medium">{new Date(admission.submission_date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-100 items-center">
                                <span className="text-muted-foreground">Payment Status</span>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize 
                                    ${admission.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                                        admission.payment_status === 'failed' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'}`}>
                                    {admission.payment_status || 'Pending'}
                                </span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span className="text-muted-foreground">Application ID</span>
                                <span className="font-medium text-xs text-right truncate w-24" title={admission.id}>{admission.id.substring(0, 8)}...</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}


function Users(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    )
}
