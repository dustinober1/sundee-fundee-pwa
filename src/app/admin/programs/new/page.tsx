import { requireAdmin } from "@/lib/supabase/dal";
import { AdminProgramForm } from "./AdminProgramForm";
import { createProgramTemplate } from "./actions";

export default async function AdminProgramsNewPage() {
  await requireAdmin();
  return (
    <main className="flex flex-1 flex-col px-6 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <AdminProgramForm action={createProgramTemplate} />
      </div>
    </main>
  );
}
