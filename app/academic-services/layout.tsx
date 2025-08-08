import { metadata } from "./metadata";

export { metadata };

export default function AcademicServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen">
      {children}
    </main>
  );
} 