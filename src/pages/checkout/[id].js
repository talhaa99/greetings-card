// CheckoutPage.jsx
import * as React from 'react';
import {
  Box, Container, Grid, Card, CardContent, CardMedia, TextField, Typography, InputBase,
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
  const line = (item.price * item.qty).toFixed(2);
  return (
    <Card variant="outlined" sx={{ borderRadius: 1.5, mb: 1.5 }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.25 }}>
        <Box sx={{ flex: 1 }}>
          <CardMedia
            component="img"
            image={item.image}
            alt={item.title}
            sx={{
              width: 80,
              height: 80,
              borderRadius: 1,
              objectFit: 'cover',
              border: '1px solid #ddd'
            }}
          />
          <Typography fontWeight={700} sx={{ ml: 0.5 }} noWrap>{item.title}</Typography>
        </Box>

        <Stack alignItems="flex-end" sx={{ minWidth: 100 }}>
          <Typography fontWeight={700}>
            ${item.price.toFixed(2)} <Typography component="span" variant="caption">Per
            Card</Typography>
          </Typography>
          <Typography variant="caption" color="text.secondary">
            ${item.price.toFixed(2)} × {item.qty} = <b>${line}</b>
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
      </CardContent>
    </Card>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { id } = router.query;
  const [open, setOpen] = useState(false);
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

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);

  console.log('subtotal', subtotal);
  const shipping = 10;
  const total = subtotal + shipping;

  const onQty = (id, qty) => setItems((prev) => prev.map(i => i.id === id ? { ...i, qty } : i));

  // which country to fetch states for
  const COUNTRY = 'Australia';

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
  React.useEffect(() => {
    let mounted = true;
    const loadStates = async () => {
      try {
        setLoadingStates(true);
        setStatesError('');
        // Public endpoint: returns { data: { name, states:[{name}...] } }
        const res = await fetch('https://countriesnow.space/api/v0.1/countries/states', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ country: 'Australia' })
        });
        const data = await res.json();

        const list = data?.data?.states?.map((s) => s.name).filter(Boolean) ?? [];

        if (mounted) {
          setStates(list.sort());
        }
      } catch (e) {
        if (mounted) {
          setAustraliaStates([]);
          setStatesError('Failed to load states');
        }
      } finally {
        if (mounted) {
          setLoadingStates(false);
        }
      }
    };
    loadStates();
    return () => { mounted = false; };
  }, [COUNTRY]);

  console.log('data', data);

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
  console.log('currency=', currency);
  useEffect(() => {
    fetchOtherCurrencies();
  }, []);

  const handleCheckout = async () => {
    try {

      const CardPriceInAud = Number((data?.price * currency['AUD']).toFixed(2));

      console.log('CardPriceInAud', CardPriceInAud);

      const frontCardImage = data?.frontDesign?.startsWith('http')
        ? encodeURI(data.frontDesign) // encode special characters
        : encodeURI(`${API_URL}${data?.frontDesign}`);

      console.log('frontCardImage', frontCardImage);

      const productPayload = {
        title: data?.title,
        price: CardPriceInAud,
        userId: auth?.user?._id,
        cardCustomizationId: cardData?._id,
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
        // localStorage.setItem('checkoutProduct', JSON.stringify({
        //   name: data?.title,
        //   price: data?.price
        // }));
        window.location.href = response.url;
      }
      // else {
      //   alert('Something went wrong!');
      // }
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

  console.log('items[0].qty', items[0].qty);

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
      submit: null
    },
    validationSchema: Yup.object({
      title: Yup.string().trim().required('Title is required'),
      delivery_address: Yup.string().trim().required(' Street address is required'),
      suburb: Yup.string().trim().required('Suburb is required'),
      state: Yup.string().trim().required('State is required'),
      postal_code: Yup.string()
                      .matches(/^\d{3,10}$/, 'Postal code must be 3–10 digits')
                      .required('Postal code is required'),
      phone_number: Yup.string()
                       .matches(/^\+?[0-9\s()-]{7,20}$/, 'Enter a valid phone number')
                       .required('Phone number is required'),
      newsAndOffers: Yup.boolean()

    }),
    onSubmit: async (values, helpers) => {
      const loading = toast.loading(
        'order is  in process......',
        { duration: 15000 });
      // const loading = toast.loading('login in process...');
      setLoading(true);
      console.log('formik.values.state', values.state);
      console.log('newsAndOffers', newsAndOffers);

      const audCalculatedTotalPrice = Number((total * currency['AUD']).toFixed(2));
      console.log('audCalculatedTotalPrice', audCalculatedTotalPrice);

      if (!termAndConditions) {
        setMessage('Please check the terms and conditions');
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(API_URL + '/api/transactions/create',
          {
            cardCustomizationId: data?._id,
            title: data?.cardId?.title,
            price: values.price ?? data?.cardId?.price,
            quantity: items[0].qty,
            aud: audCalculatedTotalPrice,
            delivery_address: values.delivery_address,
            suburb: values.suburb,
            state: values.state,
            postal_code: values.postal_code,
            phone_number: values.phone_number,
            newsAndOffers: newsAndOffers || false
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'x-access-token': token
            }
          }
        );
        console.log("response", response);
        toast.success('Order place successfully');
        formik.resetForm();
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
        <Container sx={{
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
          <Grid container spacing={4}>

              <Grid item xs={12} md={7}>
                <Card variant="outlined" sx={{ borderRadius: 1.5, mb: 3 }}>
                  <CardContent>

                    <Typography variant="h6" fontWeight={800}
                                sx={{ mb: 1, color: ACCENT }}>Delivery Address</Typography>
                    <TextField fullWidth label="Street Address"
                               error={!!(formik.touched.delivery_address
                                 && formik.errors.delivery_address)}
                               helperText={formik.touched.delivery_address
                                 && formik.errors.delivery_address}
                               name="delivery_address"
                               onBlur={formik.handleBlur}
                               onChange={formik.handleChange}
                               value={formik.values.delivery_address}
                               sx={{ mb: 2 }}
                    />

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
                    <FormControl
                      fullWidth
                      error={Boolean(formik.touched.state && formik.errors.state)}
                      disabled={loadingStates || states.length === 0}
                    >
                      <InputLabel id="state-label">State</InputLabel>
                      <Select
                        labelId="state-label"
                        id="state"
                        name="state"
                        sx={{ mb: 2 }}
                        label="State"
                        value={formik.values.state}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      >
                        {states.map((s) => (
                          <MenuItem key={s} value={s}>{s}</MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>
                        {formik.touched.state && formik.errors.state}
                      </FormHelperText>
                    </FormControl>

                    {/*<FormControl fullWidth>*/}
                    {/*  <InputLabel id="state-label">State</InputLabel>*/}
                    {/*  <Select*/}
                    {/*    labelId="state-label"*/}
                    {/*    label="State"*/}
                    {/*    error={!!(formik.touched.state*/}
                    {/*      && formik.errors.suburb)}*/}
                    {/*    helperText={formik.touched.state*/}
                    {/*      && formik.errors.state}*/}
                    {/*    name="suburb"*/}
                    {/*    onBlur={formik.handleBlur}*/}
                    {/*    onChange={formik.handleChange}*/}
                    {/*    value={formik.values.state}*/}
                    {/*    value={australiaStates}*/}
                    {/*    onChange={(e) => setAustraliaStates(e.target.value)}*/}
                    {/*    disabled={loadingStates || states.length === 0}*/}
                    {/*  >*/}
                    {/*    {states.map((s) => (*/}
                    {/*      <MenuItem key={s} value={s}>{s}</MenuItem>*/}
                    {/*    ))}*/}
                    {/*  </Select>*/}
                    {/*  <FormHelperText>*/}
                    {/*    {loadingStates ? 'Loading states…' : (statesError || ' ')}*/}
                    {/*  </FormHelperText>*/}
                    {/*</FormControl>*/}


                    {/*<Select fullWidth value={state} onChange={(e)=>setState(e.target.value)} sx={{ mb: 2 }}>*/}
                    {/*  {['South Australia','New South Wales','Victoria','Queensland'].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}*/}
                    {/*</Select>*/}
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}><TextField fullWidth label="Postal Code"
                                                           error={!!(formik.touched.postal_code
                                                             && formik.errors.postal_code)}
                                                           helperText={formik.touched.postal_code
                                                             && formik.errors.postal_code}
                                                           name="postal_code"
                                                           onBlur={formik.handleBlur}
                                                           onChange={formik.handleChange}
                                                           value={formik.values.postal_code}
                      /></Grid>
                      <Grid item xs={12} sm={6}><TextField fullWidth label="Phone Number"
                                                           error={!!(formik.touched.phone_number
                                                             && formik.errors.phone_number)}
                                                           helperText={formik.touched.phone_number
                                                             && formik.errors.phone_number}
                                                           name="phone_number"
                                                           onBlur={formik.handleBlur}
                                                           onChange={formik.handleChange}
                                                           value={formik.values.phone_number}
                      /></Grid>
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={<Checkbox size="small" checked={news}
                                             onChange={(e) => setNews(e.target.checked)}/>}
                          label="Email me with news and offers"
                        />
                        <FormControl error={!termAndConditions}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                size="small"
                                checked={termAndConditions}
                                onChange={(e) => setTermAndConditions(e.target.checked)}
                              />
                            }
                            label={
                              <Typography onClick={handleClickOpen}>
                                Terms and conditions
                              </Typography>
                            }
                          />
                          {!termAndConditions && message && (
                            <FormHelperText>{message}</FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={5}>
                <Card variant="outlined" sx={{ borderRadius: 1.5 }}>
                  <CardContent>
                    {items.map(i => <OrderItem key={i.id} item={i} onQty={onQty}/>)}

                    <Box sx={{ display: 'flex', flexDirection: 'column', mt: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography fontWeight={800} sx={{ mb: .5, color: ACCENT }}>Shipping
                          Price:</Typography>
                        <Typography fontWeight={700}>${shipping.toFixed(2)}</Typography></Box>

                      <Divider sx={{ my: 1.5 }}/>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="h6" fontWeight={900}
                                    sx={{ color: ACCENT }}>Total:</Typography>
                        <Typography variant="h6" fontWeight={900}>${total.toFixed(2)}</Typography>
                      </Box>
                    </Box>
                    <Button
                      fullWidth
                      type="submit"
                      variant="contained"
                      sx={{
                        mt: 3,
                        py: 1.25,
                        borderRadius: 1.5,
                        bgcolor: '#c165a0',
                        '&:hover': { bgcolor: '#c165a0' }
                      }}
                    >
                      Place Order
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
              // margin: "auto",
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
                    Terms of Use
                  </Typography>
                  <Typography gutterBottom variant="h6" padding="10px" sx={{ textAlign: 'center' }}>
                    Welcome to Greetings Card
                  </Typography>
                  <Typography gutterBottom variant="h6" padding="10px" sx={{ textAlign: 'center' }}>
                    By using our website and purchasing our virtual products, you agree to the
                    following
                    terms and conditions.
                  </Typography>
                  <CardMedia/>
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div" sx={{ mt: 0, mb: 3 }}>
                      1. Acceptance of the terms
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      By accessing and using our website, you accept and agree to be bound by these
                      terms and conditions.
                    </Typography>
                    <Typography gutterBottom variant="h6" padding="10px" sx={{ mt: 3, mb: 3 }}>
                      IF YOU DO NOT AGREE TO THESE TERMS, DO NOT USE OUR WEBSITE OR PURCHASE
                      OUR PRODUCTS.
                    </Typography>
                    <Typography gutterBottom variant="h6" component="div" sx={{ mt: 3, mb: 3 }}>
                      2. Virtual products
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      2.1 All products sold on our website are virtual and digital in nature. There
                      will
                      be no physical
                      delivery of products.
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      2.2 After the purchase, the product will be available for download, if the
                      game
                      cannot be
                      downloaded please contact us by Email: team@brandongame.com and we will send
                      it to
                      you
                      manually.
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      2.3 All sales are final due to the digital nature of our products. Returns,
                      refunds or exchanges
                      are not allowed.
                    </Typography>
                    <Typography gutterBottom variant="h6" component="div" sx={{ mt: 3, mb: 3 }}>
                      3. Use of the product
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      3.1 The virtual products are intended for one brand commercial use only.
                      Redistribution, resale
                      or commercial use without our express permission is prohibited.
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      3.2 Any unauthorized use or distribution of our virtual products is strictly
                      prohibited and will
                      result in termination of access and possible legal action
                    </Typography>
                    <Typography gutterBottom variant="h6" component="div" sx={{ mt: 3, mb: 3 }}>
                      4. Payment
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      4.1 Payments for our virtual products will be made in advance and in full.
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      4.2 We use secure payment gateways for transactions. However, we cannot
                      guarantee
                      absolute
                      security due to the risks inherent in online transactions.
                    </Typography>
                    <Typography gutterBottom variant="h6" component="div" sx={{ mt: 3, mb: 3 }}>
                      5. Warranty
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      5.1 All products are provided &quot;as is&quot; without any warranty of any
                      kind, express or
                      implied.
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      5.2 We are not responsible for any damage, loss of data or other problems
                      arising
                      from the use
                      or download of our products.
                    </Typography>
                    <Typography gutterBottom variant="h6" component="div" sx={{ mt: 3, mb: 3 }}>
                      6. Changes to the terms and conditions
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      We reserve the right to change or update these terms and conditions at any
                      time
                      without notice.
                      It is your responsibility to check them periodically.
                    </Typography>
                    <Typography gutterBottom variant="h6" component="div" sx={{ mt: 3, mb: 3 }}>
                      7. Law applies
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      These terms and conditions and any dispute related to these terms, the site or
                      our
                      products will
                      be subject to the laws of Israel and will be interpreted in accordance with
                      its
                      conflict of law rules
                    </Typography>
                    <Typography gutterBottom variant="h6" component="div" sx={{ mt: 3, mb: 3 }}>
                      8. Age restriction
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Our Services are not directed to persons under the age of 18. We do not
                      knowingly
                      collect
                      personal information from children. If you are a parent or guardian and
                      believe
                      your child has
                      provided us with personal information, please contact us to have that
                      information
                      removed
                    </Typography>
                    <Typography gutterBottom variant="h6" component="div" sx={{ mt: 3, mb: 3 }}>
                      9. Cancellation
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Cancellation of a transaction in accordance with the Israeli Consumer
                      Protection
                      Law
                      (Cancellation), CA-2010 and the Israeli Consumer Protection Law, 1981.
                    </Typography>
                    <Typography gutterBottom variant="h6" component="div" sx={{ mt: 3, mb: 3 }}>
                      10. Contact
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      For any questions regarding these Terms of Use, please contact us at:
                    </Typography>
                    <Typography variant="body2">
                      <b>Email: team@greetingsCard.com</b>
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
