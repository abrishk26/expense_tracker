"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState("dashboard");

  return (
    <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
  );
}