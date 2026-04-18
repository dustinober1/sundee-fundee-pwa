import { requireOnboardedProfile } from "@/lib/supabase/dal";
import { AdminProgramForm } from "@/app/admin/programs/new/AdminProgramForm";
import { createUserProgram } from "../actions";

export default async function NewUserProgramPage() {
  await requireOnboardedProfile();
  return (
    <main className="flex flex-1 flex-col px-6 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <AdminProgramForm
          action={createUserProgram}
          title="New Program"
          description="Build a custom multi-week plan. You can edit, clone, and enroll in it later."
          submitLabel="Save program"
          pendingLabel="Saving…"
          backHref="/programs"
          backLabel="← Programs"
        />
      </div>
    </main>
  );
}
