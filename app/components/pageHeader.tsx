interface PageHeaderProps {
  title: React.ReactNode; 
  children?: React.ReactNode; 
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
          title 
        )}
      </div>

      {children && <div className="flex items-center gap-3">{children}</div>}
    </header>
  );
}
