import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useForm from 'react-hook-form';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import Form from 'components/Form';
import Layout from 'components/Layout';
import { useCookie, Cookies } from 'hooks/cookie';

const SIGN_IN = gql`
  mutation SignIn($email: String!, $password: String!) {
    signIn(email: $email, password: $password)
  }
`;

const SignIn = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, errors } = useForm({
    submitFocusError: false,
  });
  const [signIn] = useMutation(SIGN_IN);
  const [, setJwt] = useCookie(Cookies.JWT);

  const onSubmit = handleSubmit(data => {
    const { email, password } = data;

    setIsLoading(true);

    signIn({ variables: { email, password } })
      .then(({ data }) => {
        const { signIn: jwt } = data;
        setJwt(jwt);
        router.push('/');
      })
      .catch(e => {
        console.error(e.message);
        setIsLoading(false);
      });
  });

  return (
    <Layout.Modal
      footer={
        <Link href="/" prefetch>
          <a>Go back</a>
        </Link>
      }
    >
      <h2>Sign in</h2>
      <Form onSubmit={onSubmit}>
        <Form.Field>
          <Form.Label htmlFor="email">Email</Form.Label>
          <Form.Input
            id="email"
            name="email"
            type="email"
            hasError={errors.hasOwnProperty('email')}
            ref={register({ required: true })}
          />
        </Form.Field>
        <Form.Field>
          <Form.Label htmlFor="password">Password</Form.Label>
          <Form.Input
            id="password"
            name="password"
            type="password"
            hasError={errors.hasOwnProperty('password')}
            ref={register({ required: true })}
          />
        </Form.Field>
        <Form.Field>
          <Form.Button type="submit" isLoading={isLoading}>
            Sign in
          </Form.Button>
        </Form.Field>
      </Form>
    </Layout.Modal>
  );
};

export default SignIn;
