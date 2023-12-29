import { MetaFunction } from '@remix-run/cloudflare';

export const meta: MetaFunction = () => {
  return [{ title: 'Contact' }];
};

export default function Contact() {
  return (
    <>
      <p className="mb-4">
        If you&apos;re writing for a project or to work together, please include
        as much details as possible (goal, timeline, budget, ...). For
        everything else, write as you please, I&apos;ll be more than happy to
        reply!
      </p>
      <p>
        <strong>Wouter De Schuyter</strong>
        <br />
        email:{' '}
        <a href="mailto:wouter.de.schuyter@gmail.com">
          wouter.de.schuyter@gmail.com
        </a>
        <br />
        tel: <a href="tel:+32479228210">+32479228210</a>
      </p>
    </>
  );
}
