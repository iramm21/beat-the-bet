import { prisma } from "@/lib/prisma";
import { getCurrentProfile } from "@/features/profile/lib/get-current-profile";
import type { Role } from "@/types/role";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function updateRole(formData: FormData) {
  "use server";
  const userId = formData.get("userId") as string;
  const role = formData.get("role") as Role;

  const current = await getCurrentProfile();
  if (current?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.profile.update({ where: { userId }, data: { role } });
  revalidatePath("/dashboard/admin/users");
}

export default async function AdminUsersPage() {
  const current = await getCurrentProfile();
  if (current?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const profiles = await prisma.profile.findMany({
    select: { userId: true, email: true, username: true, role: true },
    orderBy: { email: "asc" },
  });

  return (
    <main className="space-y-4 p-6">
      <h1 className="text-2xl font-bold">User Management</h1>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left">
            <th className="p-2">Email</th>
            <th className="p-2">Role</th>
          </tr>
        </thead>
        <tbody>
          {profiles.map((p) => (
            <tr key={p.userId} className="border-t">
              <td className="p-2">{p.email}</td>
              <td className="p-2">
                <form action={updateRole} className="flex items-center gap-2">
                  <input type="hidden" name="userId" value={p.userId} />
                  <select
                    name="role"
                    defaultValue={p.role}
                    className="rounded border p-1"
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                  <button
                    type="submit"
                    className="rounded bg-primary px-2 py-1 text-primary-foreground"
                  >
                    Save
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
