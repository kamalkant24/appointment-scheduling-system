import React, { useState } from "react";
import { MDBInput, MDBBtn } from "mdb-react-ui-kit";
import axios from "axios";
import { Vortex } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import axiosAsistance from "../utils/axiosAsistance";
// import { useNavigate } from "react-router-dom";

const DoctorRegistration = () => {
  console.log(process.env.REACT_APP_BASE_URL, 'api----');
  // const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    speciality: "",
    venue: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const [errors, setErrors] = useState({
    name: { state: false, para: { maxLength: 50, minLength: 1 } },
    phoneNumber: { state: false, para: { maxLength: 50, minLength: 1 } },
    email: { state: false },
    speciality: { state: false, para: { maxLength: 50, minLength: 1 } },
    venue: { state: false, para: { maxLength: 50, minLength: 1 } },
    email: {
      state: false,
      errMsg: '',
      para: {
        maxLength: 500,
        minLength: 3,
        match:
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      },
    },
    password: {
      state: false,
      para: {
        maxLength: 50,
        minLength: 6,
        match: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{6,}$/,
      },
    },
    confirmPassword: { state: false, para: { maxLength: 50, minLength: 6 } },
  });

  const unsetErrors = (event) => {
    let key = event.target.name;
    // //console.log(key)
    setErrors((prevData) => {
      return {
        ...prevData,
        [key]: {
          ...prevData[key],
          state: false
      }
    }
    })
}

  const validateForm = () => {
    setIsLoading(true);
    // Trim all form field values
    const trimmedformData = {};
    for (const key in formData) {
      trimmedformData[key] = formData[key].trim();
    }
    setFormData(trimmedformData);

    // Validate each field
    const updatedErrors = { ...errors };
    for (const key in updatedErrors) {
      const value = trimmedformData[key];
      const para = updatedErrors[key].para;

      if (value === "" || value === null || value === undefined) {
        updatedErrors[key].state = true;
      } else if (
        para != null &&
        para.minLength !== null &&
        (value.length < para.minLength || value.length > para.maxLength)
      ) {
        updatedErrors[key].state = true;
      } else if (
        para != null &&
        para.match != null && !value.match(para.match)) {
        updatedErrors[key].state = true;
      } else {
        updatedErrors[key].state = false;
      }
    }
    setIsLoading(false);
    setErrors(updatedErrors);
  };

  const sendDataToBackend = async () => {
    setIsLoading(true);
    if (!errors.password.state && !errors.confirmPassword.state) {

      if (formData.password === formData.confirmPassword) {

        let totalValidInputs = 0;
        for (const key in errors) {

          if (!errors[key].state) {
            totalValidInputs++;
          }

        } 
        
        if (totalValidInputs === (Object.keys(errors).length)) {

          // console.log("Sending data")

          let dataToSend = formData

          delete dataToSend["confirmPassword"]

          // console.log(dataToSend)

          await axiosAsistance.post("/register/organizer", dataToSend)
            .then((response) => {
              console.log("Registered successfully")
              setIsLoading(false);
            //   navigate('/');

            })
            .catch((error) => {
              setIsLoading(false)
              // //console.log("Error during registration", error);
              // //console.log(error.response);
              if(error.response.data.msg === 'duplicate email') {

                setErrors((prevData) => {
                  return {
                    ...prevData,
                    email: {
                      ...prevData.email,
                      state: true,
                      errMsg: 'User with this email already exists'
                    }
                  }
                });

              }
            });
          
            
        }
      } else {
        setIsLoading(false);
        setErrors((prevData) => {
          return {
            ...prevData,
            confirmPassword: {
              ...prevData.confirmPassword,
              state: true
            }
          }
        });
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await validateForm();
    await sendDataToBackend();
  }

  return (
    <div className="form">
      {/* <h1>Doctor Registration</h1> */}
    <form onSubmit={handleSubmit} className="registration-form">
    <label htmlFor="name" className="custom-label mt-4">Name</label>
      <MDBInput
        // label="Name"
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        className="" 
        onFocusCapture={(event) => {unsetErrors(event)}}
      />
      {errors.name.state ? (
          <div className="error-message" >Please provide Name</div>
        ) : null}

      <label htmlFor="phoneNumber" className="custom-label mt-3">Phone Number</label>
      <MDBInput
        // label="Phone Number"
        type="text"
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleChange}
        className="" 
        onFocusCapture={(event) => {unsetErrors(event)}}
      />
      {errors.phoneNumber.state ? (
          <div className="error-message" >Please provide phone number</div>
        ) : null}

      <label htmlFor="email" className="custom-label mt-3">Email</label>
      <MDBInput
        // label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        className="" 
        onFocusCapture={(event) => {unsetErrors(event)}}
      />
      {errors.email.state ? (
          <div className="error-message" >Please provide organization Email ID</div>
        ) : null}
         
         
        <label htmlFor="password" className="custom-label mt-3">Password</label>
        <MDBInput
        // label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        className="0" 
        onFocusCapture={(event) => {unsetErrors(event)}}
      />
      {errors.password.state ? (
          <div className="error-message" >Please provide a valid password(Atleat 6 character including[numbers, lower and upper case letters and special characters])</div>
        ) : null}

      <label htmlFor="confirmPassword" className="custom-label mt-3">Confirm Password</label>
      <MDBInput
        // label="Confirm Password"
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        className="" 
        onFocusCapture={(event) => {unsetErrors(event)}}
      />
      {errors.confirmPassword.state ? (
          <div className="error-message" >Please confirm your password</div>
        ) : null}
         
      <label htmlFor="age" className="custom-label mt-3">Age</label>
      <MDBInput
        // label="Age"
        type="number"
        name="age"
        value={formData.age}
        onChange={handleChange}
        className="" 
        onFocusCapture={(event) => {unsetErrors(event)}}
      />

      <label htmlFor="Speciality" className="custom-label mt-3">Speciality</label>
      <MDBInput
        // label="Speciality"
        type="text"
        name="speciality"
        value={formData.speciality}
        onChange={handleChange}
        className="" 
        onFocusCapture={(event) => {unsetErrors(event)}}
      />
      {errors.speciality.state ? (
          <div className="error-message" >Please provide your speciality</div>
        ) : null}
      
      <label htmlFor="venue" className="custom-label mt-3">Seating</label>
      <MDBInput
        // label="Seating"
        type="text"
        name="venue"
        value={formData.venue}
        onChange={handleChange}
        className="" 
        onFocusCapture={(event) => {unsetErrors(event)}}
      />
      {errors.venue.state ? <div className="error-message" >Please provide your seating</div> : null}
      
      <MDBBtn type="submit" className="mt-4 btn-lg text-capitalize" block>
        Register
      {/* {isLoading ? (
            <Vortex
              visible={true}
              height="30"
              width="30"
              ariaLabel="vortex-loading"
              wrapperStyle={{}}
              wrapperClass="vortex-wrapper"
              colors={[
                "#ed2690",
                "#000032",
                "#ed2690",
                "#000032",
                "#000032",
                "#ed2690",
              ]}
            />
          ) : (
            "Sign Up as Organizer"
          )} */}
      </MDBBtn>
    </form>
    </div>
  );
};

export default DoctorRegistration;
