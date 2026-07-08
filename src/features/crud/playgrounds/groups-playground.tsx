import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { Plus, Pencil, Trash2, Shield, Settings, Eye } from "lucide-react"

import { DataTable } from "@/components/global/data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { confirmModal } from "@/lib/client/confirm-modal"
import { logAudit } from "@/lib/server/audit-action"
import { mockRoles, mockPermissions, rolePermissionMap } from "@/features/crud/_data/rbac-mock-data"
import type { Role } from "@/features/crud/_data/rbac-types"
import { RESOURCES } from "@/features/crud/_data/rbac-types"

type GroupForm = { name: string; description: string }

// ─── Permission cards (kime-warehouse style) ──────────────────────
function PermissionSection({
  selected,
  onChange,
}: {
  selected: string[]
  onChange: (permIds: string[]) => void
}) {
  const [expanded, setExpanded] = useState<string | null>(null)

  const toggle = (permId: string) => {
    onChange(selected.includes(permId)
      ? selected.filter((id) => id !== permId)
      : [...selected, permId]
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Eye className="size-4 text-muted-foreground" />
        <Label className="text-sm font-semibold">Module yang Bisa Diakses</Label>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {RESOURCES.map((resource) => {
          const resourcePerms = mockPermissions.filter((p) => p.resource === resource)
          const hasAnySelected = resourcePerms.some((p) => selected.includes(p.id))

          return (
            <div
              key={resource}
              className="rounded-xl border border-border/60 bg-card p-3 space-y-2 cursor-pointer transition-all hover:bg-muted/20"
            >
              <div className="flex items-center gap-2">
                <Checkbox
                  id={`mod-${resource}`}
                  checked={hasAnySelected}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onChange([...selected, ...resourcePerms.map((p) => p.id)])
                    } else {
                      onChange(selected.filter((pid) => !resourcePerms.some((rp) => rp.id === pid)))
                    }
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
                <Label className="text-sm font-medium cursor-pointer flex-1" onClick={(e) => e.stopPropagation()}>
                  {resource}
                </Label>
                <Button
                  type="button"
                  size="icon"
                  variant={expanded === resource ? "secondary" : "ghost"}
                  className="size-7"
                  onClick={(e) => {
                    e.stopPropagation()
                    setExpanded((prev) => (prev === resource ? null : resource))
                  }}
                  title={`Atur permission ${resource}`}
                >
                  <Settings className="size-3.5" />
                </Button>
              </div>

              {expanded === resource && (
                <div className="space-y-1.5 border-t border-border/40 pt-2" onClick={(e) => e.stopPropagation()}>
                  {resourcePerms.map((perm) => {
                    return (
                      <div
                        key={perm.id}
                        onClick={() => toggle(perm.id)}
                        className="flex items-center gap-2 px-1 py-0.5 rounded hover:bg-muted/50 cursor-pointer transition-colors"
                      >
                        <Checkbox
                          id={perm.id}
                          checked={selected.includes(perm.id)}
                          onCheckedChange={() => toggle(perm.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <Label className="text-xs cursor-pointer flex-1">{perm.action.toUpperCase()}</Label>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Groups CRUD ──────────────────────────────────────────────────
export function GroupsPlayground() {
  const [groups, setGroups] = useState<Role[]>(mockRoles)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Role | null>(null)
  const [form, setForm] = useState<GroupForm>({ name: "", description: "" })
  const [selectedPerms, setSelectedPerms] = useState<string[]>([])

  const openAdd = () => {
    setEditing(null)
    setForm({ name: "", description: "" })
    setSelectedPerms([])
    setDialogOpen(true)
  }

  const openEdit = (group: Role) => {
    setEditing(group)
    setForm({ name: group.name, description: group.description })
    setSelectedPerms(rolePermissionMap[group.id] ?? [])
    setDialogOpen(true)
  }

  const handleDelete = async (group: Role) => {
    const ok = await confirmModal(`Hapus group "${group.name}"?`, {
      title: "Hapus Group", confirmText: "Ya, Hapus", cancelText: "Batal", destructive: true,
    })
    if (!ok) return
    setGroups((prev) => prev.filter((g) => g.id !== group.id))
    toast.success(`Group "${group.name}" berhasil dihapus.`)
    logAudit({ data: { actionName: "role.delete", module: "Roles", operation: "delete", actorName: null, status: "SUCCESS", payload: { groupId: group.id, groupName: group.name } } })
  }

  const handleSave = () => {
    if (!form.name.trim()) { toast.error("Nama group harus diisi."); return }

    if (editing) {
      setGroups((prev) =>
        prev.map((g) =>
          g.id === editing.id ? { ...g, name: form.name.trim(), description: form.description.trim() } : g
        )
      )
      toast.success(`Group "${form.name}" berhasil diperbarui.`)
      logAudit({ data: { actionName: "role.update", module: "Roles", operation: "update", actorName: null, status: "SUCCESS", payload: { groupId: editing.id, groupName: form.name } } })
    } else {
      const newGroup: Role = {
        id: `role-${crypto.randomUUID().slice(0, 6)}`,
        name: form.name.trim(),
        description: form.description.trim(),
        userCount: 0,
        createdAt: new Date().toISOString().slice(0, 10),
      }
      setGroups((prev) => [...prev, newGroup])
      toast.success(`Group "${form.name}" berhasil ditambahkan.`)
      logAudit({ data: { actionName: "role.create", module: "Roles", operation: "create", actorName: null, status: "SUCCESS", payload: { groupId: newGroup.id, groupName: newGroup.name } } })
    }
    setDialogOpen(false)
  }

  const columns: Array<ColumnDef<Role>> = [
    { accessorKey: "name", header: "Group Name" },
    { accessorKey: "description", header: "Description" },
    {
      id: "permissions",
      header: "Permissions",
      cell: ({ row }) => {
        const roleId = row.original.id
        const count = (rolePermissionMap[roleId] ?? []).length
        return <Badge variant="secondary">{count} permissions</Badge>
      },
    },
    { accessorKey: "userCount", header: "Members" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-1">
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
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="size-5 text-muted-foreground" />
          <div>
            <h3 className="text-lg font-semibold">Group Access</h3>
            <p className="text-sm text-muted-foreground">{groups.length} group terdaftar.</p>
          </div>
        </div>
        <Button onClick={openAdd} className="gap-1.5">
          <Plus className="size-4" /> Tambah Group
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={groups}
        searchPlaceholder="Cari group..."
        emptyMessage="Tidak ada group."
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Group Access" : "Tambah Group Access"}</DialogTitle>
            <DialogDescription>
              {editing ? `Atur group "${editing.name}" dan permission-nya.` : "Buat group baru dengan permission."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Group</Label>
                <Input id="name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Contoh: Super Admin, Manager, Staff" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Input id="description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Deskripsi group..." />
              </div>
            </div>

            <PermissionSection selected={selectedPerms} onChange={setSelectedPerms} />
          </div>

          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Batal</Button></DialogClose>
            <Button onClick={handleSave}>{editing ? "Simpan" : "Tambah"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}
