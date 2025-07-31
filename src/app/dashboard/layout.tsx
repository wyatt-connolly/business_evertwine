import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Business Evertwine",
  description: "Your business dashboard with file management and user profile",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-gray-50">{children}</div>;
}
