import { useState } from "react"
import { CheckCircle2, Clock, XCircle, Plus, Pencil, Trash2, Users } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/global/data-table"
import { mockUsers } from "@/features/crud/_data/users-mock-data"
import type { User } from "@/features/crud/_data/users-types"
import type { ColumnDef } from "@tanstack/react-table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { confirmModal } from "@/lib/client/confirm-modal"
import { logAudit } from "@/lib/server/audit-action"

type UserFormData = {
  name: string
  email: string
  role: string
  status: "Active" | "Inactive" | "Pending"
}

const emptyForm: UserFormData = { name: "", email: "", role: "Viewer", status: "Active" }

export function UsersPlayground() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [form, setForm] = useState<UserFormData>(emptyForm)

  const openAdd = () => {
    setEditingUser(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  const openEdit = (user: User) => {
    setEditingUser(user)
    setForm({ name: user.name, email: user.email, role: user.role, status: user.status })
    setDialogOpen(true)
  }

  const handleDelete = async (user: User) => {
    const confirmed = await confirmModal(
      `Hapus user "${user.name}"? Tindakan ini tidak bisa dibatalkan.`,
      { title: "Hapus User", confirmText: "Ya, Hapus", cancelText: "Batal", destructive: true }
    )
    if (!confirmed) return
    setUsers((prev) => prev.filter((u) => u.id !== user.id))
    logAudit({ data: { actionName: "user.delete", module: "Users", operation: "delete", actorName: null, status: "SUCCESS", payload: { userId: user.id, userName: user.name } } })
    toast.success(`User "${user.name}" berhasil dihapus.`)
  }

  const handleSave = () => {
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Nama dan Email harus diisi.")
      return
    }

    if (editingUser) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? { ...u, name: form.name.trim(), email: form.email.trim(), role: form.role, status: form.status }
            : u
        )
      )
      toast.success(`User "${form.name}" berhasil diperbarui.`)
      logAudit({ data: { actionName: "user.update", module: "Users", operation: "update", actorName: null, status: "SUCCESS", payload: { userId: editingUser.id, userName: form.name } } })
    } else {
      const newUser: User = {
        id: `usr-${crypto.randomUUID().slice(0, 6)}`,
        name: form.name.trim(),
        email: form.email.trim(),
        role: form.role,
        status: form.status,
        lastLogin: "-",
        createdAt: new Date().toISOString().slice(0, 10),
      }
      setUsers((prev) => [...prev, newUser])
      toast.success(`User "${form.name}" berhasil ditambahkan.`)
      logAudit({ data: { actionName: "user.create", module: "Users", operation: "create", actorName: null, status: "SUCCESS", payload: { userId: newUser.id, userName: newUser.name } } })
    }
    setDialogOpen(false)
  }

  const toggleStatus = (user: User) => {
    const next: User["status"] = user.status === "Active" ? "Inactive" : "Active"
    setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, status: next } : u)))
    toast.success(`Status "${user.name}" diubah ke ${next}.`)
    logAudit({ data: { actionName: "user.update-status", module: "Users", operation: "update", actorName: null, status: "SUCCESS", payload: { userId: user.id, userName: user.name, from: user.status, to: next } } })
  }

  const columns: Array<ColumnDef<User>> = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "role", header: "Role" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as User["status"]
        const statusConfig = {
          Active: { icon: CheckCircle2, className: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800" },
          Inactive: { icon: XCircle, className: "text-muted-foreground bg-muted/30 border-border" },
          Pending: { icon: Clock, className: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800" },
        }[status]
        const Icon = statusConfig.icon
        return (
          <button type="button" onClick={() => toggleStatus(row.original)} className="cursor-pointer">
            <Badge variant="outline" className={statusConfig.className}>
              <Icon className="size-3 mr-1" />
              {status}
            </Badge>
          </button>
        )
      },
    },
    { accessorKey: "lastLogin", header: "Last Login" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => openEdit(row.original)}>
            <Pencil className="size-3.5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(row.original)}>
            <Trash2 className="size-3.5 text-destructive" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="size-5 text-muted-foreground" />
          <div>
            <h3 className="text-lg font-semibold text-foreground">User Management</h3>
            <p className="text-sm text-muted-foreground">{users.length} user terdaftar.</p>
          </div>
        </div>
        <Button onClick={openAdd} className="gap-1.5">
          <Plus className="size-4" />
          Tambah User
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={users}
        searchPlaceholder="Cari user..."
        emptyMessage="Tidak ada user."
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingUser ? "Edit User" : "Tambah User"}</DialogTitle>
            <DialogDescription>
              {editingUser ? `Memperbarui data user "${editingUser.name}".` : "Menambahkan user baru ke sistem."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Nama</label>
              <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Nama lengkap" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Email</label>
              <Input value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="email@example.com" type="email" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Role</label>
              <Select value={form.role} onValueChange={(val) => setForm((f) => ({ ...f, role: val }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Super Admin", "Admin", "Editor", "Viewer", "Auditor"].map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Status</label>
              <Select value={form.status} onValueChange={(val) => setForm((f) => ({ ...f, status: val as User["status"] }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Batal</Button>
            </DialogClose>
            <Button onClick={handleSave}>{editingUser ? "Simpan" : "Tambah"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
