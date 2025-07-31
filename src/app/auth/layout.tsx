import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication - Business Evertwine",
  description: "Sign in or create an account for Business Evertwine",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Business Evertwine
          </h1>
          <p className="text-gray-600">Welcome to your business platform</p>
        </div>
        {children}
      </div>
    </div>
  );
}
