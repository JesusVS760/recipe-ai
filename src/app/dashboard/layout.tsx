import Header from "@/components/header";
import Navigation from "@/components/providers/Navigation";

const DashboardLayout = ({ children }: any) => {
  return (
    <div className="flex flex-col gap-y-4 px-4">
      <Navigation />
      <Header />
      <main> {children}</main>
    </div>
  );
};

export default DashboardLayout;
