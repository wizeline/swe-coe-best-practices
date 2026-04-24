import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DashboardView } from "@/components/assessment/DashboardView";

export default async function DashboardPage() {
  const session = await auth();
  const userEmail = session?.user?.email;

  if (!userEmail) {
    redirect("/login?callbackUrl=/dashboard");
  }

  return (
    <section className="page-container">
      <div className="page-header">
        <h1>Best Practices Framework Assessment Results</h1>
        <p>Review your latest assessment results and recommended actions.</p>
      </div>
      <DashboardView userEmail={userEmail} />
    </section>
  );
}
