import { type ReactNode } from "react";
import Navbar from "./Navbar";
import type { AuthModalOption } from "../../features/auth/types/auth.types";

interface MainLayoutProps {
  children: ReactNode;
  setOpenModal: (modal: AuthModalOption | null) => void;
}

export default function MainLayout({ children, setOpenModal }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-bg">

      {/* Static Navbar */}
      <Navbar setOpenModal={setOpenModal} />

      {/*Page Content */}
      <main className="flex-1 pt-10 sm:pt-10">
        {children}
      </main>

    </div>
  )
}