type Props = {
  ray?: string | null;
};

const Footer = ({ ray }: Props) => {
  return (
    <footer className="border-t border-dashed border-zinc-900 dark:border-zinc-100 py-3 flex justify-between gap-2">
      <p className="whitespace-nowrap">
        &copy; {new Date().getFullYear()} Wouter De Schuyter
      </p>
      {ray && <p className="truncate">{ray}</p>}
    </footer>
  );
};

export default Footer;
