import PhoneShell from "./(screens)/phone-shell";

export default function RootPage() {
  return (
    <PhoneShell>
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-muted-foreground">Dummy text — screens go here</p>
      </div>
    </PhoneShell>
  );
}
