import roses from "./images/roses.jpg";
import sad from "./images/sad.jpg";
import smiling from "./images/smiling.jpg";
import "./App.css";
import { Button, Grid2, keyframes, styled } from "@mui/material";
import { useEffect, useState } from "react";
import { getContrastColor } from "./helper/convenient";

const buttonWidth = 110;
const buttonHeight = 67;

const NoButton = styled(Button)(({ positionStyle }) => ({
  height: buttonHeight,
  width: buttonWidth,
  position: "absolute",
  top: positionStyle.y,
  left: positionStyle.x,
  color: "#fff",
  fontWeight: "bold",
  fontSize: "1.25rem",
  backgroundColor: "hsl(4, 92.00%, 50.80%)",
  border: "none",
  cursor: "pointer",
  transition: "transform 0.1s ease-out",
  // transform: `translate(${positionStyle.x}px, ${positionStyle.y}px)`,
}));

const flowAndShake = keyframes`
  0%, 100% {
    transform: translate(calc(var(--x) * -1%), 0) rotate(calc(var(--rotation) * -1deg));
  }
  50% {
    transform: translate(calc(var(--x) * 1%), calc(var(--y) * 1%)) rotate(calc(var(--rotation) * 1deg));
  }
`;

const yesButtonBgColor = "hsl(109, 87.20%, 36.90%)";
const YesButton = styled(Button)(({ theme, shake }) => ({
  position: "relative",
  padding: "1rem 1.25rem",
  fontWeight: "bold",
  fontSize: "1.25rem",
  background: yesButtonBgColor,
  color: getContrastColor(yesButtonBgColor),
  outlineColor: "hsl(210, 100%, 80%)",
  border: "none",
  cursor: "pointer",
  animation: shake ? `${flowAndShake} 0.1s infinite ease-in-out` : `none`,
  "--speed": 0.1,
  "--rotation": -1,
  "--y": -1,
  "--x": 1,
  // animation: bounce ? `${flowAndShake} 1s infinite ease-in-out` : "none",
  "&:active": {
    background: "hsl(210, 100%, 30%)",
    "--speed": 0.1,
    "--x": 0,
    "--y": 5,
    "--rotation": 0,
  },
  "&:hover": {
    background: "hsl(210, 100%, 40%)",
    "--speed": 0.1,
    "--rotation": -1,
    "--y": -1,
    "--x": 1,
  },
}));

const bounceAnimation = `
  @keyframes bounce {
    0% {
      transform: translate(0, 0);
    }
    20% {
      transform: translate(150px, -20px);
    }
    40% {
      transform: translate(300px, 0);
    }
    60% {
      transform: translate(150px, -10px);
    }
    80% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(0, 0);
    }
  }
`;

const App = () => {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  const [shake, setShake] = useState(false);
  const [clickedNo, setClickedNo] = useState(0);
  const [position, setPosition] = useState({
    x: windowWidth / 2,
    y: (windowHeight / 4) * 3 + 100,
  });

  useEffect(() => {
    const body = document.querySelector("body");
    if (!body) {
      throw new ReferenceError("body section not found.");
    }
    const createHeart = () => {
      const heart = document.createElement("i");
      heart.className = "fa-solid fa-heart";
      heart.style.left = Math.random() * 100 + "vw";
      heart.style.animationDuration = Math.random() * 3 + 2 + "s";
      body.appendChild(heart);
    };
    setInterval(createHeart, 1000);
    setInterval(function name(params) {
      var heartArr = document.querySelectorAll(".fa-heart");
      if (heartArr.length > 200) {
        heartArr[0].remove();
      }
    }, 100);
  }, []);

  // Track mouse position and move button away
  const handleMouseMove = (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    // Get the button's current position (centered)
    const buttonX = position.x + buttonWidth / 2;
    const buttonY = position.y + buttonHeight / 2;

    // Calculate direction vector from the mouse to the button
    const diffX = mouseX - buttonX;
    const diffY = mouseY - buttonY;

    // Calculate the new position by moving the button away from the mouse
    const speed = 18; // Controls the speed of the button movement
    let newPositionX = position.x - (diffX / Math.abs(diffX || 1)) * speed;
    let newPositionY = position.y - (diffY / Math.abs(diffY || 1)) * speed;

    // Calculate the maximum x and y positions to ensure the button stays within the viewport
    const maxX = windowWidth - buttonWidth - 10; // Subtract button width and a small margin
    const maxY = windowHeight - buttonHeight - 10; // Subtract button height and a small margin

    // Prevent the button from going out of bounds
    newPositionX = Math.min(Math.max(newPositionX, 10), maxX);
    newPositionY = Math.min(Math.max(newPositionY, 10), maxY);

    // Update the position state
    setPosition({
      x: newPositionX,
      y: newPositionY,
    });
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [position]);

  const handleNoClick = () => {
    setClickedNo(1);
  };
  const imageToUse = clickedNo > 0 ? (clickedNo === 1 ? sad : smiling) : roses;

  const handleYesClick = () => {
    setClickedNo(2);
    setShake(true);
    setTimeout(() => setShake(false), 5000);
  };
  const initialmessage = "Ms QTjiong Hann, would you be my valentine?";
  const goodMessage = "YAYYYY!! 😘😘😘";
  const badMessage =
    "Did you just reject me? 🙁 Giving you another chance 😠!!!";

  const renderMessage = () => {
    if (clickedNo === 2) {
      return goodMessage;
    } else if (clickedNo === 1) {
      return badMessage;
    } else {
      return initialmessage;
    }
  };

  return (
    <>
      <style>{bounceAnimation}</style>
      <h1>{renderMessage()}</h1>
      <img src={imageToUse} className="App-logo" alt="logo" />
      <Grid2 sx={{ margin: 5 }}>
        <YesButton onClick={handleYesClick} shake={shake}>
          YESS!!
        </YesButton>
        <NoButton onClick={handleNoClick} positionStyle={position}>
          NO :(
        </NoButton>
      </Grid2>
    </>
  );
};

export default App;
