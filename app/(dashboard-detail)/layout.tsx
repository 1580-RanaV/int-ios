import PhoneShell from "../(screens)/phone-shell";
import { NavProvider } from "../(screens)/_context/nav-context";

export default function DashboardDetailLayout({ children }: { children: React.ReactNode }) {
  return (
    <NavProvider>
      <PhoneShell>
        <div className="flex flex-col flex-1 min-h-0">
          {children}
        </div>
      </PhoneShell>
    </NavProvider>
  );
}
