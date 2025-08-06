import Head from 'next/head';
import {
  Card,
  CardContent,
  Container,
  Typography, Tab, IconButton, Menu, CircularProgress,
  Grid, Box, useMediaQuery, useTheme, Button, MenuItem, Select
} from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import LandingNav from '../../layouts/landing-nav/landingLayout';
import { useRouter } from 'next/router';
import { useLoginModal } from '../../contexts/loginContext';
import { useSavedModal } from '../../contexts/save-context';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const WEB_URL = process.env.NEXT_PUBLIC_WEB_URL;
import NextLink from 'next/link';
import QRCodeGenerator from '../../components/qrCode';
import { useAuth } from '../../hooks/use-auth';

const Editor = () => {
  const auth = useAuth();
  const { openLogin } = useLoginModal();
  const { isSave, setIsSave } = useSavedModal();
  const [isUnityReady, setIsUnityReady] = useState(false);
  const [generateToken, setGenerateToken] = useState(false);
  const theme = useTheme();
  const router = useRouter();
  const { id: userCardId, selected: cardId } = router.query;
  const gameIframe = useRef(null);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const hasCalledRef = useRef(false);
  const WEB_URL = process.env.NEXT_PUBLIC_WEB_URL;
  const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME;
  const gameLoadCalled = useRef(false);
  const hasCreatedTemplateRef = useRef(false);
  const [data, setData] = useState(null);
  const [showQr, setShowQr] = useState(false);
  const [cardData, setCardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [userTemplateData, setUserTemplateData] = useState(null);
  const [url, setUrl] = useState(null);
  const [token, setToken] = useState(null);

  // const [content, setContent] = useState(`${WEB_URL}/upload-ar-content/${userTemplateData?.uuid}`);

  console.log('auth', auth);
  console.log('generateToken', generateToken);

  useEffect(() => {
    const runOnceAfterLogin = async () => {
      if (auth?.isAuthenticated && !hasCreatedTemplateRef.current) {
        hasCreatedTemplateRef.current = true;
        await createTemplateData();
      }
    };

    runOnceAfterLogin();
  }, [auth?.isAuthenticated]); // only depends on login state

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem('token');
    if (tokenFromStorage) {
      setToken(tokenFromStorage);
      return;
    }

    const generateToken = async () => {

      const res = await fetch('/api/generate-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: auth?.user || null })
      });

      const data = await res.json();
      if (data.token) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
      }
    };

    generateToken();
  }, [generateToken == true]);


  // useEffect(() => { ==
  //   const generateAndStoreToken = async () => {
  //     const res = await fetch('/api/generate-token', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ user: auth?.user || null })  // Send null for guest
  //     });
  //
  //     const data = await res.json();
  //     setGenerateToken(false);
  //     if (data.token) {
  //       localStorage.setItem('userToken', data.token);
  //       console.log('🔐 Token from API stored:', data.token);
  //     } else {
  //       console.error('❌ Failed to generate token:', data);
  //     }
  //   };
  //
  //   generateAndStoreToken();
  // }, [auth]);

  const getFrontCardDetail = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/cards/get/data/game/${cardId}`);
      setData(res.data.data);

      await createTemplateData();

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!cardId) {
      return;
    }
    getFrontCardDetail();
  }, [cardId]);

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

  console.log('userTemplateData', userTemplateData);
  console.log('url...........', url);

  const createTemplateData = async () => {
    const email = getUserEmail();
    const isAuth = auth?.isAuthenticated;

    try {
      const res = await axios.post(`${BASE_URL}/api/cards/upload-card-id`, {
        uuid: cardId, userCardId, email, isAuthenticated: isAuth, userId: auth?.user?._id
      });

      setCardData(res.data.data);
      setUserTemplateData(res?.data?.data);

    } catch (error) {
      console.log(error);
    }

  };

  useEffect(() => {
    window.UnityLoaded = async () => {
      console.log('Unity is loaded and ready from web');
      // await getFrontCardDetail();
      // await getUserTemplateDesignData();
      setIsUnityReady(true);
      if (data && userTemplateData) {
        gameOnLoad();
      }

    };
  }, [data && userTemplateData]);
  // }, [data && userTemplateData && token]);

  const gameOnLoad = () => {
    const instance = gameIframe.current?.contentWindow?.gameInstance;

    console.log('instance----', instance);

    if (instance && data) {

      console.log('✅ Unity gameInstance loaded:', instance);
      console.log('✅userTemplateData', userTemplateData);
      console.log('data---', data);

      instance.SendMessage(
        'JsonDataHandlerAndParser',
        'LoadJsonData',
        JSON.stringify(data)
      );

      instance.SendMessage(
        'JsonDataHandlerAndParser',
        'LoadSavedData',
        JSON.stringify(userTemplateData)
      );

      //send qrlink for user ar experience
      instance.SendMessage(
        'JsonDataHandlerAndParser',
        'purchaseCardLink',
        JSON.stringify(
          `https://ar-experience-greetings-card.tecshield.net/${userTemplateData?._id}`
        )
      );

      // const token = localStorage.getItem('userToken');

      console.log('token is from web ==========================', token);

      //sending qr link here
      instance.SendMessage(
        'JsonDataHandlerAndParser',
        'QrLink',
        JSON.stringify({
          qrUrl: `${WEB_URL}/upload-ar-content/${userTemplateData?.uuid}`,
          token

        })
      );

      gameIframe.current.contentWindow.saveImage = async (array = [], int, index) => {
        console.log('🖼️ Received array:', array);
        console.log('index', index);

        console.log('userId----------------------in else');
        setIsUnityReady(false);
        try {
          const isAuth = auth?.isAuthenticated;
          // Convert the input array to Uint8Array
          const uint8Array = new Uint8Array(array);

          // Convert Uint8Array to a Blob (binary data)
          const blob = new Blob([uint8Array], { type: 'image/png' }); // adjust MIME type if needed

          // Create FormData to send the image as a file
          const formData = new FormData();
          formData.append('uuid', userCardId);
          formData.append('isAuthenticated', isAuth);
          formData.append('index', index);
          formData.append('image', blob, 'image.png'); // 'image.png' is filename

          // Send POST request with multipart/form-data
          const response = await axios.post(
            `${BASE_URL}/api/cards/upload-image`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
          );
          const imagePath = response?.data?.data?.url;

          // const userTemplateId = response?.data?.data?.card?.userId;
          // setUserTemplateId(userTemplateId);
          // localStorage.setItem('userTemplateId', userTemplateId);

          // Construct full image URL with index as a query param
          // const imageUrl = `${BASE_URL}/${imagePath}?index=${index}`;
          setImage(imagePath);
          setUserTemplateData(response?.data?.data?.card);
          console.log('imagePath', imagePath);
          console.log('✅ Image uploaded successfully:', response);
          instance.SendMessage(
            'JsonDataHandlerAndParser',
            'LoadImage',
            JSON.stringify(imagePath)
          );

        } catch (error) {
          console.error('❌ Error uploading image:', error);
        }

      };

      gameIframe.current.contentWindow.UploadVideo = async (gameObjectName, methodName, url) => {
        console.log('gameObjectName', gameObjectName);
        console.log('url', url);
        console.log('methodName', methodName);

        setIsUnityReady(false);
        console.log('userId----- in else', userCardId);
        try {
          const isAuth = auth?.isAuthenticated;
          const blobResponse = await fetch(url);
          const blob = await blobResponse.blob();

          // 2. Convert blob to a File object (you can give a meaningful filename)
          const file = new File([blob], 'recorded-video.mp4', {
            type: blob.type || 'video/mp4'
          });

          const formData = new FormData();
          formData.append('uuid', userCardId);
          formData.append('isAuthenticated', isAuth);
          formData.append('video', file);

          // Send POST request with multipart/form-data
          const response = await axios.post(
            `${BASE_URL}/api/cards/upload-template-video`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
          );

          const videoPath = response?.data?.data?.url;
          setVideo(videoPath);

          instance.SendMessage(
            'JsonDataHandlerAndParser',
            'LoadVideo',
            JSON.stringify(videoPath)
          );

        } catch (error) {
          console.error('❌ Error uploading video:', error);
        }

      };

      gameIframe.current.contentWindow.deleteImage = async (isImage, index) => {

        console.log('isImage', isImage);
        console.log('index', index);

        console.log('userId----------------------', userCardId);
        try {
          const isAuth = auth?.isAuthenticated;
          const response = await axios.post(
            `${BASE_URL}/api/user/edit-data`,
            {
              isAuthenticated: isAuth,
              isImage,
              index,
              uuid: userCardId

            },
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );
          console.log('response to delete image---------------', response);

        } catch (error) {
          console.error('❌ Error deleting image:', error);
        }

      };

      //unity developer call this function to send data to me  not in instance this function is call in window
      gameIframe.current.contentWindow.saveData = async (json) => {

        console.log('----------recieving json:', json);
        const parsed = JSON.parse(json);
        console.log('----------recieving json after parse:', parsed);

        try {
          const isAuth = auth?.isAuthenticated;
          const response = await axios.post(
            `${BASE_URL}/api/cards/upload-ar-data`,
            {
              uuid: userCardId,
              data: parsed,
              isAuthenticated: isAuth

            },
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );
          console.log('response of save data===> ', response);
          setUserTemplateData(response?.data?.data);
          // openLogin();
          if (parsed?.isCustomizationComplete && !auth?.isAuthenticated) {
          // if (!auth?.isAuthenticated) {
            // setIsSave(true);
            // setUserId(userCardId);
            openLogin();
            // localStorage.setItem('pendingImageUpload', 'true');
            // setIsSave(true);
            // await saveUserArExperienceData();
          }
        } catch (error) {
          console.log('error in save data', error);
        }
      };

      // callback when picker is click need to generate token
      gameIframe.current.contentWindow.pickerClickCallBack = async () => {
        console.log('----------msg when picker is clicked from website:');
        setGenerateToken(true);
      };

      gameIframe.current.contentWindow.changeTemplate = async (id) => {

        console.log('----------recieving id when template is changed:', id);

        try {
          const isAuth = auth?.isAuthenticated;
          const response = await axios.post(
            `${BASE_URL}/api/cards/update-data`,
            {
              id:userTemplateData._id,
              isAuthenticated: isAuth

            },
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );
          console.log('response when template ===> ', response);
          setUserTemplateData(response?.data?.data);
        } catch (error) {
          console.log('error in change template data', error);
        }
      };

      console.log('generateToken after', generateToken);
    }
  };

  return (
    <>
      <Head>
        <title>Card Editor | {APP_NAME}</title>
      </Head>

      <Box sx={{
        position: 'relative',
        width: '100%',
        height: '100vh !important',
        overflowY: 'hidden ',
        // overflowX:'hidden',
        // overflowY: 'hidden',
        // minHeight: '100vh !important',
        backgroundImage: {
          xs: `url(${WEB_URL}/portrate.png)`,
          md: `url(${WEB_URL}/bg1.png)`
        },
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'

      }}>
        <LandingNav/>
        <Box sx={{ width: '100%', height: '100%' }}>
          {/*<iframe*/}
          {/*  ref={gameIframe}*/}
          {/*  onLoad={() => {*/}
          {/*    console.log('iframe loaded');*/}
          {/*    if (window.UnityLoaded) {*/}
          {/*      window.UnityLoaded(); // called manually if iframe is ready*/}
          {/*    }*/}
          {/*  }}*/}
          {/*  src={`${WEB_URL}/editor/index.html`}*/}
          {/*  frameBorder="0"*/}
          {/*  style={{*/}
          {/*    width: '100%',*/}
          {/*    height: '100%'*/}
          {/*  }}*/}
          {/*></iframe>*/}
          {/*{*/}
          {/*  showQr && (*/}
          {/*    <Box sx={{*/}
          {/*      position: 'absolute',*/}
          {/*      right: 20,*/}
          {/*      top: { lg: '20%', xs: '40%', ipad: '35%' },*/}
          {/*      display: { lg: 'block', xs: 'none' }*/}
          {/*    }}>*/}
          {/*      <QRCodeGenerator value={content} size={100}/>*/}
          {/*    </Box>*/}
          {/*  )*/}
          {/*}*/}

          <iframe
            // onLoad={gameIframe}
            ref={gameIframe}
            onLoad={() => {
              console.log('iframe loaded');
              if (window.UnityLoaded) {
                window.UnityLoaded();
              }
            }}
            src={`${WEB_URL}/editor/index.html`}
            // src={`${WEB_URL}/editor/index.html?uuid=${cardId}`}
            // title={data.title}
            frameBorder="0"
            style={{
              width: '100%',
              height: '100%'
            }}
          ></iframe>
        </Box>

      </Box>

    </>
  );
};
export default Editor;



