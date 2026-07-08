import { createFileRoute } from "@tanstack/react-router"
import { Users, Shield } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UsersPlayground } from "@/features/crud/playgrounds/users-playground"
import { GroupsPlayground } from "@/features/crud/playgrounds/groups-playground"

export const Route = createFileRoute("/(app)/admin/user-management")({
  component: UserManagementPage,
})

function UserManagementPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">User Management</h2>
        <p className="text-sm text-muted-foreground">
          Kelola akun user dan group access dengan permission matrix.
        </p>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="size-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="groups" className="flex items-center gap-2">
            <Shield className="size-4" />
            Group Access
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <UsersPlayground />
        </TabsContent>

        <TabsContent value="groups" className="space-y-4">
          <GroupsPlayground />
        </TabsContent>
      </Tabs>
    </div>
  )
}
