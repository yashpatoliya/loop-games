import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import MobileCategoryBar from "@/components/MobileCategoryBar";
import { getCategories } from "@/lib/games";

export default function BrowseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = getCategories();

  return (
    <div className="flex min-h-full flex-col">
      <Header />
      <MobileCategoryBar categories={categories} />
      <div className="flex w-full flex-1 gap-6 px-4 sm:px-6">
        <Sidebar categories={categories} />
        <div className="flex min-w-0 flex-1 flex-col">
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
