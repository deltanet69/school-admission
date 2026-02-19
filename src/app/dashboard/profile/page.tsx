'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/auth-helpers-nextjs'
import { User } from '@supabase/supabase-js'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Loader2, Save, KeyRound, UserCircle, ShieldCheck, Upload, X } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface AdminProfile {
    id: string
    name: string
    email: string
    role: string
    status: string
    avatar_url?: string
    created_at: string
}

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<AdminProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [changingPassword, setChangingPassword] = useState(false)

    const [name, setName] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const router = useRouter()

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    useEffect(() => {
        const load = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session?.user) { setLoading(false); return }
            setUser(session.user)

            const { data } = await supabase
                .from('admins')
                .select('*')
                .eq('email', session.user.email)
                .single()

            if (data) {
                setProfile(data)
                setName(data.name)
            }
            setLoading(false)
        }
        load()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true)
            const file = e.target.files?.[0]
            if (!file || !profile) return

            const fileExt = file.name.split('.').pop()
            const fileName = `${profile.id}-${Math.random()}.${fileExt}`
            const filePath = `${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('admin-avatars')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            const { data } = supabase.storage.from('admin-avatars').getPublicUrl(filePath)

            // Update profile with new avatar URL
            const { error: updateError } = await supabase
                .from('admins')
                .update({ avatar_url: data.publicUrl, updated_at: new Date().toISOString() })
                .eq('id', profile.id)

            if (updateError) throw updateError

            setProfile(prev => prev ? { ...prev, avatar_url: data.publicUrl } : null)
            toast.success('Foto profil berhasil diperbarui!')
            router.refresh()
        } catch (error: any) {
            console.error("Upload failed:", error)
            toast.error(`Gagal upload foto: ${error.message}`)
        } finally {
            setUploading(false)
        }
    }

    const handleDeleteAvatar = async () => {
        if (!profile || !profile.avatar_url) return

        try {
            setUploading(true)

            // Extract file path from URL if needed, or just update DB to null
            // For simplicity, we just unlink it from the DB profile. 
            // Ideally we should delete from storage too if we parse the path.

            const { error } = await supabase
                .from('admins')
                .update({ avatar_url: null, updated_at: new Date().toISOString() })
                .eq('id', profile.id)

            if (error) throw error

            setProfile(prev => prev ? { ...prev, avatar_url: undefined } : null)
            toast.success('Foto profil dihapus!')
            router.refresh()
        } catch (error: any) {
            toast.error(`Gagal menghapus foto: ${error.message}`)
        } finally {
            setUploading(false)
        }
    }

    const handleSaveName = async () => {
        if (!profile) return
        setSaving(true)
        const { error } = await supabase
            .from('admins')
            .update({ name, updated_at: new Date().toISOString() })
            .eq('id', profile.id)

        if (error) {
            toast.error('Gagal menyimpan: ' + error.message)
        } else {
            toast.success('Nama berhasil diperbarui!')
            setProfile(prev => prev ? { ...prev, name } : null)
            router.refresh()
        }
        setSaving(false)
    }

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            toast.error('Password tidak cocok!')
            return
        }
        if (newPassword.length < 8) {
            toast.error('Password minimal 8 karakter!')
            return
        }
        setChangingPassword(true)
        const { error } = await supabase.auth.updateUser({ password: newPassword })
        if (error) {
            toast.error('Gagal mengubah password: ' + error.message)
        } else {
            toast.success('Password berhasil diubah!')
            setNewPassword('')
            setConfirmPassword('')
        }
        setChangingPassword(false)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-[#4285F4]" />
            </div>
        )
    }

    if (!user || !profile) {
        return (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
                Tidak dapat memuat profil. Pastikan Anda sudah login.
            </div>
        )
    }

    const initials = profile.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    const joinDate = new Date(profile.created_at).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric'
    })

    return (
        <div className="mx-4 md:mx-8 lg:mx-20 space-y-6 animate-in fade-in duration-500">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Profil Akun</h2>
                <p className="text-muted-foreground">Kelola informasi akun administrator Anda.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column: Avatar & Basic Info */}
                <Card className="md:col-span-1">
                    <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
                        <div className="relative group">
                            <div className="h-40 w-40 rounded-full overflow-hidden border-4 border-[#4285F4]/10 bg-gray-100 flex items-center justify-center">
                                {profile.avatar_url ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={profile.avatar_url} alt={profile.name} className="h-full w-full object-cover" />
                                ) : (
                                    <span className="text-4xl font-bold text-[#4285F4]">{initials}</span>
                                )}
                            </div>

                            {/* Hover Overlay for Upload */}
                            <label className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                {uploading ? <Loader2 className="h-8 w-8 text-white animate-spin" /> : <Upload className="h-8 w-8 text-white" />}
                                <span className="text-xs text-white mt-1 font-medium">Ubah Foto</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleUpload}
                                    disabled={uploading}
                                />
                            </label>

                            {/* Delete Button (only if avatar exists) */}
                            {profile.avatar_url && (
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-0 right-0 h-8 w-8 rounded-full shadow-md z-10"
                                    onClick={handleDeleteAvatar}
                                    disabled={uploading}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>

                        <div className="space-y-1 w-full">
                            <h3 className="text-xl font-bold truncate" title={profile.name}>{profile.name}</h3>
                            <p className="text-sm text-muted-foreground truncate" title={user.email}>{user.email}</p>
                        </div>

                        <div className="flex flex-wrap gap-2 justify-center w-full">
                            <Badge variant="secondary" className="flex items-center gap-1">
                                <ShieldCheck className="h-3 w-3" />
                                {profile.role}
                            </Badge>
                            <Badge
                                className={profile.status === 'Active'
                                    ? 'bg-green-100 text-green-700 hover:bg-green-100'
                                    : 'bg-red-100 text-red-700 hover:bg-red-100'
                                }
                            >
                                {profile.status}
                            </Badge>
                        </div>

                        <Separator className="w-full" />

                        <div className="text-xs text-muted-foreground">
                            Bergabung sejak<br />
                            <span className="font-medium text-foreground">{joinDate}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Right Column: Edit Forms */}
                <div className="md:col-span-2 space-y-6">
                    {/* Edit Identity */}
                    <Card>
                        <CardContent className="pt-6 space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                                <UserCircle className="h-5 w-5 text-[#4285F4]" />
                                <h3 className="font-semibold text-lg">Identitas Diri</h3>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="name">Nama Lengkap</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Nama lengkap Anda"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" value={user.email || ''} disabled className="bg-muted text-muted-foreground" />
                                <p className="text-[10px] text-muted-foreground">Email terdaftar tidak dapat diubah.</p>
                            </div>

                            <div className="pt-2 flex justify-end">
                                <Button
                                    onClick={handleSaveName}
                                    disabled={saving || name === profile.name}
                                    className="bg-[#4285F4] hover:bg-[#3367d6]"
                                >
                                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                    Simpan Perubahan
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Change Password */}
                    <Card>
                        <CardContent className="pt-6 space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                                <KeyRound className="h-5 w-5 text-[#4285F4]" />
                                <h3 className="font-semibold text-lg">Keamanan Akun</h3>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="new-password">Password Baru</Label>
                                <Input
                                    id="new-password"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Minimal 8 karakter"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">Konfirmasi Password</Label>
                                <Input
                                    id="confirm-password"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Ulangi password baru"
                                />
                            </div>

                            <div className="pt-2 flex justify-end">
                                <Button
                                    onClick={handleChangePassword}
                                    disabled={changingPassword || !newPassword || !confirmPassword}
                                    variant="outline"
                                    className="border-[#4285F4] text-[#4285F4] hover:bg-[#4285F4] hover:text-white"
                                >
                                    {changingPassword ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <KeyRound className="mr-2 h-4 w-4" />}
                                    Ubah Password
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
