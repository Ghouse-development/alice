export function SlideHeader({ title, subtitle }: {title:string; subtitle?:string}) {
  return (
    <header className="w-full py-4">
      <h1 className="text-[28px] font-semibold tracking-[-0.01em]">{title}</h1>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </header>
  );
}