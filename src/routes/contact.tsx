import { MetaFunction } from '@remix-run/cloudflare';

export const meta: MetaFunction = () => {
  return [{ title: 'Contact' }];
};

export default function Contact() {
  return (
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
  );
}
