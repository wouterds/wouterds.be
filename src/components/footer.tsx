const Footer = () => {
  return (
    <footer className="mt-12 mb-4 max-w-screen-md mx-auto px-6 sm:px-8 w-full flex-1">
      <p className="text-sm text-gray-400">
        <a
          href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
          target="_blank"
          rel="noreferrer"
          className="block sm:inline">
          CC BY-NC-SA 4.0
        </a>{' '}
        &copy; 2015 - {new Date().getFullYear()} Wouter De Schuyter
      </p>
    </footer>
  );
};

export default Footer;
