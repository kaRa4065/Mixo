interface PageHeaderProps {
  title: React.ReactNode; // Accepts string or JSX
  children?: React.ReactNode; // Right side actions
}

export default function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <header className="w-full bg-white border-b px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {typeof title === "string" ? (
          <h2 className="text-lg font-normal tracking-wider text-secondary">
            {title}
          </h2>
        ) : (
          title // Render JSX directly
        )}
      </div>

      {children && <div className="flex items-center gap-3">{children}</div>}
    </header>
  );
}
