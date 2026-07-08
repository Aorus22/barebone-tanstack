import type { User } from "./users-types"

export const mockUsers: User[] = [
  { id: "usr-001", name: "Alice Wijaya", email: "alice@example.com", role: "Super Admin", status: "Active", lastLogin: "2024-12-01 09:15", createdAt: "2024-01-15" },
  { id: "usr-002", name: "Bob Santoso", email: "bob@example.com", role: "Super Admin", status: "Active", lastLogin: "2024-12-02 14:30", createdAt: "2024-01-16" },
  { id: "usr-003", name: "Charlie Lim", email: "charlie@example.com", role: "Admin", status: "Active", lastLogin: "2024-12-03 11:00", createdAt: "2024-01-20" },
  { id: "usr-004", name: "Dewi Putri", email: "dewi@example.com", role: "Admin", status: "Active", lastLogin: "2024-12-04 08:45", createdAt: "2024-02-01" },
  { id: "usr-005", name: "Eko Prasetyo", email: "eko@example.com", role: "Editor", status: "Active", lastLogin: "2024-12-04 16:20", createdAt: "2024-02-05" },
  { id: "usr-006", name: "Fitri Handayani", email: "fitri@example.com", role: "Editor", status: "Inactive", lastLogin: "2024-11-20 10:10", createdAt: "2024-02-10" },
  { id: "usr-007", name: "Gunawan Saputra", email: "gunawan@example.com", role: "Viewer", status: "Active", lastLogin: "2024-12-05 07:30", createdAt: "2024-02-20" },
  { id: "usr-008", name: "Hana Susanti", email: "hana@example.com", role: "Viewer", status: "Pending", lastLogin: "-", createdAt: "2024-12-05" },
  { id: "usr-009", name: "Indra Wijaya", email: "indra@example.com", role: "Auditor", status: "Active", lastLogin: "2024-12-03 13:00", createdAt: "2024-03-05" },
  { id: "usr-010", name: "Joko Widodo", email: "joko@example.com", role: "Editor", status: "Active", lastLogin: "2024-12-04 15:45", createdAt: "2024-03-10" },
  { id: "usr-011", name: "Kartini Sari", email: "kartini@example.com", role: "Viewer", status: "Inactive", lastLogin: "2024-10-15 09:00", createdAt: "2024-03-15" },
  { id: "usr-012", name: "Lestari Dewi", email: "lestari@example.com", role: "Admin", status: "Active", lastLogin: "2024-12-05 17:00", createdAt: "2024-04-01" },
]
