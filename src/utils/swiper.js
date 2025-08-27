import { useRouter } from 'next/router';
import * as React from 'react';
import {
  Box,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Button
} from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import 'swiper/css';
import 'swiper/css/navigation';
import Link from 'next/link';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
let WEB_URL = process.env.NEXT_PUBLIC_WEB_URL;
export default function CardsCarousel({ allCards = [] }) {
  const router = useRouter();
  const gotoEditor = (uuid, cardUUID) => router.push(`/card-editor/${uuid}?selected=${cardUUID}`);

  // check here the user created card if is pass 30 days than hide that cards

  const validCards = (Array.isArray(allCards) ? allCards : []).filter((data) => {
    const createdDate = new Date(data?.createdAt);
    const now = new Date();
    const diffInDays = (now - createdDate) / (1000 * 60 * 60 * 24);
    return diffInDays <= 30;
  });

  return (
    <Swiper
      modules={[Navigation, Autoplay]}
      navigation
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      spaceBetween={16}
      slidesPerView={1}
      breakpoints={{
        0: { slidesPerView: 1 },   // phones — exactly one card
        768: { slidesPerView: 1 },   // tablets
        1024: { slidesPerView: 4 },   // small desktop
        1280: { slidesPerView: 4 }   // large desktop
      }}
      style={{ paddingInline: 8, marginTop: '20px' }}
    >
      {(
        validCards.map((data, idx) => {
          const key = data?.uuid || idx;
          const img = `${BASE_URL}/${data?.cardId?.frontDesign}`;
          const title = data?.cardId?.title;
          const price = data?.cardId?.price;

        // Array.isArray(allCards) ? allCards : []).map((data, idx) => {
        // const key = data?.uuid || idx;
        // const img = `${BASE_URL}/${data?.cardId?.frontDesign}`;
        // const title = data?.cardId?.title || 'Untitled';
        // const price = data?.cardId?.price;
        // const cardCreatedDate = data?.createdAt;
        // console.log("cardCreatedDate", cardCreatedDate);

        return (
          <SwiperSlide key={key}>
            <Card
              elevation={3}
              sx={{
                // height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 120ms ease, box-shadow 120ms ease',
                '&:hover': { boxShadow: 6, transform: 'translateY(-2px)' }
              }}
            >
              <CardActionArea onClick={() => gotoEditor(data?.uuid, data?.cardId?.uuid)}>
                <CardMedia
                  component="img"
                  src={img}
                  alt={title}
                  loading="lazy"
                  sx={{ width: '100%', aspectRatio: '1 / 1.414', objectFit: 'cover' }}
                  // sx={{ width: '100%',height:300, objectFit: 'cover' }}
                />
                <CardContent sx={{ pb: 1.5, pt: 1 }}>
                  <Typography variant="h6"
                              sx={{ color: '#c165a0', fontWeight: 600, mb: 1, textAlign: 'left' }}>
                    {title}
                  </Typography>
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                  >
                    {/* Price on left */}
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      sx={{ fontWeight: 'bolder' }}
                    >
                      {`${price} AUD`}
                    </Typography>

                    {/* Buttons on right */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Tooltip title="Edit Card">
                        <IconButton onClick={() => gotoEditor(data?.uuid, data?.cardId?.uuid)}>
                          <EditIcon sx={{ color: '#c165a0' }}/>
                        </IconButton>
                      </Tooltip>

                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/checkout/${data._id}`);
                        }}
                        variant="outlined"
                        sx={{
                          borderRadius: '20px !important',
                          color: '#c165a0',
                          px: 2,
                          '&:hover': { backgroundColor: '#c165a0', color: 'white' }
                        }}
                      >
                        Buy Now
                      </Button>
                    </Box>

                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </SwiperSlide>
        );
      }))}
    </Swiper>
  );
}
