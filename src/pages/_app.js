import Head from 'next/head';
import { CacheProvider } from '@emotion/react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { AuthConsumer, AuthProvider } from 'src/contexts/auth-context';
import { useNProgress } from 'src/hooks/use-nprogress';
import { createTheme } from 'src/theme';
import { createEmotionCache } from 'src/utils/create-emotion-cache';
import 'simplebar-react/dist/simplebar.min.css';
import { Toaster } from 'react-hot-toast';
import '../../public/style.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';
import { SessionProvider } from 'next-auth/react';

const clientSideEmotionCache = createEmotionCache();
const WEB_URL = process.env.NEXT_PUBLIC_WEB_URL;
import { LoginModalProvider } from '../contexts/loginContext';
import { LoginVerifyProvider } from '../contexts/verifyContext';
import { ResetProvider } from '../contexts/reset-context';
import { RegisterModalProvider } from '../contexts/register-context';
import { ZindexProvider } from '../contexts/zindex-control';
import { SavedProvider } from '../contexts/save-context';

import Box from '@mui/material/Box';

const SplashScreen = () => null;

const App = (props) => {
  // const {LoginModalProvider } = LoginModalProvider();
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  useNProgress();

  const getLayout = Component.getLayout ?? ((page) => page);

  const theme = createTheme();

  useEffect(
    () => {
      AOS.init({});
    }, []);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>
          {process.env.NEXT_PUBLIC_APP_NAME}
        </title>
        <meta
          name="viewport"
          content="initial-scale=1, width=device-width"
        />
      </Head>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <SessionProvider session={pageProps.session}>
          <SavedProvider>
          <ZindexProvider>
          <RegisterModalProvider>
            <LoginModalProvider>
              <ResetProvider>
                <LoginVerifyProvider>
                  <AuthProvider>
                    <Toaster/>
                    <ThemeProvider theme={theme}>
                      <CssBaseline/>

                      <AuthConsumer>

                        {
                          (auth) => auth.isLoading
                            ? <SplashScreen/>
                            : getLayout(<Component {...pageProps} />)
                        }

                      </AuthConsumer>

                      {/*<AuthConsumer>*/}
                      {/*  {(auth) =>*/}
                      {/*    auth.isLoading ? (*/}
                      {/*      <SplashScreen />*/}
                      {/*    ) : (*/}
                      {/*      <Box*/}
                      {/*        sx={{*/}
                      {/*          width: '100%',*/}
                      {/*          minHeight: '100vh',*/}
                      {/*          backgroundImage: {*/}
                      {/*            xs: `url(${WEB_URL}/portrate.png)`,*/}
                      {/*            md: `url(${WEB_URL}/bg1.png)`,*/}
                      {/*          },*/}
                      {/*          backgroundSize: 'cover',*/}
                      {/*          backgroundPosition: 'center',*/}
                      {/*          backgroundRepeat: 'no-repeat',*/}
                      {/*        }}*/}
                      {/*      >*/}
                      {/*        {getLayout(<Component {...pageProps} />)}*/}
                      {/*      </Box>*/}
                      {/*    )*/}
                      {/*  }*/}
                      {/*</AuthConsumer>*/}

                    </ThemeProvider>
                  </AuthProvider>
                </LoginVerifyProvider>
              </ResetProvider>
            </LoginModalProvider>
          </RegisterModalProvider>
          </ZindexProvider>
          </SavedProvider>
        </SessionProvider>
      </LocalizationProvider>
    </CacheProvider>
);
};

export default App;

// NEXT_PUBLIC_API_BASE_URL=https://greetings-card-apis.tecshield.net
// NEXT_PUBLIC_WEB_URL=https://greetings-card-website.tecshield.net
// NEXTAUTH_URL=https://greetings-card-website.tecshield.net


