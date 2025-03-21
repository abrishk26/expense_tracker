"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { FaBars, FaTimes, FaChartLine, FaMoneyBill, FaCog, FaSignOutAlt } from "react-icons/fa";
import Dashboard from "@/components/Dashboard";
import Expenses from "@/components/Expenses";
import Budget from "@/components/Budget";

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export default function Sidebar({ activeSection, setActiveSection }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    // Clear the supabase_session cookie
    Cookies.remove("supabase_session");
    // Redirect to the root page
    router.push("/");
  };

  return (
    <div className="flex min-h-screen bg-blue-50 overflow-hidden">
      {/* Sidebar */}
      <div
        className={`bg-blue-600 text-white ${isOpen ? "w-64" : "w-16"} transition-width duration-300 ease-in-out flex-shrink-0`}
        style={{ height: "100vh" }} // Fixed height to viewport height
      >
        <div className="p-4 flex justify-between items-center">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
          </button>
          {isOpen && <span className="text-xl font-bold">Expense Tracker</span>}
        </div>
        <nav className="mt-4">
          <ul>
            <li>
              <button
                onClick={() => setActiveSection("dashboard")}
                className={`w-full flex items-center p-4 hover:bg-blue-700 ${activeSection === "dashboard" ? "bg-blue-700" : ""}`}
              >
                <FaChartLine className="w-6 h-6" />
                {isOpen && <span className="ml-2">Dashboard</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSection("expenses")}
                className={`w-full flex items-center p-4 hover:bg-blue-700 ${activeSection === "expenses" ? "bg-blue-700" : ""}`}
              >
                <FaMoneyBill className="w-6 h-6" />
                {isOpen && <span className="ml-2">Expenses</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSection("budget")}
                className={`w-full flex items-center p-4 hover:bg-blue-700 ${activeSection === "budget" ? "bg-blue-700" : ""}`}
              >
                <FaCog className="w-6 h-6" />
                {isOpen && <span className="ml-2">Budget</span>}
              </button>
            </li>
          </ul>
        </nav>
        <div className="absolute bottom-0 w-full p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center p-4 hover:bg-blue-700"
          >
            <FaSignOutAlt className="w-6 h-6" />
            {isOpen && <span className="ml-2">Logout</span>}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto p-8">
        {activeSection === "dashboard" && <Dashboard />}
        {activeSection === "expenses" && <Expenses />}
        {activeSection === "budget" && <Budget />}
      </main>
    </div>
  );
}