import React from 'react';
import { NextPageContext } from 'next';
import NextErrorComponent from 'next/error';
import Sentry from 'services/sentry';
import Layout from 'components/Layout';
import Header from 'components/Header';
import Footer from 'components/Footer';
import Meta from 'components/Meta';
import { Container } from './styles';

const ErrorComponent = ({
  hasGetInitialPropsRun,
  err,
}: {
  statusCode: number;
  hasGetInitialPropsRun: boolean;
  err: any;
}) => {
  if (!hasGetInitialPropsRun && err) {
    // https://github.com/zeit/next.js/issues/8592
    Sentry.captureException(err);
  }

  return (
    <Layout>
      <Meta title="Something went wrong" />
      <Header />
      <Layout.Content centered editorial>
        <Container>
          <h1>Oh darn!</h1>
          <p>It looks like something went wrong 😢...</p>

          <img loading="lazy" src="/static/error.gif" alt="error.gif" />
        </Container>
      </Layout.Content>
      <Footer centered />
    </Layout>
  );
};

ErrorComponent.getInitialProps = async ({
  res,
  err,
  asPath,
}: NextPageContext) => {
  const errorInitialProps: any = await NextErrorComponent.getInitialProps({
    res,
    err,
  } as NextPageContext);

  // https://github.com/zeit/next.js/issues/8592
  errorInitialProps.hasGetInitialPropsRun = true;

  if (res) {
    if (res.statusCode === 404) {
      return { statusCode: 404 };
    }

    if (err) {
      Sentry.captureException(err);

      return errorInitialProps;
    }
  }

  if (err) {
    Sentry.captureException(err);

    return errorInitialProps;
  }

  Sentry.captureException(
    new Error(`Error.getInitialProps missing data at path: ${asPath}`),
  );

  return errorInitialProps;
};

export default ErrorComponent;
