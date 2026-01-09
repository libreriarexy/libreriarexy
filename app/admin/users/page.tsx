import { db } from "@/lib/db";
import { UserApprovalButton } from "@/components/admin/user-approval-button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"; // Need to create Table component or just use raw HTML
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Simple Table impl if component doesn't exist yet, but I'll assume I should create it or use simple HTML for now to save tokens/steps
// I'll use standard HTML table with Tailwind classes for speed, perfectly valid.

export default async function UsersPage() {
    const users = await db.getUsers();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Usuarios</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Gestión de Clientes</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 text-muted-foreground">
                                <tr className="border-b">
                                    <th className="h-10 px-4 font-medium">Nombre</th>
                                    <th className="h-10 px-4 font-medium">Email</th>
                                    <th className="h-10 px-4 font-medium">Rol</th>
                                    <th className="h-10 px-4 font-medium">Saldo</th>
                                    <th className="h-10 px-4 font-medium">Estado</th>
                                    <th className="h-10 px-4 font-medium text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                                        <td className="p-4 font-medium">{user.name}</td>
                                        <td className="p-4">{user.email}</td>
                                        <td className="p-4">
                                            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-4 font-mono">
                                            ${user.balance.toLocaleString('es-AR')}
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${user.approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {user.approved ? 'Habilitado' : 'Revisión'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <UserApprovalButton user={user} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
