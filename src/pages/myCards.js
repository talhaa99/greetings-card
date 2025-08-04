import Head from 'next/head';
import {
  Card,
  CardContent,
  Container,
  Typography, Tab, IconButton, Menu, CircularProgress, Pagination, Stack,
  Grid, Box, useMediaQuery, useTheme, Button, MenuItem, Select
} from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import * as React from 'react';
import { useEffect, useState, useMemo, useRef } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import NextLink from 'next/link';
import ReactPaginate from 'react-paginate';

import { useRouter } from 'next/router';
import { useAuth } from '../hooks/use-auth';
import LandingNav from '../layouts/landing-nav/landingLayout';
import { v4 as uuidv4 } from 'uuid';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const WEB_URL = process.env.NEXT_PUBLIC_WEB_URL;
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME;
const LoginUserCards = () => {
  const auth = useAuth();
  const router = useRouter();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isIpadScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const [allCards, setAllCards] = useState([]);
  const [loading, setLoading] = useState(false);

  const getUserEmail = () => {
    if (!auth?.isAuthenticated) {
      console.log('User is not authenticated');
      return null;
    }

    if (auth.user?.email) {
      console.log('Using auth.user.email:', auth.user.email);
      return auth.user.email;
    }

    if (auth.loginUserData?.email) {
      console.log('Using auth.loginUserData.email:', auth.loginUserData.email);
      return auth.loginUserData.email;
    }

    console.log('No email found in auth object');
    return null;
  };

  const getAllLoginUserCards = async () => {
    const token = localStorage.getItem('token');
    const email = getUserEmail();
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/user/get-all-cards/${email}`, {
        headers: {
          'Content-Type': 'Application/json',
          'x-access-token': token
        }
      });
      setAllCards(res.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllLoginUserCards();
  }, []);


  // console.log('allCards', allCards);

  const gotoEditor = (uuid, cardUUID) => {
    router.push(`/card-editor/${uuid}?selected=${cardUUID}`);
  };

  return (
    <>
      <Head>
        <title>My Cards | {APP_NAME}</title>
      </Head>
      <LandingNav/>
      <Box sx={{
        width: '100%',
        height: '100%',
        minHeight: '100vh',
        // bgcolor:'#eee3ea',
        backgroundImage: {
          xs: `url(${WEB_URL}/portrate.png)`,
          md: `url(${WEB_URL}/bg1.png)`
        },
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        <Box
          data-aos="zoom-in"
          data-aos-duration="600"
          data-aos-easing="ease-in"
          sx={{
            pl: { md: '20%', laptop: '25%', lg: '20%', xl: '30%', xs: '15%', ipad: '25%' },
            pr: { md: '20%', laptop: '25%', lg: '20%', xl: '30%', xs: '15%', ipad: '25%' },
            // bgcolor:"blue",
            pt: { md: 15, xs: 10 },
            pb: 10,
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            flexDirection: 'column', height: '100%'
          }}
        >
          <Box sx={{
            // mb: { md: 3, xs: 3 },
            borderRadius: '30px !important',
            fontSize: { md: '45px', xs: '25px' },
            color: { xs: '#c165a0', md: '#1A1D25' },
            fontWeight: 'bolder'
          }}>
            My Cards
          </Box>

          <Grid container>
            <Grid md={12} xs={12}>
              <Box sx={{
                width: '100%',
                // bgcolor:'red',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column'
              }}>

                <Grid container sx={{ mt: 5 }}>
                  {loading ? (
                    <Box sx={{ width: '100%', textAlign: 'center' }}>
                      <CircularProgress/>
                    </Box>
                  ) : (
                    <>
                      {allCards.length === 0 ? (
                        <Box sx={{ width: '100%', textAlign: 'center' }}>
                          <Typography>No cards found.</Typography>
                        </Box>
                      ) : (
                        allCards.map((data, index) => (
                          <Grid md={4} lg={3} xs={6} key={index} sx={{
                            p: 1, display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}>
                            <Box
                              onClick={() => gotoEditor(data?.uuid , data?.cardId?.uuid)}
                              component="img"
                              loading="lazy"
                              src={`${BASE_URL}/${data?.cardId?.frontDesign}`}
                              alt={data?.title}
                              sx={{
                                width: '100%',
                                // width: { xl: '100%', lg: '90%' },
                                // display: 'block',

                                aspectRatio: '1 / 1.414',
                                cursor: 'pointer'
                              }}
                            />
                          </Grid>
                        ))
                      )}
                    </>
                  )}
                </Grid>

              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>

    </>
  );
};
export default LoginUserCards;