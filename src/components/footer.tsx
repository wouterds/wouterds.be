const Footer = () => {
  return (
    <footer className="my-12 max-w-screen-md mx-auto px-8">
      <p className="text-sm text-gray-400">
        <a
          href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
          target="_blank"
          rel="noreferrer">
          CC BY-NC-SA 4.0
        </a>{' '}
        &copy; 2015 - {new Date().getFullYear()} Wouter De Schuyter
      </p>
    </footer>
  );
};

export default Footer;
