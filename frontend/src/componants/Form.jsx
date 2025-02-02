import React, { useState } from "react";
import PatientRegistration from "./PatientRegistration";
import DoctorRegistration from "./DoctorRegistration";
import DoctorLogin from "./DoctorLogin";
import PatientLogin from "./PatientLogin";
// import Loading from "./Loading";
// import axios from "axios";
import "./form.css";
import {
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
} from "mdb-react-ui-kit";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import doctorImg from "../assets/logo/png/doctor-img.png";
// ./assets/logo/png/logo.png

export default function MDBForm() {
  const navigate = useNavigate();
  const userFormData = useSelector(state => state.data.data);
 
  console.log(userFormData, 'userFormData');
  useEffect(() => {
    let tokenOwner = "";
    let dataToSend;
    const patientToken = localStorage.getItem("unity-jwt-patient");
    const doctorToken = localStorage.getItem("unity-jwt-doctor");

    if (patientToken || doctorToken) {
      dataToSend = {
        istoken: true,
        token: "",
        purpose: "verify",
        email: "",
        password: "",
      };

      if (patientToken) {
        dataToSend.token = patientToken;
        tokenOwner = "patient";
      } else {
        dataToSend.token = doctorToken;
        tokenOwner = "doctor";
      }

      const fetchData = async () => {
        try {
          let response = await axios.post(`${tokenOwner}/login`, dataToSend);
        
          if(tokenOwner==="doctor")
          {
            localStorage.setItem("unity-doctor-id", response.data.doctor._id);
          }
          else
          {
            localStorage.setItem("unity-patient-id", response.data.patient._id);
          }
        navigate("/");
        } catch (err) {
          navigate("/");
          console.error("Error fetching user info:", err);
        }
      };

      fetchData();
    } else {
      navigate("/form");
    }
  }, [navigate]);

  const [loginRegisterActive, setLoginRegisterActive] = useState("Login");
  const [userType, setUserType] = useState("patient"); // Added userType state

  // const handleLoginRegisterClick = (tab) => {
  //   setLoginRegisterActive(tab);
  // };

  const handleUserTypeClick = (type) => {
    setUserType(type);
  };

  useEffect(() => {
    if(userFormData === ('Register' || 'Login')){
      setLoginRegisterActive(userFormData);
    }else if(userFormData === 'Home'){
      navigate("/");
    }else if(userFormData === 'About'){
      navigate("/about");
    }
  }, [userFormData])

  return (
    <>
    {/* <div className="form-formDiv"> */}
      <div className="form-allFormsContainer">
        <Box sx={{display: "flex", width: "100%"}}>
          <Box className="hide-scrollbar" sx={{width: "50%", padding: "100px 20px 30px", height: "100vh", display: 'flex', justifyContent: 'center', alignContent: 'center', overflowY: "auto", position: "relative"}}>
            <Box sx={{maxWidth: "400px", margin: "auto", width: "100%"}}>
              <h3 className="text-center login-title fw-semibold">{loginRegisterActive === "Login" ? 'Login' : 'Register'} To Your Account</h3>
              {/* <MDBTabs justify className="form-switchContainer">
                <MDBTabsItem className="">
                  <MDBTabsLink
                    onClick={() => handleLoginRegisterClick("login")}
                    active={loginRegisterActive === "login"}
                    className="login-list-item"
                  >
                    Login
                  </MDBTabsLink>
                </MDBTabsItem>
                <MDBTabsItem className="">
                  <MDBTabsLink
                    onClick={() => handleLoginRegisterClick("register")}
                    active={loginRegisterActive === "register"}
                    className="login-list-item"
                  >
                    Register
                  </MDBTabsLink>
                </MDBTabsItem>
              </MDBTabs> */}

              <MDBTabsContent className="form-formInputs">
                <MDBTabsPane show={loginRegisterActive === "Login"}>
                  <div className="text-center">
                    {/* <MDBTabs pills className="form-switchContainer">
                      <MDBTabsItem>
                        <MDBTabsLink
                          onClick={() => handleUserTypeClick("patient")}
                          active={userType === "patient"}
                        >
                          Patient
                        </MDBTabsLink>
                      </MDBTabsItem>
                      <MDBTabsItem>
                        <MDBTabsLink
                          onClick={() => handleUserTypeClick("doctor")}
                          active={userType === "doctor"}
                        >
                          Doctor
                        </MDBTabsLink>
                      </MDBTabsItem>
                    </MDBTabs> */}
                  </div>
                  {userType === "patient" ? (
                    // patient Login Form
                    <PatientLogin />
                  ) : (
                    // doctor Login Form
                    <DoctorLogin />
                  )}
                </MDBTabsPane>
                <MDBTabsPane show={loginRegisterActive === "Register"}>
                  <div className="text-center">
                    <MDBTabs pills className="form-switchContainer">
                      <MDBTabsItem className="w-50">
                        <MDBTabsLink
                          onClick={() => handleUserTypeClick("patient")}
                          active={userType === "patient"}
                          className="m-0 text-capitalize"
                        >
                          Patient
                        </MDBTabsLink>
                      </MDBTabsItem>
                      <MDBTabsItem className="w-50">
                          <MDBTabsLink
                            onClick={() => handleUserTypeClick("doctor")}
                            active={userType === "doctor"}
                             className="m-0 text-capitalize"
                          >
                            Doctor
                          </MDBTabsLink>
                        </MDBTabsItem>
                    </MDBTabs>
                  </div>
                  {userType === "patient" ? (
                    // patient Registration Form
                    <PatientRegistration />
                  ) : (
                    // doctor Registration Form
                    <DoctorRegistration />
                  )}
                </MDBTabsPane>
              </MDBTabsContent>
              <div className="text-center pt-5" style={{ color: "#212121", fontSize: "12px"}}>
              © 2025 All rights reserved. 
              {/* <span onClick={()=>{ navigate("/adminLogin") }}>AdminVerse</span> */}
            </div>
            </Box>
          </Box>
          <Box className="d-flex doctor-bg" sx={{width: "50%", padding: "64px 20px 50px", position: "relative", height: "100vh"}}>

            <img src={doctorImg} alt="doctorImg" className="m-auto doctor-img" />
          </Box>
        </Box>
       
      </div>
      {/* </div> */}
    </>
  );
}
