// import { useRouter } from 'next/router';
// import * as React from 'react';
// // MUI
// import { Grid, Box, Card , CardActionArea,  CardMedia, CardContent, Typography, Button} from '@mui/material';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Navigation, Pagination, Autoplay } from 'swiper/modules';
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';
//
// const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
//
// const chunk = (arr, size = 4) => {
//   if (!Array.isArray(arr)) return [];
//   const result = [];
//   for (let i = 0; i < arr.length; i += size) {
//     result.push(arr.slice(i, i + size));
//   }
//   return result;
// };
//
// export default function CardsCarousel({ allCards = [] }) {
//   const router = useRouter();
//   const slides = chunk(Array.isArray(allCards) ? allCards : [], 4);
//
//   const gotoEditor = (uuid, cardUUID) => {
//     router.push(`/card-editor/${uuid}?selected=${cardUUID}`);
//   };
//
//   return (
//     <Swiper
//       modules={[Navigation, Pagination, Autoplay]}
//       navigation
//       // pagination={{ type: 'progressbar' }}
//       autoplay={{
//         delay: 3000, // 3 seconds per slide
//         disableOnInteraction: false,
//       }}
//       slidesPerView={1}
//       spaceBetween={16}
//       breakpoints={{
//         360:{slidesPerView: 1},
//         344:{slidesPerView: 1},
//         375:{slidesPerView: 1},
//         640: { slidesPerView: 1 },
//         768: { slidesPerView: 1 },
//         1024: { slidesPerView: 3 },
//         1400: { slidesPerView: 4 },
//         2000:{ slidesPerView: 5},
//       }}
//       style={{ paddingInline: 8, marginTop: '20px' }}
//     >
//       {slides.map((group, slideIdx) => (
//         <SwiperSlide key={`slide-${slideIdx}`}>
//           <Grid container spacing={2}>
//             {group.map((data, index) => {
//               const key = data?.uuid || `${slideIdx}-${index}`;
//               const img = `${BASE_URL}/${data?.cardId?.frontDesign}`;
//               const title = data?.cardId?.title || 'Untitled';
//               const price = data?.cardId?.price;
//
//               return (
//                 <Grid item key={key} xs={12} sm={12} md={4} lg={3}>
//                   <Card
//                     elevation={3}
//                     sx={{
//                       display: 'flex',
//                       flexDirection: 'column',
//                       transition: 'transform 120ms ease, box-shadow 120ms ease',
//                       '&:hover': { boxShadow: 6, transform: 'translateY(-2px)' },
//                     }}
//                   >
//                     <CardActionArea onClick={() => gotoEditor(data?.uuid, data?.cardId?.uuid)}>
//                       <CardMedia
//                         component="img"
//                         src={img}
//                         alt={title}
//                         loading="lazy"
//                         sx={{ width: '100%', aspectRatio: '1 / 1.414', objectFit: 'cover' }}
//                       />
//                       <CardContent sx={{ pb: 1.5, pt: 1 }}>
//                         <Typography
//                           variant="h6"
//                           sx={{ color: '#c165a0', fontWeight: 600, mb: 1, textAlign: 'left' }}
//                         >
//                           {title}
//                         </Typography>
//
//                         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                           <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 'bolder' }}>
//                             {`${price} A$`}
//                           </Typography>
//                           <Button
//                             variant="outlined"
//                             sx={{
//                               borderRadius: '20px !important',
//                               color: '#c165a0',
//                               px: 2,
//                               '&:hover': {
//                                 backgroundColor: '#c165a0',
//                                 color: 'white',
//                               },
//                             }}
//                           >
//                             Buy Now
//                           </Button>
//                         </Box>
//                       </CardContent>
//                     </CardActionArea>
//                   </Card>
//                 </Grid>
//               );
//             })}
//           </Grid>
//         </SwiperSlide>
//       ))}
//     </Swiper>
//   );
// }
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
import 'swiper/css';
import 'swiper/css/navigation';
import Link from 'next/link';
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
let WEB_URL = process.env.NEXT_PUBLIC_WEB_URL;
export default function CardsCarousel({ allCards = [] }) {
  const router = useRouter();
  const gotoEditor = (uuid, cardUUID) => router.push(`/card-editor/${uuid}?selected=${cardUUID}`);

  // const goToCheckout = () => {
  //   router.push('/checkout')
  // };

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
      {(Array.isArray(allCards) ? allCards : []).map((data, idx) => {
        const key = data?.uuid || idx;
        const img = `${BASE_URL}/${data?.cardId?.frontDesign}`;
        const title = data?.cardId?.title || 'Untitled';
        const price = data?.cardId?.price;

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
                  // sx={{ width: '100%', aspectRatio: '1 / 1.414', objectFit: 'cover' }}
                  sx={{ width: '100%',height:300, objectFit: 'cover' }}
                />
                <CardContent sx={{ pb: 1.5, pt: 1 }}>
                  <Typography variant="h6"
                              sx={{ color: '#c165a0', fontWeight: 600, mb: 1, textAlign: 'left' }}>
                    {title}
                  </Typography>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 'bolder' }}>
                      {/*{`${price} A$`}*/}
                      {`${price} AUD`}
                    </Typography>
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
                </CardContent>
              </CardActionArea>
            </Card>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}
