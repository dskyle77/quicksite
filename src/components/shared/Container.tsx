  // ─────────────────────────────────────────────
  // STANDARD CONTAINER
  // ─────────────────────────────────────────────
export default function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`max-w-7xl mx-auto px-4 md:px-8 lg:px-12 ${className}`}>
      {children}
    </div>
  );
}