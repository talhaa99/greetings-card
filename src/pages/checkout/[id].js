// CheckoutPage.jsx
import * as React from 'react';
import {
  Radio, RadioGroup,
  Box, Container, Grid, Card, CardContent, CardMedia, TextField, Typography, InputBase,Autocomplete,
  Select, MenuItem, FormControlLabel, Checkbox, Divider, IconButton, InputAdornment, Button, Stack
} from '@mui/material';
import Add from '@mui/icons-material/Add';
import Remove from '@mui/icons-material/Remove';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import AddressAutocompleteLocationIQ from '../../components/locationIqAutocomplete';
const WEB_URL = process.env.NEXT_PUBLIC_WEB_URL;
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const ACCENT = '#000'; // headings in mock are black; change if needed
import axios from 'axios';
import { FormControl, InputLabel, FormHelperText } from '@mui/material';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';

// === OrderItem (defensive) ===

function OrderItem({ item, onQty }) {
  const line = (item.price * item.qty);
  // const stackOnMd = Number(item.qty) >= 1000000;
  const stackOnMd = Number(item.qty) >= 100000;
  return (
    // <Card variant="outlined" sx={{ borderRadius: 1.5, mb: 1.5 }}>
    //   <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.25 }}>
    //     <Box sx={{ flex: 1 }}>
    //       <CardMedia
    //         component="img"
    //         image={item.image}
    //         alt={item.title}
    //         sx={{
    //           width: 80,
    //           height: 80,
    //           borderRadius: 1,
    //           objectFit: 'cover',
    //           border: '1px solid #ddd'
    //         }}
    //       />
    //       <Typography fontWeight={700} sx={{ ml: 0.5 }} noWrap>{item.title}</Typography>
    //     </Box>
    //
    //     <Stack alignItems="flex-end" sx={{ minWidth: 100 }}>
    //       <Typography fontWeight={700}>
    //         ${item.price.toFixed(2)} <Typography component="span" variant="caption">Per
    //         Card</Typography>
    //       </Typography>
    //       <Typography variant="caption" color="text.secondary">
    //         ${item.price.toFixed(2)} × {item.qty} = <b>${line}</b>
    //       </Typography>
    //     </Stack>
    //     <Box
    //       sx={{
    //         display: 'inline-flex',
    //         alignItems: 'center',
    //         border: '1px solid',
    //         borderColor: 'divider',
    //         borderRadius: 2,
    //         height: 36,
    //         px: 0.5,
    //         gap: 0.5,
    //         flexShrink: 0              // don’t squish the control
    //       }}
    //     >
    //       <IconButton
    //         size="small"
    //         onClick={() => onQty(item.id, Math.max(1, item.qty - 1))}
    //         sx={{ p: 0.5 }}
    //         aria-label="decrease quantity"
    //       >
    //         <Remove fontSize="small"/>
    //       </IconButton>
    //
    //       <InputBase
    //         value={item.qty}
    //         onChange={(e) => {
    //           const v = e.target.value.replace(/\D+/g, '');      // numeric only
    //           onQty(item.id, Math.max(1, Number(v || 1)));
    //         }}
    //         inputMode="numeric"
    //         sx={{
    //           textAlign: 'center',
    //           fontWeight: 600,
    //           lineHeight: 1,
    //           px: 0.5,
    //           // Grow with digits so the full value is always visible
    //           width: `clamp(28px, ${String(item.qty).length + 1}ch, 220px)`
    //         }}
    //       />
    //
    //       <IconButton
    //         size="small"
    //         onClick={() => onQty(item.id, item.qty + 1)}
    //         sx={{ p: 0.5 }}
    //         aria-label="increase quantity"
    //       >
    //         <Add fontSize="small"/>
    //       </IconButton>
    //     </Box>
    //   </CardContent>
    // </Card>
    <Card variant="outlined" sx={{
      borderRadius: 1.5,
      minWidth:{md:400},
      mb: 2.5,
      width: '100%',
      // display: 'flex',
      // justifyContent:'center',
      // alignItems:'center',
      height: '100%'
    }}>
      <CardContent sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        p: 1.25,
        flexDirection: stackOnMd ? 'column' : 'row'
      }}>
        <Box sx={{ width:'100%', display:'flex', justifyContent:'center', alignItems:'flex-start', height:'100%', flexDirection:'column'}}>
          <CardMedia
            component="img"
            image={item.image}
            alt={item.title}
            sx={{
              // mt:1,
              width: { md: 80, xs: 100 },
              height: { md: 80, xs: 100 },
              borderRadius: 1,
              objectFit: 'cover',
              border: '1px solid #ddd'
            }}
          />
          <Typography fontWeight={700} sx={{ ml: 0.5,
            alignItems: 'baseline',
            gap: 0.5,
            whiteSpace: 'wrap'}} noWrap>{item.title}</Typography>
        </Box>
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'column' },
          justifyContent: 'center',
          // bgcolor:'red',
          width:'100%',
          gap: 2,
          alignItems: 'flex-start',
          height: '100%'
        }}>
          <Stack alignItems="flex-start" sx={{ width: '100%' }}>
            <Typography
              variant='h4'
              fontWeight={700}
              noWrap
              sx={{
                display: 'inline-flex',
                alignItems: 'baseline',
                gap: 0.5,
                whiteSpace: 'nowrap'
              }}
            >
              AUD {item?.price}
              <Typography
                // variant='h5'
                component="span"
                variant="caption"
                sx={{ display: 'inline', whiteSpace: 'nowrap' }}
              >
                Per Card
              </Typography>
            </Typography>

            <Typography variant="h7" sx={{mt:1}} color="text.secondary">
              AUD {item?.price} × {item.qty} = <b>AUD {line}</b>
            </Typography>
          </Stack>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              height: 36,
              px: 0.5,
              gap: 0.5,
              flexShrink: 0              // don’t squish the control
            }}
          >
            <IconButton
              size="small"
              onClick={() => onQty(item.id, Math.max(1, item.qty - 1))}
              sx={{ p: 0.5 }}
              aria-label="decrease quantity"
            >
              <Remove fontSize="small"/>
            </IconButton>

            <InputBase
              value={item.qty}
              onChange={(e) => {
                const v = e.target.value.replace(/\D+/g, '');      // numeric only
                onQty(item.id, Math.max(1, Number(v || 1)));
              }}
              inputMode="numeric"
              sx={{
                textAlign: 'center',
                fontWeight: 600,
                lineHeight: 1,
                px: 0.5,
                // Grow with digits so the full value is always visible
                width: `clamp(28px, ${String(item.qty).length + 1}ch, 220px)`
              }}
            />

            <IconButton
              size="small"
              onClick={() => onQty(item.id, item.qty + 1)}
              sx={{ p: 0.5 }}
              aria-label="increase quantity"
            >
              <Add fontSize="small"/>
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { id } = router.query;
  const [open, setOpen] = useState(false);
  const [expressShipping, setExpressShipping] = useState(false);
  const [shippingMethod, setShippingMethod] = useState('normal');
  const SHIPPING_PRICES= { normal: 10, express: 20 };
  const shippingRate = SHIPPING_PRICES[shippingMethod];

  const [state, setState] = useState('South Australia');
  const [items, setItems] = React.useState([
    {
      id: 1,
      title: '',
      price: 0,
      qty: 1,
      image: ''

    }
  ]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/api/transactions/get-single-transaction-detail/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
          }
        }
      );

      const d = response?.data?.data;
      setData(d);

      if (d?.cardId) {
        setItems([
          {
            id: d?.cardId?._id || d?._id || 'line-1',
            title: d?.cardId?.title,
            price: Number(d?.cardId?.price) || 0,
            qty: 1,
            image: `${API_URL}/${d?.cardId?.frontDesign}`
          }
        ]);
      }
    } catch (error) {
      console.log('Error in get user card customization for checkout', error);
    }
  };

  useEffect(() => {
    getData();
  }, [id]);

