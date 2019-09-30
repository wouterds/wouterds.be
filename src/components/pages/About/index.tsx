import React, { useState, useEffect } from 'react';
import { differenceInMilliseconds } from 'date-fns';
import Layout from 'components/Layout';
import Header from 'components/Header';
import Footer from 'components/Footer';
import { Container } from './styles';

const getAge = () =>
  (
    differenceInMilliseconds(new Date(), new Date('13 December 1992')) /
    (365 * 24 * 60 * 60) /
    1000
  ).toFixed(9);

const About = () => {
  const [age, setAge] = useState(getAge);

  useEffect(() => {
    const interval = setInterval(() => {
      setAge(getAge());
    }, 100);

    return () => clearInterval(interval);
  }, [age]);

  return (
    <Layout>
      <Header />
      <Layout.Content centered editorial>
        <Container>
          <h1>About</h1>
          <p>
            Hey 👋, I&apos;m Wouter! Currently{' '}
            <span className="age">{age}</span> years old and passionate about
            all things digital really.
          </p>
          <p>
            I studied{' '}
            <a
              href="https://devine.be"
              target="_blank"
              rel="noopener noreferrer"
            >
              Digital Design &amp; Development
            </a>{' '}
            🎓 at Howest University College and am currently working as a Senior
            Full Stack Developer at a smaller startup;{' '}
            <a
              href="https://delta.app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Delta
            </a>
            . Before this I also worked at a few other companies such as
            scale-up{' '}
            <a
              href="https://teamleader.eu"
              target="_blank"
              rel="noopener noreferrer"
            >
              Teamleader
            </a>
            ,{' '}
            <a
              href="https://inthepocket.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              In The Pocket
            </a>{' '}
            agency &amp; real estate startup{' '}
            <a
              href="https://realo.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Realo
            </a>
            .
          </p>
          <p>
            When I&apos;m not creating kickass web applications I&apos;m
            fiddling around with electronics, making tracking devices, robots,
            drones and other (useless 🤔?) fun projects using Arduino and
            Raspberry Pi ⚡️. Besides all of that I love travelling, nature,
            trying new things and pushing my own limits. I&apos;m also a data
            geek, graphs &amp; stats are real motivators for me 📈 (loyal Fitbit
            user over here).
          </p>
          <p>
            Since 2017 I&apos;m also involved in the crypto space, it&apos;s
            probably one of the most interesting things I&apos;ve come across
            ever since I discovered how to make websites and apps. To me,
            Bitcoin really is a magical thing 🔮. It&apos;s transparent, secure,
            uncensorable &amp; relatively quick (comparing to traditional
            banks).
          </p>
          <p>Oh right, also a cat person 🐈!</p>
        </Container>
      </Layout.Content>
      <Footer />
    </Layout>
  );
};

export default About;
