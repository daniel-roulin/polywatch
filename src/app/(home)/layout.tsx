import Header from "@/ui/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="mt-16 w-full">
        {children}
      </div>
    </div>
  );
};