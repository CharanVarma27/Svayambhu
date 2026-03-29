import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { CyberGrid } from "./CyberGrid";
import { AgentMascot } from "./AgentMascot";

export function Layout() {
  return (
    <div className="relative flex h-screen w-full bg-[#020203] text-foreground overflow-hidden">
      <CyberGrid />
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-transparent relative z-10">
        <div className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
      <AgentMascot />
    </div>
  );
}

