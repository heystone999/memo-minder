import React, { useState, useEffect } from "react";
import "./ChallengeArea.css";

const imagesRight = ['char_right1.png', 'char_right2.png', 'char_right3.png'];
const imagesLeft = ['char_left1.png', 'char_left2.png', 'char_left3.png'];

// preload every pic
[...imagesRight, ...imagesLeft].forEach(image => {
  const img = new Image();
  img.src = image;
});

function ChallengeArea() {
    const [position, setPosition] = useState(5); // initial state
    const [currentImage, setCurrentImage] = useState('char_right1.png'); // initial pic
    
    useEffect(() => {
        let imageIndex = 0; // transfer pic

        const handleKeyDown = (event) => {
          if (event.key === "a" || event.key === "A" || event.key === "ArrowLeft") {
              setPosition(prevPosition => Math.max(prevPosition - 1.8, 0)); // move left
              setCurrentImage(imagesLeft[imageIndex % imagesLeft.length]); 
              imageIndex++;
          } else if (event.key === "d" || event.key === "D" ) {
              setPosition(prevPosition => Math.min(prevPosition + 1.8, 100)); // move right
              setCurrentImage(imagesRight[imageIndex % imagesRight.length]); 
              imageIndex++; 
          }
        };
      

        window.addEventListener("keydown", handleKeyDown);

        return () => window.removeEventListener("keydown", handleKeyDown); 
    }, []); 

    return (
        <div className="challenge-page">
            <div className="combat-background">
                <div className="character" style={{ left: `${position}%`, backgroundImage: `url(${currentImage})` }}></div>
            </div>
        </div>
    );
}

export default ChallengeArea;
