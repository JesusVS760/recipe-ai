import Header from "@/components/header";
import Dashboard from "./dashboard/page";
export default function Home() {
  return (
    <div className="flex flex-col px-6 py-4 items-center">
      {/* Recipe AI */}
      <Header />
      <Dashboard />
    </div>
  );
}
