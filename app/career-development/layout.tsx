import { metadata } from "./metadata";

export { metadata };

export default function CareerDevelopmentLayout({
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