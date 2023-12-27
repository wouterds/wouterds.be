import { MetaFunction } from '@remix-run/cloudflare';

export const meta: MetaFunction = () => {
  return [{ title: 'About' }];
};

export default function About() {
  return (
    <div className="leading-relaxed">
      <p className="mb-4">
        Hey 👋, I&apos;m Wouter, 31 years old and passionate about all things
        digital really.
      </p>
      <p className="mb-4">
        I studied Digital Design & Development at Howest University College and
        currently I&apos;m freelancing as a Full Stack Developer. I have +10
        years of experience as a professional web & mobile developer and in the
        last few years, I&apos;ve been focusing a lot on React, React Native &
        Node.js applications.
      </p>
      <p className="mb-4">
        Before I started freelancing & contracting I used to work for a startup
        Delta, which has been acquired by eToro. I also worked at a few other
        startups & scale-ups such as Teamleader, In The Pocket & Realo.
      </p>
      <p className="mb-4">
        When I&apos;m not creating kickass digital applications, I&apos;m
        probably fiddling around with electronics using Arduino, ESP and
        Raspberry Pi. Besides that, I really love traveling, trying new things
        and pushing my own limits. Also kind of a data geek, charts & stats are
        real motivators for me.
      </p>
      <p className="mb-4">
        Since 2017 heavily involved in the crypto space and really started to
        appreciate the power of decentralized applications. And to be honest,
        it&apos;s probably one of the most exciting things I&apos;ve come across
        lately!
      </p>
      <p className="mb-4">Also a cat person 🐈.</p>
    </div>
  );
}
