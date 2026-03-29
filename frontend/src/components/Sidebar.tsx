import { NavLink } from "react-router-dom";
import { LayoutDashboard, ListTree, Network, TerminalSquare, BarChart3, Settings as SettingsIcon } from "lucide-react";
import clsx from "clsx";

const navItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Workflows", path: "/workflows", icon: ListTree },
  { name: "Graph View", path: "/graph", icon: Network },
  { name: "Logs", path: "/logs", icon: TerminalSquare },
  { name: "Analytics", path: "/analytics", icon: BarChart3 },
  { name: "Settings", path: "/settings", icon: SettingsIcon },
];


export function Sidebar() {
  return (
    <div className="w-64 h-full bg-[#0a0a0a] border-r border-white/5 flex flex-col p-4 shadow-sm z-10 relative overflow-hidden shrink-0">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16" />
      
      <div className="flex justify-center mb-10 px-4 group cursor-pointer mt-4 relative z-10">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
          <img src="/logo.jpg" alt="Logo" className="w-full relative rounded-2xl border border-white/10 shadow-lg object-contain group-hover:scale-105 transition-transform duration-300" />
        </div>
      </div>

      <nav className="flex flex-col gap-2 relative z-10 border-t border-white/5 pt-6">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative",
                isActive 
                  ? "bg-white/10 text-white shadow-[inset_0_1px_rgba(255,255,255,0.1)] border border-white/5" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-white"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={clsx("w-5 h-5 transition-transform duration-300 group-hover:scale-110", isActive && "text-blue-400")} />
                <span className="font-semibold tracking-wide text-sm">{item.name}</span>
                {isActive && (
                  <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto relative z-10">
        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/5">
          <h4 className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-1">System Load</h4>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 h-1.5 bg-black/50 rounded-full overflow-hidden">
              <div className="h-full w-[34%] bg-green-400 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
            </div>
            <span className="text-xs font-mono text-green-400">34%</span>
          </div>
          <p className="text-[10px] text-gray-500 leading-tight">All MCP clusters nominal.</p>
        </div>
        
        <div className="mt-6 flex flex-col items-center gap-1 opacity-50 hover:opacity-100 transition-opacity pb-2">
          <div className="flex items-center gap-1.5 cursor-default">
            <div className="w-1 h-1 rounded-full bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.5)] animate-pulse" />
            <span className="text-[14px] font-mono font-bold tracking-[0.2em] text-red-400 uppercase leading-none drop-shadow-[0_0_8px_rgba(96,165,250,0.4)]">
              Built by <span className="text-white">Team Matrix</span>
            </span>

          </div>
          <div className="h-[1px] w-8 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
        </div>
      </div>
    </div>

  );
}
