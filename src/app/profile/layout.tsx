import { UserDashboardShell } from "@/components/UserDashboardShell";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserDashboardShell>{children}</UserDashboardShell>;
}
