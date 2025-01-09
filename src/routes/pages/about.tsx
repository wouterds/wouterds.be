import type { MetaFunction } from 'react-router';

export const meta: MetaFunction = () => {
  return [
    { title: 'About' },
    {
      name: 'description',
      content: `Hi, I&apos;m Wouter, a Full-stack Developer with over 10 years of experience in web and mobile development. I specialize in React, React Native, and Node.js. I studied Digital Design & Development at Howest University College and have worked with various startups, scale-ups, and agencies.`,
    },
  ];
};

export default function About() {
  return (
    <div className="leading-relaxed">
      <p className="mb-4">
        Hi, I&apos;m Wouter, a Full-stack Developer with over 10 years of experience in web and
        mobile development. I specialize in React, React Native, and Node.js. I studied Digital
        Design & Development at Howest University College and have worked with various startups,
        scale-ups, and agencies.
      </p>
      <p className="mb-4">
        In my free time I enjoy experimenting with Arduino, ESP, and Raspberry Pi, and electronics
        in general. Also actively been following the crypto space since 2017.
      </p>
      <p className="mb-4">
        I&apos;m passionate about continuous learning, traveling, and data analytics.
      </p>
    </div>
  );
}
