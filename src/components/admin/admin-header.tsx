type AdminHeaderProps = {
  title: string;
  description?: string;
};

export function AdminHeader({ title, description }: AdminHeaderProps) {
  return (
    <header className="space-y-1">
      <p className="text-xs font-semibold uppercase tracking-wider text-atres-gold">
        Panel administrativo
      </p>
      <h1 className="text-2xl font-bold text-atres-text sm:text-3xl">{title}</h1>
      {description ? (
        <p className="text-sm leading-6 text-atres-muted">{description}</p>
      ) : null}
    </header>
  );
}
