import React from 'react';
import NextApp, { Container } from 'next/app';
import Router from 'next/router';
import NProgress from 'nprogress';
import ApolloClient from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import withApollo from 'hocs/apollo';
import BaseCSS from 'styles/base';

interface Props {
  apollo: ApolloClient<any>;
}

class App extends NextApp<Props> {
  public render() {
    const { Component, pageProps, apollo } = this.props;

    return (
      <>
        <BaseCSS />

        <Container>
          <ApolloProvider client={apollo}>
            <Component {...pageProps} />
          </ApolloProvider>
        </Container>
      </>
    );
  }
}

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

export default withApollo(App);
