import { MetaFunction } from '@remix-run/cloudflare';
import { differenceInMilliseconds, differenceInYears } from 'date-fns';
import { useState } from 'react';
import { useInterval } from 'react-use';

const BIRTHDAY = '13 December 1992';

const getAge = () => {
  return (
    differenceInMilliseconds(new Date(), new Date(BIRTHDAY)) /
    (365 * 24 * 60 * 60) /
    1000
  ).toFixed(8);
};

export const meta: MetaFunction = () => {
  return [
    { title: 'About' },
    {
      name: 'description',
      content: `Hey 👋, I'm Wouter, ${differenceInYears(
        new Date(),
        BIRTHDAY,
      )} years old and passionate about all things digital really. Devine alumni & currently contracting as a Full-stack Developer.`,
    },
  ];
};

export default function About() {
  const [age, setAge] = useState(getAge());
  useInterval(() => setAge(getAge()), 1);

  return (
    <div className="leading-relaxed">
      <p className="mb-4">
        Hey 👋, I&apos;m Wouter, {age} years old and passionate about all things digital really.
      </p>
      <p className="mb-4">
        I studied Digital Design & Development at Howest University College and currently I&apos;m
        contracting as Full-stack Developer. I have over 10 years of experience as a professional
        web & mobile developer and the last few years, I&apos;ve been specializing in React, React
        Native & Node.js (web) applications. Before I started contracting I used to work for a
        variety of startups, scale-ups and agencies.
      </p>
      <p className="mb-4">
        When I&apos;m not creating kickass digital applications, I&apos;m probably fiddling around
        with electronics using Arduino, ESP and Raspberry Pi. The restless mind that I am wants to
        learn and expand knowledge all the time. Besides that, I really love traveling, trying new
        things and pushing my own limits. Also kind of a data geek, charts & stats are real
        motivators for me.
      </p>
      <p className="mb-4">
        Since 2017 involved in the crypto space and really started to appreciate the power of
        decentralized applications. And to be honest, it&apos;s probably one of the most exciting
        things I&apos;ve come across lately!
      </p>
      <p className="mb-4">Also a cat person! 🐱</p>
    </div>
  );
}
