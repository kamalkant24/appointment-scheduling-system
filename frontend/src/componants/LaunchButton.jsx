import React from "react";
import { Button } from "@mui/material";
import KeyBoardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

function LaunchButton(props) {
  return (
    <div>
      <Button variant="contained" sx={{ borderRadius: 50, py: "10px", px: "25px", margin: '5px', background: "linear-gradient(90deg, #471e75 10% , #893be3)", color: "#fff", fontWeight: "600" }} >
        {props.value}
        { props.value !== "Sign Up" ?  <KeyBoardArrowRightIcon /> : null}
      </Button>
    </div>
  );
}

export default LaunchButton;
