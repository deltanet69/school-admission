"use server"

import { supabase } from "@/lib/supabaseClient"
import { sendEmail } from "@/lib/email"
import { revalidatePath } from "next/cache"

export async function updateAdmissionStatus(
    admissionId: string,
    status: 'approved' | 'rejected',
    email: string,
    applicantName: string,
    reason?: string
) {
    try {
        // 1. Update DB
        const { error } = await supabase
            .from('admissions')
            .update({ status: status })
            .eq('id', admissionId)

        if (error) throw new Error(`Failed to update status: ${error.message}`)

        // 2. Send Email
        const subject = status === 'approved'
            ? "Congratulation! Admission Application APPROVED!"
            : "Unfortunetally! Your Application Was REJECTED!"

        const footer = `
            <div style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; font-size: 12px; color: #888;">
                <p>This is an automated message from Horizon Academy Admission System.</p>
                <p>&copy; ${new Date().getFullYear()} Horizon Academy. All rights reserved.</p>
            </div>
        `

        let html = ""

        if (status === 'approved') {
            html = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #16a34a;">Congratulation! Admission Application APPROVED!</h1>
                    <p>Dear <strong>${applicantName}</strong>,</p>
                    <p>We are pleased to inform you that your admission application has been <strong>APPROVED</strong>.</p>
                    
                    <div style="background-color: #f0fdf4; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 5px 0;"><strong>Application ID:</strong> ${admissionId}</p>
                        <p style="margin: 5px 0;"><strong>Student Name:</strong> ${applicantName}</p>
                    </div>

                    <h3>Next Steps:</h3>
                    <ol>
                        <li>Visit our administration office to complete your registration.</li>
                        <li>Bring your original documents for verification.</li>
                        <li>Collect your uniform and schedule.</li>
                    </ol>
                    
                    ${footer}
                </div>
            `
        } else {
            html = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #dc2626;">Unfortunetally! Your Application Was REJECTED!</h1>
                    <p>Dear <strong>${applicantName}</strong>,</p>
                    <p>We regret to inform you that your admission application to Horizon Academy was not successful at this time.</p>
                    
                    <div style="background-color: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 5px 0;"><strong>Application ID:</strong> ${admissionId}</p>
                        <p style="margin: 5px 0;"><strong>Student Name:</strong> ${applicantName}</p>
                        ${reason ? `<p style="margin: 5px 0;"><strong>Reason:</strong> ${reason}</p>` : ''}
                    </div>

                    <h3>What can you do?</h3>
                    <p>You may try to apply again in the next academic year or contact our support team for more details.</p>
                    
                    ${footer}
                </div>
            `
        }

        // 3. Auto-Register Student if Approved
        if (status === 'approved') {
            await createStudentFromAdmission(admissionId)
        }

        const emailResult = await sendEmail({
            to: email,
            subject: subject,
            html: html
        })

        if (!emailResult.success) {
            console.error("Email send failed:", emailResult.error)
        }

        revalidatePath('/dashboard/admission')
        revalidatePath(`/dashboard/admission/${admissionId}`)

        return {
            success: true,
            emailSent: emailResult.success,
            emailError: emailResult.success ? null : JSON.stringify(emailResult.error)
        }

    } catch (error: any) {
        console.error("Error updating admission status:", error)
        return { success: false, error: error.message }
    }
}

async function createStudentFromAdmission(admissionId: string) {
    try {
        // 1. Fetch Admission Data
        const { data: admission, error: fetchError } = await supabase
            .from('admissions')
            .select('*')
            .eq('id', admissionId)
            .single()

        if (fetchError || !admission) throw new Error("Admission not found")

        // 2. Map Program to Grade
        const programToGradeMap: Record<string, string> = {
            "Pre-school p1": "Pre-School 1",
            "Pre-school p2": "Pre-School 2",
            "Kindergarten K1": "Kindergarten 1",
            "Kindergarten K2": "Kindergarten 2"
        }

        const grade = programToGradeMap[admission.program_selection] || admission.program_selection

        // 3. Generate NIS (Registration Number)
        // Format: REG-YYYYMMDD-XXXX
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '')
        const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString()
        const nis = `REG-${dateStr}-${randomSuffix}`

        // 4. Insert into Students Table
        const { error: insertError } = await supabase
            .from('students')
            .insert([{
                name: admission.applicant_name,
                nis: nis,
                grade: grade, // Maps to Classroom Name
                place_of_birth: admission.place_of_birth,
                date_of_birth: admission.date_of_birth,
                gender: admission.gender,
                // religion: admission.religion, // Column missing in students table
                parent_name: admission.parent_name,
                parent_email: admission.parent_email,
                parent_phone: admission.parent_phone,
                email: admission.email, // Might be parent's email if not distinct
                phone: admission.phone,
                status: 'active',
                enrollment_year: new Date().getFullYear().toString(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }])

        if (insertError) {
            console.error("Failed to auto-register student:", insertError)
            throw new Error(`Auto-registration failed: ${insertError.message}`)
        } else {
            console.log(`Auto-registered student: ${admission.applicant_name} (${nis}) to ${grade}`)
        }

    } catch (error) {
        console.error("Error in createStudentFromAdmission:", error)
        throw error // Re-throw to inform the caller
    }
}
