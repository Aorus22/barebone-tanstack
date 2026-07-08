export type User = {
  id: string
  name: string
  email: string
  role: string
  status: "Active" | "Inactive" | "Pending"
  lastLogin: string
  createdAt: string
}