// calculate gst on shipping and express shipping price too
  // const shipping = 10;
  // const expressShippingRate = 10;
  // const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  // const gst = expressShipping ? (subtotal + shipping + expressShippingRate) * 0.1 : (subtotal + shipping) * 0.1;
  // const total = expressShipping ? Number(subtotal + shipping + gst + expressShippingRate).toFixed(2) : Number(subtotal + shipping + gst).toFixed(2);


  //latest calculation:
  const shipping = 10;
  const expressShippingRate = 20;
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const gst = expressShipping ? (subtotal + shipping + expressShippingRate) * 0.1 : (subtotal + shipping) * 0.1;
  // const gst = (subtotal) * 0.1;
  const total = expressShipping
    ? Number(subtotal + shipping + gst + expressShippingRate).toFixed(2)
    : Number(subtotal + shipping + gst).toFixed(2);

  // const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  // const gst = (subtotal + shippingRate) * 0.1;
  // const total = Number(subtotal + shippingRate + gst).toFixed(2);

  const onQty = (id, qty) => setItems((prev) => prev.map(i => i.id === id ? { ...i, qty } : i));
  const formatPrice = (value) => Number(value).toFixed(2);
  // which country to fetch states for
  // const COUNTRY = 'Australia';

  const [states, setStates] = useState([]);
  const [data, setData] = useState('');
  const [loading, setLoading] = useState(false);
  const [australiaStates, setAustraliaStates] = useState('');
  const [loadingStates, setLoadingStates] = useState(false);
  const [statesError, setStatesError] = useState('');
  const [currency, setCurrency] = useState({});
  const [news, setNews] = useState(false);
  const [termAndConditions, setTermAndConditions] = useState(false);
  const [message, setMessage] = useState('');

  //get stats of australia
  // React.useEffect(() => {
  //   let mounted = true;
  //   const loadStates = async () => {
  //     try {
  //       setLoadingStates(true);
  //       setStatesError('');
  //       // Public endpoint: returns { data: { name, states:[{name}...] } }
  //       const res = await fetch('https://countriesnow.space/api/v0.1/countries/states', {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify({ country: 'Australia' })
  //       });
  //       const data = await res.json();
  //
  //       const list = data?.data?.states?.map((s) => s.name).filter(Boolean) ?? [];
  //
  //       if (mounted) {
  //         setStates(list.sort());
  //       }
  //     } catch (e) {
  //       if (mounted) {
  //         setAustraliaStates([]);
  //         setStatesError('Failed to load states');
  //       }
  //     } finally {
  //       if (mounted) {
  //         setLoadingStates(false);
  //       }
  //     }
  //   };
  //   loadStates();
  //   return () => { mounted = false; };
  // }, [COUNTRY]);

  const fetchOtherCurrencies = async () => {
    try {
      const response = await axios.get(`https://open.er-api.com/v6/latest/EUR`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setCurrency(response.data.rates);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.msg);
    }
  };
  // console.log('currency=', currency);
  useEffect(() => {
    fetchOtherCurrencies();
  }, []);

  const handleCheckout = async (audCalculatedTotalPrice) => {
    try {

      // const CardPriceInAud = Number((data?.price * currency['AUD']).toFixed(2));

      // console.log('CardPriceInAud', CardPriceInAud);

      const frontCardImage = data?.frontDesign?.startsWith('http')
        ? encodeURI(data.frontDesign) // encode special characters
        : encodeURI(`${API_URL}${data?.frontDesign}`);

      console.log('frontCardImage', frontCardImage);

      const productPayload = {
        price: audCalculatedTotalPrice,
        // frontCardImage
        frontCardImage: 'https://greetings-card-apis.tecshield.net/uploads/images/User-ar-experience/1755244773209-44806.jpg'
      };
      console.log('productPayload', productPayload);
      const res = await fetch(`${API_URL}/api/payment/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ product: productPayload })
      });

      const response = await res.json();
      console.log('response in checkout', response);
      if (response.url) {
        window.location.href = response.url;
      }
    } catch (error) {
      console.error('Checkout error', error);
      alert('Error initiating checkout');
    }
  };
  //
  // useEffect(() => {
  //   if (auth?.isAuthenticated) {
  //     const shouldRedirect = localStorage.getItem('redirectToCheckout');
  //     if (shouldRedirect === 'true') {
  //       localStorage.removeItem('redirectToCheckout');
  //       handleCheckout();
  //     }
  //   }
  // }, [auth?.isAuthenticated]);

  //create checkout details in transaction

  // console.log('items[0].qty', items[0].qty);
  console.log("currency", currency);

  const formik = useFormik({
    initialValues: {
      cardCustomizationId: '',
      delivery_address: '',
      suburb: '',
      aud: '',
      price: '',
      quantity: '',
      state: '',
      title: '',
      postal_code: '',
      phone_number: '',
      newsAndOffers: false,
    //   shippingMethod:'',
    // shippingRate:'',
      expressShipping: false,
      expressShippingRate: '',
      termsAccepted: false,
      shipping: '',
      total: '',
      gst: '',
      submit: null
    },
    validationSchema: Yup.object({
      // title: Yup.string().trim().required('Title is required'),
      delivery_address: Yup.string().trim().required(' Street address is required'),
      suburb: Yup.string().trim().required('Suburb is required'),
      state: Yup.string().trim().required('State is required'),
      postal_code: Yup.string()
                      .matches(/^\d{3,10}$/, 'Postal code must be 3–10 digits')
                      .required('Postal code is required'),
      phone_number: Yup.string()
                       .matches(/^\+?[0-9\s()-]{7,20}$/, 'Enter a valid phone number')
                       .required('Phone number is required'),
      newsAndOffers: Yup.boolean(),
      expressShipping: Yup.boolean(),
      termsAccepted: Yup.boolean().oneOf([true], 'Please accept the terms and conditions')

    }),
    onSubmit: async (values, helpers) => {
      const loading = toast.loading(
        'order is  in process......',
        { duration: 15000 });

      setLoading(true);

      const audCalculatedTotalPrice = Number((total * currency['AUD']).toFixed(2));

      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/api/transactions/create`,
          {
            cardCustomizationId: data?._id,
            title: data?.cardId?.title,
            price: data?.cardId?.price,
            quantity: items[0].qty,
            aud: audCalculatedTotalPrice,
            delivery_address: values.delivery_address,
            suburb: values.suburb,
            state: values.state,
            postal_code: values.postal_code,
            phone_number: values.phone_number,
            newsAndOffers: values.newsAndOffers,
            // shippingMethod,
            // shippingRate,
            expressShipping: values.expressShipping,
            expressShippingRate: expressShipping ? expressShippingRate : 0,
            shipping,
            total,
            gst: formatPrice(gst)
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'x-access-token': token
            }
          });

        console.log('response------------', response);
        toast.success('Order place successfully');
        formik.resetForm();
        setShippingMethod('normal');
        setExpressShipping(false);
        // await handleCheckout(audCalculatedTotalPrice);
        setMessage('');
      } catch (err) {
        console.log('err', err);
        toast.error(err.message, { duration: 5000 });
        formik.resetForm();
      }
      toast.dismiss(loading);
      setLoading(false);
    }

  });
