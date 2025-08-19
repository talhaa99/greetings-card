
import { useRouter } from "next/router";
import { Button, Box } from "@mui/material";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
const WEB_URL = process.env.NEXT_PUBLIC_WEB_URL;

export default function SuccessPage() {
  const router = useRouter();

  return (
    <Box
    sx={{
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
    }}
    >
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "2rem"
    }}>
      <CheckCircleOutlineIcon sx={{color:'green', width: 100, height: 100 , mb:3}}/>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem", color: "grey" }}>
        Payment Successfull
      </h1>
      <Button
        variant="contained"
        color="primary"
        sx={{
          '&:hover': {
            backgroundColor: '#c165a0',
            color: 'white'
          }
        }}
        onClick={() => router.push("/")}
      >
        Go Back To Website
      </Button>
    </div></Box>
  );
}
