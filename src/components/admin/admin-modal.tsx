"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Loader2, Plus } from "lucide-react"
import { createAdmin, updateAdmin, AdminInput } from "@/app/actions/admin"

interface Admin {
    id: string
    name: string
    email: string
    role: "Super Admin" | "Admin" | "Staff"
    status: "Active" | "Inactive"
}

interface AdminModalProps {
    admin?: Admin
    trigger?: React.ReactNode
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export function AdminModal({ admin, trigger, open, onOpenChange }: AdminModalProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    // Form state
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [role, setRole] = useState<"Super Admin" | "Admin" | "Staff">("Staff")
    const [status, setStatus] = useState<"Active" | "Inactive">("Active")
    const [password, setPassword] = useState("")

    // Sync internal open state with uncontrolled/controlled props
    useEffect(() => {
        if (open !== undefined) setIsOpen(open)
    }, [open])

    const handleOpenChange = (value: boolean) => {
        setIsOpen(value)
        if (onOpenChange) onOpenChange(value)
        if (!value) resetForm()
    }

    useEffect(() => {
        if (admin) {
            setName(admin.name)
            setEmail(admin.email)
            setRole(admin.role)
            setStatus(admin.status)
        } else {
            resetForm()
        }
    }, [admin])

    const resetForm = () => {
        if (!admin) {
            setName("")
            setEmail("")
            setRole("Staff")
            setStatus("Active")
            setPassword("")
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const input: AdminInput = {
            id: admin?.id,
            name,
            email,
            role,
            status,
            password: !admin ? password : undefined // Only send password for new admins
        }

        try {
            const result = admin
                ? await updateAdmin(input)
                : await createAdmin(input)

            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success(admin ? "Administrator updated" : "Administrator created")
                handleOpenChange(false)
            }
        } catch (error) {
            toast.error("An unexpected error occurred")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            {!trigger && !admin && (
                <DialogTrigger asChild>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Admin
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{admin ? "Edit Administrator" : "Add Administrator"}</DialogTitle>
                    <DialogDescription>
                        {admin ? "Update administrator details." : "Create a new administrator account."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="john@school.com"
                            required
                        />
                    </div>

                    {!admin && (
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="******"
                                required
                            />
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="role">Role</Label>
                            <Select value={role} onValueChange={(val: any) => setRole(val)}>
                                <SelectTrigger id="role">
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Super Admin">Super Admin</SelectItem>
                                    <SelectItem value="Admin">Admin</SelectItem>
                                    <SelectItem value="Staff">Staff</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="status">Status</Label>
                            <Select value={status} onValueChange={(val: any) => setStatus(val)}>
                                <SelectTrigger id="status">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Active">Active</SelectItem>
                                    <SelectItem value="Inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {admin ? "Save Changes" : "Create Admin"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
