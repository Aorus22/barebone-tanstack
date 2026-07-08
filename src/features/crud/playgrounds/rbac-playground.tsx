import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { Plus, Pencil, Trash2 } from "lucide-react"

import { DataTable } from "@/components/global/data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { confirmModal } from "@/lib/client/confirm-modal"
import {
  mockRoles, mockPermissions, mockAssignments,
} from "@/features/crud/_data/rbac-mock-data"
import type { Role, Permission, RoleAssignment } from "@/features/crud/_data/rbac-types"
import { RESOURCES, ACTIONS } from "@/features/crud/_data/rbac-types"

// ─── Role CRUD ───────────────────────────────────────────────────
type RoleForm = { name: string; description: string }
const emptyRole: RoleForm = { name: "", description: "" }

function RolesSection({ roles, setRoles }: {
  roles: Role[]
  setRoles: React.Dispatch<React.SetStateAction<Role[]>>
}) {
  const [open, setOpen] = useState(false)
  const [edit, setEdit] = useState<Role | null>(null)
  const [form, setForm] = useState<RoleForm>(emptyRole)

  const openAdd = () => { setEdit(null); setForm(emptyRole); setOpen(true) }
  const openEdit = (r: Role) => { setEdit(r); setForm({ name: r.name, description: r.description }); setOpen(true) }

  const handleDelete = async (r: Role) => {
    const ok = await confirmModal(`Hapus role "${r.name}"?`, { title: "Hapus Role", confirmText: "Ya, Hapus", cancelText: "Batal", destructive: true })
    if (!ok) return
    setRoles((prev) => prev.filter((x) => x.id !== r.id))
    toast.success(`Role "${r.name}" berhasil dihapus.`)
  }

  const handleSave = () => {
    if (!form.name.trim()) { toast.error("Nama role harus diisi."); return }
    if (edit) {
      setRoles((prev) => prev.map((x) => x.id === edit.id ? { ...x, name: form.name.trim(), description: form.description.trim() } : x))
      toast.success(`Role "${form.name}" berhasil diperbarui.`)
    } else {
      setRoles((prev) => [...prev, { id: `role-${crypto.randomUUID().slice(0, 6)}`, name: form.name.trim(), description: form.description.trim(), userCount: 0, createdAt: new Date().toISOString().slice(0, 10) }])
      toast.success(`Role "${form.name}" berhasil ditambahkan.`)
    }
    setOpen(false)
  }

  const columns: Array<ColumnDef<Role>> = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "description", header: "Description" },
    { accessorKey: "userCount", header: "Users" },
    {
      id: "actions", header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => openEdit(row.original)}><Pencil className="size-3.5" /></Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(row.original)}><Trash2 className="size-3.5 text-destructive" /></Button>
        </div>
      ),
    },
  ]

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h3 className="text-lg font-semibold">Roles</h3><p className="text-sm text-muted-foreground">{roles.length} role terdaftar.</p></div>
        <Button onClick={openAdd} className="gap-1.5"><Plus className="size-4" />Tambah Role</Button>
      </div>
      <DataTable columns={columns} data={roles} searchPlaceholder="Cari role..." emptyMessage="Tidak ada role." />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{edit ? "Edit Role" : "Tambah Role"}</DialogTitle><DialogDescription>{edit ? `Memperbarui role "${edit.name}".` : "Menambahkan role baru."}</DialogDescription></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium">Nama Role</label>
              <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Contoh: Super Admin" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium">Deskripsi</label>
              <Input value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Deskripsi role..." />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Batal</Button></DialogClose>
            <Button onClick={handleSave}>{edit ? "Simpan" : "Tambah"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}

// ─── Permission CRUD ──────────────────────────────────────────────
type PermissionForm = { resource: string; action: string; description: string }
const emptyPerm: PermissionForm = { resource: "Users", action: "read", description: "" }

