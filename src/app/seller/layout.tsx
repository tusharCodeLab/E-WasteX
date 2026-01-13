import { UserDashboardShell } from "@/components/UserDashboardShell";

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserDashboardShell>{children}</UserDashboardShell>;
}
