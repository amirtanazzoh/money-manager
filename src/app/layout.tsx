import Sidebar from "@/components/Sidebar";
import "./globals.css";

export const metadata = {
  title: "Money Manager",
  description: "Manage your money easily",
};

export default function RootLayout ( { children }: { children: React.ReactNode; } )
{
  return (
    <html lang="en">
      <body className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-8 overflow-auto">{ children }</main>
      </body>
    </html>
  );
}
