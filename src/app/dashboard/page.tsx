import Link from "next/link";
import { DashboardView } from "@/components/assessment/DashboardView";

export default function DashboardPage() {
  return (
    <section className="page-container">
      <div className="page-header dashboard-header">
        <div>
          <h1>Best Practices Framework Assessment Results</h1>
          <p>Review your assessment results and prioritized action items.</p>
        </div>
        <Link href="/playbook" className="button ghost dashboard-header-link">
          Open playbook
        </Link>
      </div>
      <DashboardView />
    </section>
  );
}