function PermissionsSection({ permissions, setPermissions }: {
  permissions: Permission[]
  setPermissions: React.Dispatch<React.SetStateAction<Permission[]>>
}) {
  const [open, setOpen] = useState(false)
  const [edit, setEdit] = useState<Permission | null>(null)
  const [form, setForm] = useState<PermissionForm>(emptyPerm)

  const openAdd = () => { setEdit(null); setForm(emptyPerm); setOpen(true) }
  const openEdit = (p: Permission) => { setEdit(p); setForm({ resource: p.resource, action: p.action, description: p.description }); setOpen(true) }

  const handleDelete = async (p: Permission) => {
    const ok = await confirmModal(`Hapus permission ${p.resource}:${p.action}?`, { title: "Hapus Permission", confirmText: "Ya, Hapus", cancelText: "Batal", destructive: true })
    if (!ok) return
    setPermissions((prev) => prev.filter((x) => x.id !== p.id))
    toast.success("Permission berhasil dihapus.")
  }

  const handleSave = () => {
    if (!form.description.trim()) { toast.error("Deskripsi harus diisi."); return }
    if (edit) {
      setPermissions((prev) => prev.map((x) => x.id === edit.id ? { ...x, resource: form.resource, action: form.action as Permission["action"], description: form.description.trim() } : x))
      toast.success("Permission berhasil diperbarui.")
    } else {
      setPermissions((prev) => [...prev, { id: `perm-${crypto.randomUUID().slice(0, 6)}`, resource: form.resource, action: form.action as Permission["action"], description: form.description.trim() }])
      toast.success("Permission berhasil ditambahkan.")
    }
    setOpen(false)
  }

  const columns: Array<ColumnDef<Permission>> = [
    { accessorKey: "resource", header: "Resource" },
    { accessorKey: "action", header: "Action" },
    { accessorKey: "description", header: "Description" },
    {
      id: "actions", header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => openEdit(row.original)}><Pencil className="size-3.5" /></Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(row.original)}><Trash2 className="size-3.5 text-destructive" /></Button>
        </div>
      ),
    },
  ]

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h3 className="text-lg font-semibold">Permissions</h3><p className="text-sm text-muted-foreground">{permissions.length} permission terdaftar.</p></div>
        <Button onClick={openAdd} className="gap-1.5"><Plus className="size-4" />Tambah Permission</Button>
      </div>
      <DataTable columns={columns} data={permissions} searchPlaceholder="Cari permission..." emptyMessage="Tidak ada permission." />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{edit ? "Edit Permission" : "Tambah Permission"}</DialogTitle><DialogDescription>{edit ? "Memperbarui permission." : "Menambahkan permission baru."}</DialogDescription></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium">Resource</label>
              <Select value={form.resource} onValueChange={(v) => setForm((f) => ({ ...f, resource: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{RESOURCES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium">Action</label>
              <Select value={form.action} onValueChange={(v) => setForm((f) => ({ ...f, action: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{ACTIONS.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium">Deskripsi</label>
              <Input value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Deskripsi permission..." />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Batal</Button></DialogClose>
            <Button onClick={handleSave}>{edit ? "Simpan" : "Tambah"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}

// ─── Assignment CRUD ─────────────────────────────────────────────
function AssignmentsSection({ assignments, setAssignments, roles }: {
  assignments: RoleAssignment[]
  setAssignments: React.Dispatch<React.SetStateAction<RoleAssignment[]>>
  roles: Role[]
}) {
  const [open, setOpen] = useState(false)
  const [userName, setUserName] = useState("")
  const [roleId, setRoleId] = useState(roles[0]?.id ?? "")

  const handleDelete = async (a: RoleAssignment) => {
    const ok = await confirmModal(`Hapus assignment "${a.userName}" → ${a.roleName}?`, { title: "Hapus Assignment", confirmText: "Ya, Hapus", cancelText: "Batal", destructive: true })
    if (!ok) return
    setAssignments((prev) => prev.filter((x) => x.userId !== a.userId || x.roleId !== a.roleId))
    toast.success("Assignment berhasil dihapus.")
  }

  const handleAdd = () => {
    if (!userName.trim()) { toast.error("Nama user harus diisi."); return }
    if (!roleId) { toast.error("Pilih role."); return }
    const role = roles.find((r) => r.id === roleId)
    if (!role) return
    const newAssign: RoleAssignment = {
      userId: `usr-${crypto.randomUUID().slice(0, 6)}`,
      userName: userName.trim(),
      roleId,
      roleName: role.name,
      assignedAt: new Date().toISOString().slice(0, 10),
    }
    setAssignments((prev) => [...prev, newAssign])
    toast.success(`User "${userName.trim()}" ditugaskan ke role "${role.name}".`)
    setOpen(false)
    setUserName("")
  }

  const columns: Array<ColumnDef<RoleAssignment>> = [
    { accessorKey: "userName", header: "User" },
    { accessorKey: "roleName", header: "Role" },
    { accessorKey: "assignedAt", header: "Assigned At" },
    {
      id: "actions", header: "Actions",
      cell: ({ row }) => (
        <Button variant="ghost" size="icon" onClick={() => handleDelete(row.original)}><Trash2 className="size-3.5 text-destructive" /></Button>
      ),
    },
  ]

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h3 className="text-lg font-semibold">User-Role Assignments</h3><p className="text-sm text-muted-foreground">{assignments.length} assignment.</p></div>
        <Button onClick={() => { setUserName(""); setRoleId(roles[0]?.id ?? ""); setOpen(true) }} className="gap-1.5"><Plus className="size-4" />Tambah Assignment</Button>
      </div>
      <DataTable columns={columns} data={assignments} searchPlaceholder="Cari assignment..." emptyMessage="Tidak ada assignment." />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Tambah Assignment</DialogTitle><DialogDescription>Menugaskan user ke role tertentu.</DialogDescription></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium">Nama User</label>
              <Input value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Nama user..." />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium">Role</label>
              <Select value={roleId} onValueChange={setRoleId}>
                <SelectTrigger><SelectValue placeholder="Pilih role" /></SelectTrigger>
                <SelectContent>{roles.map((r) => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Batal</Button></DialogClose>
            <Button onClick={handleAdd}>Tambah</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}

// ─── Main Page ────────────────────────────────────────────────────
export function RbacPlayground() {
  const [roles, setRoles] = useState<Role[]>(mockRoles)
  const [permissions, setPermissions] = useState<Permission[]>(mockPermissions)
  const [assignments, setAssignments] = useState<RoleAssignment[]>(mockAssignments)

  return (
    <div className="space-y-10">
      <RolesSection roles={roles} setRoles={setRoles} />
      <PermissionsSection permissions={permissions} setPermissions={setPermissions} />
      <AssignmentsSection assignments={assignments} setAssignments={setAssignments} roles={roles} />
    </div>
  )
}
