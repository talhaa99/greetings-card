import Head from 'next/head';
import {
  Card,
  CardContent,
  Container,
  Typography,
  Grid, Box, useTheme, useMediaQuery
} from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import * as React from 'react';
import NextLink from 'next/link';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';

import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const PopularCards = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const WEB_URL = process.env.NEXT_PUBLIC_WEB_URL;
  const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME;
  const router = useRouter();

  const [popularCards, setPopularCards] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Raw card array for when no popular cards are available
  const rawCardArray = [
    { _id: 'raw-1', frontDesign: `${WEB_URL}/1.png`, title: 'Birthday Card 1' },
    { _id: 'raw-2', frontDesign: `${WEB_URL}/2.png`, title: 'Birthday Card 2' },
    { _id: 'raw-3', frontDesign: `${WEB_URL}/3.png`, title: 'Birthday Card 3' },
    { _id: 'raw-4', frontDesign: `${WEB_URL}/4.png`, title: 'Birthday Card 4' },
    { _id: 'raw-5', frontDesign: `${WEB_URL}/1.png`, title: 'Birthday Card 5' },
    { _id: 'raw-6', frontDesign: `${WEB_URL}/2.png`, title: 'Birthday Card 6' },
    { _id: 'raw-7', frontDesign: `${WEB_URL}/3.png`, title: 'Birthday Card 7' }
  ];

  // Resolve full image URL from path or absolute
  const resolveImageUrl = (value) => {
    if (!value || typeof value !== 'string') return '';
    if (value.startsWith('http://') || value.startsWith('https://')) return value;
    const base = (API_BASE_URL || '').replace(/\/$/, '');
    const path = value.startsWith('/') ? value : `/${value}`;
    return `${base}${path}`;
  };

  const gotoEditor = (cardUUID) => {
    const uuid = uuidv4();
    router.push(`/card-editor/${uuid}?selected=${cardUUID}`);
  };

  // Simple logic: show popular cards if available, otherwise show raw cards
  const getDisplayCards = () => {
    if (popularCards.length > 0) {
      // If we have popular cards, show them
      console.log('Showing popular cards:', popularCards.length);
      return popularCards;
    } else {
      // If no popular cards, show raw cards
      console.log('Showing raw cards:', rawCardArray.length);
      return rawCardArray;
    }
  };

  useEffect(() => {
    const fetchPopularCards = async () => {
      try {
        setLoading(true);
        console.log('Fetching popular cards from:', `${API_BASE_URL}/api/statistics/popular-cards?limit=10`);
        
        const response = await axios.get(`${API_BASE_URL}/api/statistics/popular-cards?limit=10`);
        
        if (response.data && response.data.success && response.data.data) {
          console.log('Popular cards fetched successfully:', response.data.data);
          setPopularCards(response.data.data);
        } else {
          console.log('No popular cards data received');
          setPopularCards([]);
        }
      } catch (error) {
        console.error('Error fetching popular cards:', error);
        setPopularCards([]);
        // Don't show error toast to users, just fall back to raw cards
      } finally {
        setLoading(false);
      }
    };

    fetchPopularCards();
  }, []);

  console.log("popularCards", popularCards);

  return (
    <>
      <Head>
        <title>Homepage | {APP_NAME}</title>
      </Head>
      <Box
        sx={{
          overflowX: 'hidden',
          width: '100%',
          height:'100%',
          backgroundColor: '#1a1d25 !important',
          pl: '3%',
          pr: '3%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box
          data-aos="zoom-in"
          data-aos-duration="600"
          data-aos-easing="ease-in"
          sx={{
            pt:5, pb:5,
            width: '100%',
            height:"100%"
          }}
        >
          {/* Button */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                color:'#c09b9b',
                borderRadius: '30px !important',
                fontSize: { md: '45px', xs: '25px' },
                fontWeight:'bolder',
              }}
            >
              Popular Cards
            </Box>
          </Box>

          {/* Swiper */}
          <Box sx={{ mt: 3 }}>
            {loading ? (
              <Box sx={{ display:'flex', justifyContent:'center', alignItems:'center', minHeight: 200 }}>
                <Typography variant="h6" sx={{ color: '#c9cbd3', textAlign: 'center' }}>
                  Loading popular cards...
                </Typography>
              </Box>
            ) : (
              <Swiper
                dir="rtl"
                direction="horizontal"
                autoplay={{ delay: 1500 }}
                loop={getDisplayCards().length > 1}
                breakpoints={{
                  360:{slidesPerView: 3, spaceBetween: 10},
                  344:{slidesPerView: 3, spaceBetween: 10},
                  375:{slidesPerView: 3, spaceBetween: 10},
                  640: { slidesPerView: 3, spaceBetween: 0 },
                  768: { slidesPerView: 4, spaceBetween: 20 },
                  1024: { slidesPerView: 5, spaceBetween: 20 },
                  1400: { slidesPerView: 6, spaceBetween: 40 },
                  2000:{ slidesPerView: 6, spaceBetween: 40},
                }}
                pagination={{
                  clickable: true,
                  type: 'bullets',
                  bulletClass: 'swiper-pagination-bullet',
                  renderBullet: (index, className) => {
                    return `<span class="${className}" style="width: 15px; height: 15px;"></span>`;
                  },
                }}
                modules={[Pagination, Autoplay]}
                className="mySwiper"
              >
                {getDisplayCards().map((card, index) => {
                  console.log('Rendering card:', card._id, card.title, card.frontDesign);
                  return (
                    <SwiperSlide key={card._id || index}>
                      <Box 
                        sx={{ 
                          display:'flex', 
                          flexDirection:'column', 
                          alignItems:'center', 
                          py: 2, 
                          mb:5,
                          cursor: 'pointer'
                        }}
                        onClick={() => gotoEditor(card._id)}
                      >
                        <Box
                          component="img"
                          src={card.frontDesign ? resolveImageUrl(card.frontDesign) : (card.url || `${WEB_URL}/1.png`)}
                          alt={card.title || `card${index}`}
                          sx={{
                            width:'100%',
                            // width: {
                            //   xs: '100%',
                            //   md: '40%',
                            //   lg:'30%',
                            //   xl:'20%'
                            // },
                            height: 'auto',
                            display: 'block',
                            mx: 'auto',
                            my: 2,
                            borderRadius: 2,
                            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.05)',
                              boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
                            }
                          }}
                        />
                        {/* {card.title && (
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#c9cbd3', 
                              textAlign: 'center',
                              mt: 1,
                              fontSize: '0.9rem'
                            }}
                          >
                            {card.title}
                          </Typography>
                        )} */}
                      </Box>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default PopularCards;