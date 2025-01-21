import { Article } from '~/components/article';

export default function Home() {
  return (
    <Article>
      <h1 className="mb-12">Wouter De Schuyter</h1>
      <p>Hey, I&apos;m Wouter, and I like to call myself a Digital Creative & Developer.</p>
      <p>
        I&apos;ve been doing web &amp; mobile development for over 15 years, lately mostly using
        React, React Native, and Node.js. I studied{' '}
        <a href="https://devine.be/en" target="_blank" rel="noreferrer">
          Digital Design & Development
        </a>{' '}
        at Howest University College and have worked with various startups, scale-ups, and agencies.
        I love working on user facing products that are used by millions &#x2013; currently @{' '}
        <a href="https://tally.so" target="_blank" rel="noreferrer">
          Tally
        </a>
        .
      </p>
      <p>
        In my free time I enjoy travel, photography and experimenting with electronics, Raspberry
        Pi, Linux, designing stickers &#x2013; just creating stuff. Been following the crypto space
        since 2017 but have been taking some more distance from it recently.
      </p>
    </Article>
  );
}