// put near the top of the component file
  const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '';

  return (
    <>
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
        <Container  sx={{
          mt: { xs: 5, md: 0 },
          mb: { xs: 5, md: 0 },
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          minHeight: '100vh'
        }}>
          <form noValidate
                onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ borderRadius: 1.5, pb: '0 !important', width:'100%',minWidth:{md:400}}}>
                  <CardContent sx={{ p: 2, pb: '0 !important' }}>
                    <Typography variant="h6" fontWeight={800}
                                sx={{ mb: 2, color: ACCENT }}>Delivery Address</Typography>
                    {/*<TextField fullWidth label="Street Address"*/}
                    {/*           error={!!(formik.touched.delivery_address*/}
                    {/*             && formik.errors.delivery_address)}*/}
                    {/*           helperText={formik.touched.delivery_address*/}
                    {/*             && formik.errors.delivery_address}*/}
                    {/*           name="delivery_address"*/}
                    {/*           onBlur={formik.handleBlur}*/}
                    {/*           onChange={formik.handleChange}*/}
                    {/*           value={formik.values.delivery_address}*/}
                    {/*           sx={{ mb: 3 }}*/}
                    {/*/>*/}
                    <AddressAutocompleteLocationIQ
                      formik={formik}
                      stateValue={formik.values.state}     // pass selected state
                      name="delivery_address"
                      label="Street Address"
                      sx={{
                         mb: 0
                      }}
                    />
                    {/*<Box*/}
                    {/*  sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'column', md: 'row' } }}>*/}
                    <TextField fullWidth label="Suburb"
                               error={!!(formik.touched.suburb
                                 && formik.errors.suburb)}
                               helperText={formik.touched.suburb
                                 && formik.errors.suburb}
                               name="suburb"
                               onBlur={formik.handleBlur}
                               onChange={formik.handleChange}
                               value={formik.values.suburb}
                               sx={{ mb: 2 }}/>
                    {/*<FormControl fullWidth*/}
                    {/*             error={Boolean(formik.touched.state && formik.errors.state)}>*/}
                    {/*  <InputLabel id="state-label">State</InputLabel>*/}
                    {/*  <Select*/}
                    {/*    labelId="state-label"*/}
                    {/*    label="State"*/}
                    {/*    name="state"*/}
                    {/*    value={formik.values.state}*/}
                    {/*    onChange={formik.handleChange}*/}
                    {/*    onBlur={formik.handleBlur}*/}
                    {/*  >*/}
                    {/*    {[*/}
                    {/*      'Australian Capital Territory',*/}
                    {/*      'New South Wales',*/}
                    {/*      'Victoria',*/}
                    {/*      'Queensland',*/}
                    {/*      'Northern Territory',*/}
                    {/*      'South Australia',*/}
                    {/*      'Tasmania',*/}
                    {/*      'Western Australia'*/}
                    {/*    ].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}*/}
                    {/*  </Select>*/}
                    {/*  <FormHelperText>*/}
                    {/*    {(formik.touched.state && formik.errors.state) || ' '}*/}
                    {/*  </FormHelperText>*/}
                    {/*</FormControl>*/}
                    <FormControl fullWidth error={Boolean(formik.touched.state && formik.errors.state)}>
                      <InputLabel shrink id="state-label">
                        State
                      </InputLabel>

                      <Autocomplete
                        id="state"
                        options={[
                          "Australian Capital Territory",
                          "New South Wales",
                          "Victoria",
                          "Queensland",
                          "Northern Territory",
                          "South Australia",
                          "Tasmania",
                          "Western Australia"
                        ]}
                        value={formik.values.state || null}
                        onChange={(_, newValue) => formik.setFieldValue("state", newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            label="State"
                            name="state"
                            onBlur={formik.handleBlur}
                            error={Boolean(formik.touched.state && formik.errors.state)}
                            helperText={(formik.touched.state && formik.errors.state) || " "}
                          />
                        )}
                      />
                    </FormControl>
                    {/*</Box>*/}
                    <Box sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', md: 'row' },
                      gap: { md: 1, xs: 2 },
                      mb: 2
                    }}>
                      <TextField fullWidth label="Postal Code"
                                 error={!!(formik.touched.postal_code
                                   && formik.errors.postal_code)}
                                 helperText={formik.touched.postal_code
                                   && formik.errors.postal_code}
                                 name="postal_code"
                                 onBlur={formik.handleBlur}
                                 onChange={formik.handleChange}
                                 value={formik.values.postal_code}
                      />
                      <TextField fullWidth label="Phone Number"
                                 error={!!(formik.touched.phone_number
                                   && formik.errors.phone_number)}
                                 helperText={formik.touched.phone_number
                                   && formik.errors.phone_number}
                                 name="phone_number"
                                 onBlur={formik.handleBlur}
                                 onChange={formik.handleChange}
                                 value={formik.values.phone_number}
                      />
                    </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        width: '100%',
                        mb: 4,
                        flexDirection: { xs: 'column', md: 'row' },
                        // gap: 2,
                        alignItems: { md: 'center', xs: 'left' }
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            sx={{ '& .MuiSvgIcon-root': { fontSize: 12 } }}
                            size="small"
                            name="newsAndOffers"
                            checked={formik.values.newsAndOffers}
                            onChange={formik.handleChange}
                          />
                        }
                        label="Email me with news and offers"
                        sx={{
                          '& .MuiFormControlLabel-label': {
                            fontSize: '14px'
                          }
                        }}
                      />

                      <FormControl
                        error={Boolean(formik.touched.termsAccepted && formik.errors.termsAccepted)}
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center', // ✅ keeps checkbox + label vertically centered
                          m: 0 // remove extra margin
                        }}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              sx={{ '& .MuiSvgIcon-root': { fontSize: 12 } }}
                              size="small"
                              name="termsAccepted"
                              checked={formik.values.termsAccepted}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                          }
                          label={
                            <Typography
                              onClick={handleClickOpen}
                              sx={{ cursor: 'pointer', fontSize: '14px' }}
                            >
                              Terms and conditions
                            </Typography>
                          }
                        />
                        <FormHelperText
                          sx={{ position: 'absolute', mt: 7, display: 'flex', fontSize: '10px' }}>
                          {(formik.touched.termsAccepted && formik.errors.termsAccepted) || ' '}
                        </FormHelperText>
                      </FormControl>


                    </Box>

                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card variant="outlined"
                      sx={{ borderRadius: 1.5, width: '100%' }}>
                  <CardContent sx={{ p: 2 }}>
                    {items.map(i => <OrderItem key={i.id} item={i} onQty={onQty}/>)}


                      {/*<Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>*/}
                      {/*  <RadioGroup*/}
                      {/*    row*/}
                      {/*    name="shippingMethod"*/}
                      {/*    value={shippingMethod}*/}
                      {/*    onChange={(e) => {*/}
                      {/*      const method = e.target.value === 'express' ? 'express' : 'normal';*/}
                      {/*      setShippingMethod(method);*/}
                      {/*      formik.setFieldValue('shippingMethod', method);*/}
                      {/*      formik.setFieldValue('shippingRate', SHIPPING_PRICES[method]);*/}
                      {/*    }}*/}
                      {/*  >*/}
                      {/*    <FormControlLabel*/}
                      {/*      value="normal"*/}
                      {/*      control={<Radio size="small" sx={{*/}
                      {/*        '& .MuiSvgIcon-root': {*/}
                      {/*          fontSize: 16,*/}
                      {/*        },*/}
                      {/*      }} />}*/}
                      {/*      label="Normal shipping (AUD 10)"*/}
                      {/*      sx={{*/}
                      {/*        '& .MuiFormControlLabel-label': {*/}
                      {/*          // fontSize: '0.8rem', // smaller label text*/}
                      {/*          fontWeight: 600*/}
                      {/*        }*/}
                      {/*      }}*/}
                      {/*    />*/}
                      {/*    <FormControlLabel*/}
                      {/*      value="express"*/}
                      {/*      control={<Radio size="small" sx={{*/}
                      {/*        '& .MuiSvgIcon-root': {*/}
                      {/*          fontSize: 16,*/}
                      {/*        },*/}
                      {/*      }} />}*/}
                      {/*      label="Express shipping (AUD 20)"*/}
                      {/*      sx={{*/}
                      {/*        '& .MuiFormControlLabel-label': {*/}
                      {/*          // fontSize: '0.8rem', // smaller label text*/}
                      {/*          fontWeight: 600*/}
                      {/*        }*/}
                      {/*      }}*/}
                      {/*    />*/}
                      {/*  </RadioGroup>*/}
                      {/*</Box>*/}



                      <Divider sx={{ mt: 1 }}/>
                      {/*<Typography fontWeight={700}>AUD {shippingRate.toFixed(2)}</Typography>*/}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography fontWeight={800} sx={{ mb: .5, color: ACCENT }}>Shipping
                          Price:</Typography>
                        <Typography fontWeight={700}>AUD {shipping.toFixed(2)}</Typography></Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', mt: '3' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              sx={{
                                '& .MuiSvgIcon-root': {
                                  fontSize: 14,       // size of the checkbox
                                  strokeWidth: 2.5   // makes the tick bolder
                                },
                                '&.Mui-checked .MuiSvgIcon-root': {
                                  fontWeight: 900    // simulates a "bold" look on checked state
                                }
                              }}
                              size="small"
                              name="expressShipping"
                              // checked={formik.values.expressShipping}
                              checked={expressShipping}
                              // onChange={formik.handleChange}
                              onChange={(e) => {
                                setExpressShipping(e.target.checked);   // toggle true/false
                                formik.setFieldValue('expressShipping', e.target.checked); // keep in formik
                              }}
                            />
                          }
                          label="Express shipping"
                          sx={{
                            '& .MuiFormControlLabel-label': {
                              fontWeight: 900       // bold label
                            },
                            marginLeft: '-10px'
                          }}
                        />
                        <Typography fontWeight={700}>
                          {`AUD ${expressShippingRate}`}
                        </Typography>
                      </Box>



                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography fontWeight={800} variant="body2"
                                    sx={{ mb: .5, color: ACCENT }}>GST (10%):</Typography>
                        <Typography variant="body2" fontWeight={700}>AUD {formatPrice(gst)}</Typography></Box>

                      {/*<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>*/}
                      {/*  <Typography fontWeight={800} sx={{ mb: .5, color: ACCENT }}>*/}
                      {/*    Shipping Price:*/}
                      {/*  </Typography>*/}
                      {/*  -  <Typography fontWeight={700}>AUD {shipping.toFixed(2)}</Typography>*/}
                      {/*  +  <Typography fontWeight={700}>AUD {shippingCost.toFixed(2)}</Typography>*/}
                      {/*</Box>*/}


                      <Divider sx={{ mt: 1 }}/>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography  variant="h6" fontWeight={900}
                                    sx={{ color: ACCENT }}>Total:</Typography>
                        <Typography variant="h6" fontWeight={900}>AUD {total}</Typography>
                      </Box>
                    </Box>
                     {/*PayPal Buttons */}
                    {/*<PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: 'AUD', intent: 'capture' }}>*/}
                    {/*  <PayPalButtons*/}
                    {/*    style={{ layout: 'vertical' }}*/}
                    {/*    createOrder={async () => {*/}
                    {/*      // ✅ amount already in AUD*/}
                    {/*      const amountAud = Number(total).toFixed(2);*/}
                    
                    {/*      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';*/}
                    {/*      const transactionId = (data && data._id) || undefined;*/}
                    
                    {/*      const resp = await fetch(`${API_URL}/api/paypal/create-order`, {*/}
                    {/*        method: 'POST',*/}
                    {/*        headers: {*/}
                    {/*          'Content-Type': 'application/json',*/}
                    {/*          ...(token ? { 'x-access-token': token } : {})*/}
                    {/*        },*/}
                    {/*        body: JSON.stringify({*/}
                    {/*          amount: amountAud,         // string like "12.34" is fine too*/}
                    {/*          currency: 'AUD',*/}
                    {/*          transactionId,*/}
                    {/*          meta: { title: data?.cardId?.title || 'Greetings Card' }*/}
                    {/*        }),*/}
                    {/*      });*/}
                    
                    {/*      if (!resp.ok) {*/}
                    {/*        const err = await resp.json().catch(() => ({}));*/}
                    {/*        console.error('create-order failed', err);*/}
                    {/*        throw new Error(err?.error || 'Failed to create order');*/}
                    {/*      }*/}
                    
                    {/*      const json = await resp.json();*/}
                    {/*      if (!json?.id) throw new Error('No order id returned');*/}
                    {/*      return json.id; // ✅ MUST return the order id*/}
                    {/*    }}*/}
                    {/*    onApprove={async ({ orderID }) => {*/}
                    {/*      const resp = await fetch(`${API_URL}/api/paypal/capture/${orderID}`, { method: 'POST' });*/}
                    {/*      const json = await resp.json();*/}
                    
                    {/*      if (json?.status === 'COMPLETED') {*/}
                    {/*        toast.success('Payment completed ✅');*/}
                    {/*        window.location.href = `${WEB_URL}/success`;*/}
                    {/*      } else {*/}
                    {/*        toast.error(`Payment status: ${json?.status || 'Unknown'}`);*/}
                    {/*      }*/}
                    {/*    }}*/}
                    {/*    onError={(err) => {*/}
                    {/*      console.error('PayPal error', err);*/}
                    {/*      toast.error('Payment failed');*/}
                    {/*    }}*/}
                    {/*    onCancel={() => toast('Payment cancelled')}*/}
                    {/*  />*/}
                    {/*</PayPalScriptProvider>*/}


                    <Button
                      fullWidth
                      type="submit"
                      // form="checkout-form"
                      variant="contained"
                      disabled={formik.isSubmitting}
                      sx={{
                        mt: 2,
                        // py: 1.25,
                        borderRadius: 1.5,
                        bgcolor: '#c165a0',
                        '&:hover': { bgcolor: '#c165a0' }
                      }}
                    >
                      Checkout
                    </Button>
                  </CardContent>

                </Card>
              </Grid>

            </Grid>
          </form>
        </Container>
      </Box>


      <React.Fragment>
        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth="md"
          PaperProps={{
            sx: {
              width: '100%',
              maxWidth: '1000px'
              // margin: "auto"
              // backgroundImage: {
              //   xs: `url(${WEB_URL}/portrate.png)`,
              //   md: `url(${WEB_URL}/bg1.png)`,
              // },
              // backgroundSize: "cover",
              // backgroundPosition: "center",
              // backgroundRepeat: "no-repeat",
            }
          }}
        >
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={12}>
                <Card sx={{
                  p: {
                    md: 3,
                    sm: 2,
                    boxShadow: 'none !important',
                    backgroundColor: 'transparent'
                  }
                }}>
                    <Typography gutterBottom variant="h6" padding="10px"
                                sx={{ textAlign: 'center', mt: { xs: 3, md: 0 } }}>
                      TERMS & CONDITIONS
                    </Typography>
                    <Typography gutterBottom variant="h6" padding="10px" sx={{ textAlign: 'center' }}>
                      Welcome to Greetings Card
                    </Typography>
                    <Typography gutterBottom variant="bod1" padding="10px" sx={{ textAlign: 'center' }}>
                      These Terms and Conditions (“Terms”, “Terms and Conditions”) govern your
                      relationship with Tecshield website’ applications mobile application (the
                      “Service”) operated by Tecshield. (“us”, “we”, or “our”).

                      Please read these Terms and Conditions carefully before using our website and
                      Tecshield’ mobile applications (the “Service”).

                      Your access to and use of the Service is conditioned on your acceptance of and
                      compliance with these Terms. These Terms apply to all visitors, users and others
                      who access or use the Service.

                      By accessing or using the Service you agree to be bound by these Terms. If you
                      disagree with any part of the terms then you may not access the Service.
                    </Typography>
                    <CardMedia/>
                    <CardContent>
                      <Typography gutterBottom variant="h6" component="div" sx={{ mt: 0, mb: 3 }}>
                        Purchases
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        If you wish to purchase any product or service made available through the
                        Service (“Purchase”), you may be asked to supply certain information relevant to
                        your Purchase including, without limitation, your credit card number, the
                        expiration date of your credit card, your billing address, and your shipping
                        information.

                        You represent and warrant that: (i) you have the legal right to use any credit
                        card(s) or other payment method(s) in connection with any Purchase; and that
                        (ii) the information you supply to us is true, correct and complete.

                        By submitting such information, you grant us the right to provide the
                        information to third parties for purposes of facilitating the completion of
                        Purchases.

                        We reserve the right to refuse or cancel your order at any time for certain
                        reasons including but not limited to: product or service availability, errors in
                        the description or price of the product or service, error in your order or other
                        reasons.

                        We reserve the right to refuse or cancel your order if fraud or an unauthorised
                        or illegal transaction is suspected.
                      </Typography>
                      <Typography gutterBottom variant="h6" component="div" sx={{ mt: 3, mb: 3 }}>
                        Availability, Errors and Inaccuracies
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        We are constantly updating our offerings of products and services on the
                        Service. The products or services available on our Service may be mispriced,
                        described inaccurately, or unavailable, and we may experience delays in updating
                        information on the Service and in our advertising on other web sites.

                        We cannot and do not guarantee the accuracy or completeness of any information,
                        including prices, product images, specifications, availability, and services. We
                        reserve the right to change or update information and to correct errors,
                        inaccuracies, or omissions at any time without prior notice.
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        2.2 After the purchase, the product will be available for download, if the game
                        cannot be
                        downloaded please contact us by Email: team@brandongame.com and we will send it
                        to
                        you
                        manually.
                      </Typography>
                      <Typography gutterBottom variant="h6" component="div" sx={{ mt: 3, mb: 3 }}>
                        Contests, Sweepstakes and Promotions
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Any contests, sweepstakes or other promotions (collectively, “Promotions”) made
                        available through the Service may be governed by rules that are separate from
                        these Terms. If you participate in any Promotions, please review the applicable
                        rules as well as our Privacy Policy. If the rules for a Promotion conflict with
                        these Terms, the Promotion rules will apply.
                        <Typography gutterBottom variant="h6" component="div" sx={{ mt: 3, mb: 3 }}>
                          Subscriptions
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Some parts of the Service are billed on a subscription basis
                          (“Subscription(s)”). You will be billed in advance on a recurring and periodic
                          basis (weekly, monthly, yearly). Billing cycles are set either on a monthly or
                          annual basis, depending on the type of subscription plan you select when
                          purchasing a Subscription.

                          At the end of each Billing Cycle, your Subscription will automatically renew
                          under the exact same conditions unless you cancel it or Tecshield. cancels it.
                          You may cancel your Subscription renewal either through your online account
                          management page.

                          A valid payment method, including credit card or PayPal, is required to
                          process the payment for your Subscription. You shall provide Tecshield with
                          accurate and complete billing information including full name, address, state,
                          zip code, telephone number, and a valid payment method information. By
                          submitting such payment information, you automatically authorize Tecshield to
                          charge all Subscription fees incurred through your account to any such payment
                          instruments.

                          Should automatic billing fail to occur for any reason, Tecshield will issue an
                          electronic invoice indicating that you must proceed manually, within a certain
                          deadline date, with the full payment corresponding to the billing period as
                          indicated on the invoice.
                        </Typography>
                        <Typography gutterBottom variant="h6" component="div" sx={{ mt: 3, mb: 3 }}>
                          Free Trial
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Tecshield may, at its sole discretion, offer a Subscription with a free trial
                          for a limited period of time (“Free Trial”).

                          You may be required to enter your billing information in order to sign up for
                          the Free Trial.

                          If you do enter your billing information when signing up for the Free Trial,
                          you will not be charged by Tecshield until the Free Trial has expired. On the
                          last day of the Free Trial period, unless you cancelled your Subscription, you
                          will be automatically charged the applicable Subscription fees for the type of
                          Subscription you have selected.

                          At any time and without notice, Tecshield reserves the right to (i) modify the
                          terms and conditions of the Free Trial offer, or (ii) cancel such Free Trial
                          offer.
                        </Typography>
                        <Typography gutterBottom variant="h6" component="div" sx={{ mt: 3, mb: 3 }}>
                          Fee Changes
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Tecshield, in its sole discretion and at any time, may modify the Subscription
                          fees for the Subscriptions. Any Subscription fee change will become effective
                          at the end of the then-current Billing Cycle.

                          Tecshield will provide you with a reasonable prior notice of any change in
                          Subscription fees to give you an opportunity to terminate your Subscription
                          before such change becomes effective.

                          Your continued use of the Service after the Subscription fee change comes into
                          effect constitutes your agreement to pay the modified Subscription fee amount.
                        </Typography>
                        <Typography gutterBottom variant="h6" component="div" sx={{ mt: 3, mb: 3 }}>
                          Refunds
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Except when required by law, paid Subscription fees are non-refundable.
                        </Typography>
                        <Typography gutterBottom variant="h6" component="div" sx={{ mt: 3, mb: 3 }}>
                          Content
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Our Service allows you to post, link, store, share and otherwise make
                          available certain information, text, graphics, videos, or other material
                          (“Content”). You are responsible for the Content that you post to the Service,
                          including its legality, reliability, and appropriateness.

                          By posting Content to the Service, you grant us the right and license to use,
                          modify, publicly perform, publicly display, reproduce, and distribute such
                          Content on and through the Service. You retain any and all of your rights to
                          any Content you submit, post or display on or through the Service and you are
                          responsible for protecting those rights. You agree that this license includes
                          the right for us to make your Content available to other users of the Service,
                          who may also use your Content subject to these Terms.

                          You represent and warrant that: (i) the Content is yours (you own it) or you
                          have the right to use it and grant us the rights and license as provided in
                          these Terms, and (ii) the posting of your Content on or through the Service
                          does not violate the privacy rights, publicity rights, copyrights, contract
                          rights or any other rights of any person
                        </Typography>
                        <Typography gutterBottom variant="h6" component="div" sx={{ mt: 3, mb: 3 }}>
                          Accounts
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          When you create an account with us, you must provide us information that is
                          accurate, complete, and current at all times. Failure to do so constitutes a
                          breach of the Terms, which may result in immediate termination of your account
                          on our Service.

                          You are responsible for safeguarding the password that you use to access the
                          Service and for any activities or actions under your password, whether your
                          password is with our Service or a third-party service.

                          You agree not to disclose your password to any third party. You must notify us
                          immediately upon becoming aware of any breach of security or unauthorized use
                          of your account.

                          You may not use as a username the name of another person or entity or that is
                          not lawfully available for use, a name or trade mark that is subject to any
                          rights of another person or entity other than you without appropriate
                          authorization, or a name that is otherwise offensive, vulgar or obscene.

                          If you sign into the Service with Facebook Connect we will collect information
                          that is visible via your Facebook account such as: (1) your first and last
                          name, (2) Facebook ID, (3) Profile Picture/URL, and (4) list of Facebook
                          friends. Your Account may be used to publicly identify you as part of social
                          features of the Service, which may include user-to-user interaction, chat or
                          messaging functionality, public leaderboards, head-to-head competition, and
                          other similar features. Your username will be public and will be shown to
                          other users, but will only permit access to information that is considered
                          public or that you have designated as public in your user profile settings.
                          All info here is provided by the User voluntarily to simplify the
                          authorization process and use of social features. Learn about how to remove
                          your Facebook integration with our Service: HERE
                        </Typography>
                        <Typography gutterBottom variant="h6" component="div" sx={{ mt: 3, mb: 3 }}>
                          Copyright Policy
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          We respect the intellectual property rights of others. It is our policy to
                          respond to any claim that Content posted on the Service infringes the
                          copyright or other intellectual property infringement (“Infringement”) of any
                          person.

                          If you are a copyright owner or authorized on behalf of one, and you believe
                          that the copyrighted work has been copied in a way that constitutes copyright
                          infringement that is taking place through the Service, you must submit your
                          notice in writing to the attention of “Copyright Infringement” of
                          support@tecshield.io and include in your notice a detailed description of the
                          alleged Infringement.

                          You may be held accountable for damages (including costs and attorneys’ fees)
                          for misrepresenting that any Content is infringing your copyright.
                        </Typography>

                        <Typography gutterBottom variant="h6" component="div" sx={{ mt: 3, mb: 3 }}>
                          Intellectual Property
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          The Service and its original content (excluding Content provided by users),
                          features and functionality are and will remain the exclusive property of
                          Tecshield and its licensors. The Service is protected by copyright, trademark,
                          and other laws of both the Singapore and foreign countries. Our trademarks and
                          trade dress may not be used in connection with any product or service without
                          the prior written consent of Tecshield.
                        </Typography>
                        <Typography gutterBottom variant="h6" component="div" sx={{ mt: 3, mb: 3 }}>
                          Links To Other Web Sites
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Our Service may contain links to third-party web sites or services that are
                          not owned or controlled by Tecshield.

                          Tecshield has no control over, and assumes no responsibility for, the content,
                          privacy policies, or practices of any third party web sites or services. You
                          further acknowledge and agree that Tecshield shall not be responsible or
                          liable, directly or indirectly, for any damage or loss caused or alleged to be
                          caused by or in connection with use of or reliance on any such content, goods
                          or services available on or through any such web sites or services.

                          We strongly advise you to read the terms and conditions and privacy policies
                          of any third-party web sites or services that you visit.
                        </Typography>
                        <Typography gutterBottom variant="h6" component="div" sx={{ mt: 3, mb: 3 }}>
                          Termination
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          We may terminate or suspend your account immediately, without prior notice or
                          liability, for any reason whatsoever, including without limitation if you
                          breach the Terms.

                          Upon termination, your right to use the Service will immediately cease. If you
                          wish to terminate your account, you may simply discontinue using the Service.
                        </Typography>
                        <Typography gutterBottom variant="h6" component="div" sx={{ mt: 3, mb: 3 }}>
                          Limitation Of Liability
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          In no event shall Tecshield, nor its directors, employees, partners, agents,
                          suppliers, or affiliates, be liable for any indirect, incidental, special,
                          consequential or punitive damages, including without limitation, loss of
                          profits, data, use, goodwill, or other intangible losses, resulting from (i)
                          your access to or use of or inability to access or use the Service; (ii) any
                          conduct or content of any third party on the Service; (iii) any content
                          obtained from the Service; and (iv) unauthorized access, use or alteration of
                          your transmissions or content, whether based on warranty, contract, tort
                          (including negligence) or any other legal theory, whether or not we have been
                          informed of the possibility of such damage, and even if a remedy set forth
                          herein is found to have failed of its essential purpose.
                        </Typography>
                        <Typography gutterBottom variant="h6" component="div" sx={{ mt: 3, mb: 3 }}>
                          Disclaimer
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Your use of the Service is at your sole risk. The Service is provided on an
                          “AS IS” and “AS AVAILABLE” basis. The Service is provided without warranties
                          of any kind, whether express or implied, including, but not limited to,
                          implied warranties of merchantability, fitness for a particular purpose,
                          non-infringement or course of performance.

                          Tecshield its subsidiaries, affiliates, and its licensors do not warrant that
                          a) the Service will function uninterrupted, secure or available at any
                          particular time or location; b) any errors or defects will be corrected; c)
                          the Service is free of viruses or other harmful components; or d) the results
                          of using the Service will meet your requirements.’ fees)
                          for misrepresenting that any Content is infringing your copyright.
                        </Typography>
                        <Typography gutterBottom variant="h6" component="div" sx={{ mt: 3, mb: 3 }}>
                          Governing Law
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          These Terms shall be governed and construed in accordance with the laws of
                          Singapore, without regard to its conflict of law provisions.

                          Our failure to enforce any right or provision of these Terms will not be
                          considered a waiver of those rights. If any provision of these Terms is held
                          to be invalid or unenforceable by a court, the remaining provisions of these
                          Terms will remain in effect. These Terms constitute the entire agreement
                          between us regarding our Service, and supersede and replace any prior
                          agreements we might have between us regarding the Service.
                        </Typography>
                        <Typography gutterBottom variant="h6" component="div" sx={{ mt: 3, mb: 3 }}>
                          Changes
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          We reserve the right, at our sole discretion, to modify or replace these Terms
                          at any time. If a revision is material we will try to provide at least 15 days
                          notice prior to any new terms taking effect. What constitutes a material
                          change will be determined at our sole discretion.

                          By continuing to access or use our Service after those revisions become
                          effective, you agree to be bound by the revised terms. If you do not agree to
                          the new terms, please stop using the Service.
                        </Typography>
                        <Typography gutterBottom variant="h6" component="div" sx={{ mt: 3, mb: 3 }}>
                          Contact Us
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          If you have any questions about these Terms, please contact us at <b>Email: team@greetingsCard.com</b>
                        </Typography>
                      </Typography>
                    </CardContent>
                  </Card>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      </React.Fragment>
    </>
  );
}
