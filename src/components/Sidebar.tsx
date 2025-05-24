import { Home, BarChart3, Settings, Users, Package } from "lucide-react";

const Sidebar = ({ sidebarOpen }: { sidebarOpen: boolean }) => (
  <div
    className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-40 
        ${sidebarOpen ? "w-64" : "w-16"}
        dark:bg-gray-900 dark:border-gray-800`}
  >
    <div className="p-4 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <Package className="w-5 h-5 text-white" />
        </div>
        {sidebarOpen && (
          <h1 className="font-bold text-gray-900 dark:text-white">
            SideUP-Dashboard
          </h1>
        )}
      </div>
    </div>

    <nav className="p-4 space-y-2">
      <a
        href="#"
        className="flex items-center gap-3 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg
                       dark:text-blue-400 dark:bg-blue-900/30"
      >
        <Home className="w-5 h-5" />
        {sidebarOpen && <span className="font-medium">Dashboard</span>}
      </a>
      <a
        href="#"
        className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors
                       dark:text-gray-400 dark:hover:bg-gray-800"
      >
        <BarChart3 className="w-5 h-5" />
        {sidebarOpen && <span>Analytics</span>}
      </a>
      <a
        href="#"
        className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors
                       dark:text-gray-400 dark:hover:bg-gray-800"
      >
        <Users className="w-5 h-5" />
        {sidebarOpen && <span>Suppliers</span>}
      </a>
      <a
        href="#"
        className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors
                       dark:text-gray-400 dark:hover:bg-gray-800"
      >
        <Settings className="w-5 h-5" />
        {sidebarOpen && <span>Settings</span>}
      </a>
    </nav>
  </div>
);

export default Sidebar;
