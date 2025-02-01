import Header from "@/ui/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="pt-20 flex-1 w-full">
        {children}
      </main>
    </div>
  );
};