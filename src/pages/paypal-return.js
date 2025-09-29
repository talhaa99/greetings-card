// PAYPAL INTEGRATION COMMENTED OUT - SWITCHING TO STRIPE
// pages/paypal-return.jsx
// import { useRouter } from 'next/router';
// import { useEffect } from 'react';
// import { Box, CircularProgress } from '@mui/material';

// const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
// const WEB_URL  = process.env.NEXT_PUBLIC_WEB_URL;

// export default function PaypalReturn() {
//   const router = useRouter();
//   const { token } = router.query; // PayPal orderID (?token=...)

//   useEffect(() => {
//     if (!token) return;
//     (async () => {
//       try {
//         const resp = await fetch(`${API_URL}/api/paypal/capture/${token}`, { method: 'POST' });
//         const json = await resp.json();
//         if (resp.ok && json?.status === 'COMPLETED') {
//           router.replace('/success');
//         } else {
//           router.replace('/cancel');
//         }
//       } catch {
//         router.replace('/cancel');
//       }
//     })();
//   }, [token]);

//   return (
//     <Box
//       sx={{
//         minHeight: '100vh',
//         display: 'grid',
//         placeItems: 'center',
//         backgroundImage: {
//           xs: `url(${WEB_URL}/thankPortrate.png)`, md: `url(${WEB_URL}/thankYou.png)`
//         },
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//         backgroundRepeat: 'no-repeat'
//       }}
//     >
//       <CircularProgress size={64} thickness={4.5} />
//       {/* screen readers ko hint dene ke liye (visible text nahi) */}
//       {/*<span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>*/}
//       {/*  Finalizing payment…*/}
//       {/*</span>*/}
//     </Box>
//   );
// }
