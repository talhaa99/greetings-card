import Head from 'next/head';
import {
  Box, useTheme, useMediaQuery, Button, Alert, IconButton, Collapse, Stack, CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WarningIcon from '@mui/icons-material/Warning';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';

import LandingNav from '../../../layouts/landing-nav/landingLayout';
import { useRouter } from 'next/router';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const WEB_URL = process.env.NEXT_PUBLIC_WEB_URL;
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME;
import NextLink from 'next/link';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useAuth } from '../../../hooks/use-auth';

const Upload = () => {
  const auth = useAuth();
  const theme = useTheme();
  const router = useRouter();
  const { id, index, temp, type, token } = router.query;
  const [loading, setLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(null);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [open, setOpen] = useState(true);
  const [galleryImages, setGalleryImages] = useState(true);
  const [galleryVideos, setGalleryVideos] = useState(true);
  const [selectedGalleryImages, setSelectedGalleryImages] = useState([]);
  const [showMsgAfterUploadContent, setShowMsgAfterUploadContent] = useState(false);
  const [previewUrls, setPreviewUrls] = useState('');
  const [previewVideoUrls, setPreviewVideoUrls] = useState('');
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isAuth = auth?.isAuthenticated;

  console.log('type', type);
  console.log('token', token);
  console.log('isAuth', isAuth);

  const verifyToken = async () => {
    setVerifyLoading(true);

    try {
      console.log('going to call verifyToken');
      localStorage.setItem('token', token);
      console.log('going to call initializse before');
      await auth.initialize(true);
      console.log('going to call initializse after--------------');
      setIsTokenValid(true);
      setVerifyLoading(false);
    } catch (err) {
      console.error('Token verification failed:', err);
      setIsTokenValid(false);
    }
  };

  useEffect(() => {
    if (token) {
      verifyToken();
    }
  }, [token]);

  const useStyles = styled((theme) => ({
    root: {
      width: '100%', '& > * + *': {

        marginTop: theme.spacing(2)
      }
    }
  }));

  const classes = useStyles();

  //upload gallery images
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    if (file.size > 1024 * 1024) {
      toast.error(`File too large (${sizeInMB} MB). Max allowed: 1 MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = async () => {
        const { width, height } = img;
        if (width < 660 || height < 660) {
          toast.error(`Image too small (${width}x${height}). Min: 660x660px.`);
          return;
        }
        if (width > 4028 || height > 4028) {
          toast.error(`Image too large (${width}x${height}). Max allowed : 4028x4028px.`);
          return;
        }
        const formData = new FormData();
        const isAuth = auth?.isAuthenticated;
        console.log('isAuth in image', typeof isAuth, isAuth);
        formData.append('uuid', id);
        formData.append('isAuthenticated', isAuth);
        formData.append('index', index);
        formData.append('images', file);
        try {
          setLoading(true);
          const res = await axios.post(`${BASE_URL}/api/user/ar-experience/upload-image`,
            formData,
            {
              headers: { 'Content-Type': 'multipart/form-data' }
            });

          setPreviewUrls(res?.data?.data?.image);
          toast.success('Image uploaded!');
          setShowWarning(true);
          setShowMsgAfterUploadContent(true);
          // clean the url
          const { token, ...rest } = router.query;
          router.replace({ pathname: router.pathname, query: rest }, undefined, { shallow: true });
        } catch (err) {
          console.error('Upload error:', err);
          toast.error(err?.response?.data?.msg);
          setShowWarning(false);
        } finally {
          setLoading(false);
        }

      };
    };
    reader.readAsDataURL(file);
  };

  const handleVideoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    // if (file.size > 1024 * 1024) {
    //   toast.error(`Video too large (${sizeInMB} MB). Max allowed size is 1 MB.`);
    //   return;
    // }

    const url = URL.createObjectURL(file);
    // setPreviewVideoUrls(res?.data?.data?.video);
    setVideoLoading(true);
    const authenticatedUser = auth?.isAuthenticated;
    console.log('authenticatedUser in video', typeof authenticatedUser, authenticatedUser);
    const formData = new FormData();
    formData.append('uuid', id);
    formData.append('isAuthenticated', authenticatedUser);
    formData.append('videos', file);

    try {
      const res = await axios.post(`${BASE_URL}/api/user/ar-experience/upload-video`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Video uploaded successfully.');
      setPreviewVideoUrls(res?.data?.data?.video);
      setShowWarning(true);
      setShowMsgAfterUploadContent(true);
      // clean the url
      const { token, ...rest } = router.query;
      router.replace({ pathname: router.pathname, query: rest }, undefined, { shallow: true });
    } catch (err) {
      console.error('Upload failed image:', err);
      toast.error(err?.response?.data?.msg);
      setShowWarning(false);
    } finally {
      setVideoLoading(false);
    }

  };

  const delete0IndexContent = async (isImage) => {

    try {
      const isAuthenticated = auth?.isAuthenticated;
      const res = await axios.post(`${BASE_URL}/api/user/ar-experience/remove-0-index-content`, {
        uuid: id, isImage, isAuthenticated: isAuthenticated
      });

      if (isImage) {
        toast.success('Image Deleted successfully!');
        setPreviewUrls(null);
        setShowWarning(false);
      } else {
        toast.success('Video Deleted successfully!');
        setPreviewVideoUrls(null);
        setShowWarning(false);
      }
    } catch (error) {
      console.log('error in video', error);
      toast.error(error?.response?.data?.msg);
      setShowWarning(false);
    }
  };

  useEffect(() => {
    if (showMsgAfterUploadContent) {
      const timer = setTimeout(() => {

        localStorage.removeItem('token');
        router.push('https://www.google.com');
        // router.push(WEB_URL);
        // window.close();

      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [showMsgAfterUploadContent]);

  // const goToTheWebsite = () => {
  //   // router.push(WEB_URL);
  //   router.push('https://www.google.com');
  // };

  return (
    <>
      <Head>
        <title>Upload Media | {APP_NAME}</title>
      </Head>


      {/*{isSmallScreen && (*/}
      <Box sx={{
        position: 'relative',
        width: '100%',
        height: '100%  !important',
        minHeight: '100vh !important',
        overflowY: 'hidden ',
        backgroundImage: {
          xs: `url(${WEB_URL}/portrate.png)`, md: `url(${WEB_URL}/bg1.png)`
        },
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'

      }}>
        <LandingNav/>

        {showMsgAfterUploadContent && (
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection:"column",
            alignItems: 'center',
            height: '100vh'
          }}>
            <Box
              data-aos="zoom-in"
              data-aos-duration="600"
              data-aos-easing="ease-in"
              component="img"
              src={`${WEB_URL}/thankYou.gif`}
              alt="thank you"
              // sx={{ position: 'absolute', top: {md: '25%', xs:'25%' }, right: {md: - 150, xs:-30 }, width: {md: '30%', xs:'50%' }, zIndex: 4 }}
              sx={{
                width: '50%'
              }}
            />
            {/*<Button*/}
            {/*  sx={{*/}
            {/*    display: showMsgAfterUploadContent ? 'block' : 'none',*/}
            {/*    minWidth: { md: 150, xs: 100 },*/}
            {/*    backgroundColor: '#c165a0 !important',*/}
            {/*    color: 'white',*/}
            {/*    borderRadius: '20px',*/}
            {/*    '&:hover': {*/}
            {/*      backgroundColor: '#c165a0 !important',*/}
            {/*      color: 'white'*/}
            {/*    }*/}
            {/*  }}*/}
            {/*  disabled={loading}*/}
            {/*  onClick={goToTheWebsite}*/}
            {/*>*/}
            {/*  Go Back To The Website*/}
            {/*</Button>*/}
          </Box>
        )}



        <Box>

          {
            verifyLoading ? (
              <Stack sx={{ color: 'grey.500' }} spacing={2} direction="row">
                <CircularProgress color="secondary"/>
              </Stack>
            ) : (
              <Box sx={{
                width: '100%',
                height: '100vh', // overflowY: 'auto',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                gap: 2
              }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    alignItems: 'center',
                    p: 2,
                    gap: 1,
                    height: '50vh',
                    mt: { xs: 20, ipadPro: 33 },
                    width: '100%'
                    // overflowY: 'auto'
                  }}>

                  {previewUrls && (<Box sx={{
                    width: 150, height: 150,
                    display: showMsgAfterUploadContent ? 'none' : 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative'
                  }}>
                    {index === '0' && temp !== '4' && (
                      <DeleteIcon
                        // disabled={}
                        onClick={() => delete0IndexContent(true)}
                        sx={{
                          position: 'absolute', bottom: 0, right: 0, color: '#c165a0', fontSize: 30
                          // display: showMsgAfterUploadContent ? 'none' : 'block'
                        }}/>)}
                    <img src={previewUrls} width="100%" height={'100%'}
                         style={{
                           objectFit: 'cover',
                           borderRadius: '8px',
                           display: showMsgAfterUploadContent ? 'none' : 'block'
                         }}/></Box>)}
                </Box>

                {/*{(*/}
                {/*  (index === '0' && ['1', '2'].includes(temp) && type === 'image') || (temp !== '3')*/}
                {/*) && (*/}

                {
                  !(
                    index === '0' &&
                    ['1', '2'].includes(temp) &&
                    type === 'video'
                  ) && (

                    (index === '0' && ['1', '2'].includes(temp) && type === 'image') ||
                    (temp !== '3')
                  ) && (

                    <Button
                      sx={{
                        display: showMsgAfterUploadContent ? 'none' : 'block',
                        minWidth: { md: 150, xs: 100 },
                        backgroundColor: '#c165a0 !important',
                        color: 'white',
                        borderRadius: '20px',
                        '&:hover': {
                          backgroundColor: '#c165a0 !important',
                          color: 'white'
                        }
                      }}
                      disabled={loading}
                      onClick={() => document.getElementById('gallery-images').click()}
                    >
                      {loading ? 'Uploading...' : 'Upload Image'}
                    </Button>
                  )}


                <input
                  type="file"
                  id="gallery-images"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleImageUpload}
                />
                {
                  !(
                    index === '0' &&
                    ['1', '2'].includes(temp) &&
                    type === 'image'
                  ) && (

                    (index === '0' && ['1', '2'].includes(temp) && type === 'video') ||
                    (index === '0' && (temp === '3' || (temp !== '4' && temp !== '5')))
                  ) && (

                    <Button
                      disabled={videoLoading}
                      onClick={() => document.getElementById('gallery-videos').click()}
                      sx={{
                        display: showMsgAfterUploadContent ? 'none' : 'block',
                        minWidth: { md: 150, xs: 100 },
                        backgroundColor: '#c165a0 !important',
                        color: 'white',
                        borderRadius: '20px',
                        '&:hover': { backgroundColor: '#c165a0 !important', color: 'white' }
                      }}
                    >
                      {videoLoading ? 'Uploading...' : 'Upload  Video'}
                    </Button>

                  )}

                <Box sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1,
                  p: 2,
                  height: '50vh',
                  mb: 10,
                  width: '100%', // overflowY: 'auto',
                  justifyContent: 'center'
                }}>

                  {previewVideoUrls && (<Box sx={{
                    // display: 'flex',
                    display: showMsgAfterUploadContent ? 'none' : 'flex',
                    width: 150, height: 150,
                    justifyContent: 'center',
                    alignItems: 'center',
                    // height: '100%',
                    position: 'relative'
                  }}>
                    {index === '0' && temp !== '3' && (<DeleteIcon
                      // disabled={}
                      onClick={() => delete0IndexContent(false)}
                      sx={{
                        position: 'absolute',
                        fontSize: 30,
                        bottom: 0,
                        right: 0,
                        color: '#c165a0',
                        zIndex: 2
                      }}/>)}
                    <video src={previewVideoUrls} width="100%" height="100%" controls
                           style={{
                             borderRadius: '8px',
                             display: showMsgAfterUploadContent ? 'none' : 'block'
                           }}/>
                  </Box>)}
                </Box>


                <input
                  type="file"
                  id="gallery-videos"
                  accept="video/*"
                  style={{ display: 'none' }}
                  onChange={handleVideoUpload}
                />

              </Box>
            )
          }

        </Box>
        {/*)}*/}
      </Box>

    </>);
};
export default Upload;