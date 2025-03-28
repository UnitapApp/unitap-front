import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardHeader() {
  return (
    <header className="mt-5 flex items-center justify-between">
      Dashboard
      <div className="flex items-center gap-2">
        <Link href="/dashboard/projects/new">
          <Button size="lg" className="bg-[#867FEE] hover:bg-blue-500">
            Add New Campagin
          </Button>
        </Link>
      </div>
    </header>
  );
}
