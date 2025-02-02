import { Box, Container, Stack, Typography } from "@mui/material";
import themeTypography from "../utils/typography";
import { useSelector } from "react-redux";
import LaunchButton from "./LaunchButton"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react";

function LandingPage() {
 
  const navigate = useNavigate()
  
  let isPatient = false;
  const userFormData = useSelector(state => state.data.data);
  useEffect(() => {
    if (userFormData === ('Login' || 'Register')) {
      navigate("/form");
    } else if (userFormData === 'About') {
      navigate("/about");
    }
  }, [userFormData, navigate]);
  // const isAuth = useSelector((state) => {
  //   return state.users.isAuthenticated;
  // });

  // const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {/* {!isLoading ? (
        <Loading />
      ) : ( */}
        <Box className="main-wrapper" sx={{background: "#bbd3f999" }}>
          {(localStorage.getItem('unity-jwt-patient') ? isPatient=true : isPatient=false)}
          <Container sx={{ height: "100vh" }}>
            <Stack sx={{ height: "inherit" }} justifyContent="center">
              <Typography
                sx={{ ...themeTypography.h2, letterSpacing: "0.02em", mb: 1, color: "#386bc0" }}
              >
                Step into a Healthier Tomorrow with
              </Typography>
              <Typography
                sx={{ ...themeTypography.h1, letterSpacing: "0.02em", mb: 1, color: "#386bc0" }}
              >
                WINFIELD HOSPITAL
              </Typography>
              <Typography
                sx={{ ...themeTypography.h3, letterSpacing: "0.05em", mb: 5, fontSize: "24px", color: "#386bc0" }}
              >
                Putting Your Health First, Always
              </Typography>
              <Stack
                direction={{ xs: "column", md: "row" }}
                alignItems="center"
              >
              {isPatient? 
              <div 
              onClick = {() => { 
                  navigate('/bookAppointment')
                }}> <LaunchButton value={"Book an Appointment"} /> </div>: null}
              
              </Stack>
            </Stack>
          </Container>
        </Box>
      {/* )} */}
    </>
  );
}

export default LandingPage;
