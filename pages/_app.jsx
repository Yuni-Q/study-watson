import { Container } from 'next/app';
import * as React from 'react';
import PropTypes from 'prop-types';

import withRedux from 'next-redux-wrapper';
import { applyMiddleware, compose, createStore } from 'redux';
import { Provider } from 'react-redux';
import Helmet from 'react-helmet';

import reducer from '../reducers';
import {LOG_IN} from '../reducers/user';

const MyApp = ({ Component, store, pageProps }) => (
  <Container>
    <Provider store={store}>
      <Helmet
        title="study-watson"
        htmlAttributes={{ lang: 'ko' }}
        meta={[
          {
            charset: 'UTF-8',
          },
          {
            name: 'viewport',
            content:
              'width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=yes,viewport-fit=cover',
          },
          {
            'http-equiv': 'X-UA-Compatible',
            content: 'IE=edge',
          },
          {
            name: 'description',
            content: 'study-watson',
          },
          {
            property: 'og:type',
            content: 'website',
          },
        ]}
        link={[
          {
            rel: 'shortcut icon',
            href: '/favicon.ico',
          },
          {
            rel: 'stylesheet',
            href:
              'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css',
          },
          {
            rel: 'stylesheet',
            href:
              'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css',
          },
          {
            rel: 'stylesheet',
            href: '/static/reset.css',
          },
        ]}
      />
      <Component {...pageProps} />
    </Provider>
  </Container>
);

const configureStore = (initialState, options) => {
  const middlewares = [
    store => next => action => {
      console.log(store, action);
      next(action);
    },
  ];
  const enhancer =
    process.env.NODE_ENV === 'development'
      ? compose(
        applyMiddleware(...middlewares),
        !options.isServer &&
          typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined'
          ? window.__REDUX_DEVTOOLS_EXTENSION__()
          : f => f,
      )
      : compose(applyMiddleware(...middlewares));
  const store = createStore(reducer, initialState, enhancer);
  return store;
};

MyApp.getInitialProps = async context => {
  const isServer = !!context.ctx.req;
  if (isServer) {
    //
  } else {
    // CSR
    // const user = JSON.parse(localStorage.getItem('user'));
    // const dispatch = useDispatch();
    // dispatch({
    //   type: LOG_IN,
    //   id: user.userId,
    //   name: user.userName,
    //   email: user.userEmail,
    //   phone: user.userPhone,
    // });
  }

  let pageProps = {};
  if (context.Component.getInitialProps) {
    pageProps = await context.Component.getInitialProps(context.ctx);
  }
  return { pageProps, isServer };
};

MyApp.propTypes = {
  Component: PropTypes.any.isRequired,
  store: PropTypes.any.isRequired,
  pageProps: PropTypes.any.isRequired,
};

export default withRedux(configureStore)(MyApp);
