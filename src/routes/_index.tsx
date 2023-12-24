import type { MetaFunction } from '@remix-run/cloudflare';

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
};

export default function Index() {
  return (
    <div>
      <header className="text-center">
        <img
          src="/images/wouterds.2024.jpg"
          alt="Headshot of Wouter De Schuyter"
          className="rounded-full w-32 h-32 mx-auto mb-4"
        />
        <h1 className="text-2xl font-medium mb-2">Wouter De Schuyter</h1>
        <h2 className="text-black dark:text-white text-opacity-50 dark:text-opacity-50">
          Digital Creative & Developer
        </h2>
      </header>
    </div>
  );
}
