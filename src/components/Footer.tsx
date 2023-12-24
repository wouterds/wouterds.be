interface Props {
  time: number;
}

const Footer = ({ time }: Props) => {
  return (
    <footer className="border-t border-dashed border-zinc-900 dark:border-zinc-100 pt-3 flex justify-between">
      <p>&copy; {new Date().getFullYear()} Wouter De Schuyter</p>
      <p>generated in {Date.now() - time}ms</p>
    </footer>
  );
};

export default Footer;
