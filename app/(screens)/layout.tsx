import PhoneShell from "./phone-shell";
import BottomNav from "./_components/bottom-nav";
import { NavProvider } from "./_context/nav-context";

export default function ScreensLayout({ children }: { children: React.ReactNode }) {
  return (
    <NavProvider>
      <PhoneShell>
        <div className="flex flex-col flex-1 min-h-0 relative">
          {children}

          {/* Bottom-corner taper — narrows the visible content area at the bottom
              so users immediately see there is more to scroll */}
          <div
            className="absolute bottom-0 left-0 pointer-events-none z-20"
            style={{
              width: 100,
              height: 160,
              background: "linear-gradient(to top right, var(--page) 0%, transparent 60%)",
            }}
          />
          <div
            className="absolute bottom-0 right-0 pointer-events-none z-20"
            style={{
              width: 100,
              height: 160,
              background: "linear-gradient(to top left, var(--page) 0%, transparent 60%)",
            }}
          />
        </div>
        <BottomNav />
      </PhoneShell>
    </NavProvider>
  );
}
