import { AppProps, type AppType } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import '@fontsource/cabin';
import '@fontsource/roboto-condensed';

import { api } from '../utils/api';

import '../styles/globals.css';
import { NextPage } from 'next';

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

export type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const App = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  const getLayout = Component.getLayout || ((page) => <>{page}</>);

  return (
    <SessionProvider session={session}>
      {getLayout(<Component {...pageProps} />)}
    </SessionProvider>
  );
};

export default api.withTRPC(App);
