import { UserDashboardShell } from "@/components/UserDashboardShell";

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserDashboardShell>{children}</UserDashboardShell>;
}
