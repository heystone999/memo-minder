import React, { useState, useEffect, useRef } from "react";
import "./ChallengeArea.css";
import Popup from '../popup/Popup';

const imagesRight = ['char_right1.png', 'char_right2.png', 'char_right3.png'];
const imagesLeft = ['char_left1.png', 'char_left2.png', 'char_left3.png'];
const AttackRight = ['rightAtk1.png', 'rightAtk2.png', 'rightAtk3.png', 'rightAtk4.png', 'rightAtk6.png', 'rightAtk7.png', 'rightAtk8.png'];
const AttackLeft = ['leftAtk1.png', 'leftAtk2.png', 'leftAtk3.png', 'leftAtk4.png', 'leftAtk6.png', 'leftAtk7.png', 'leftAtk8.png'];
const stickAttackRight = ['rightStick1.png', 'rightStick2.png', 'rightStick3.png'];
const stickAttackLeft = ['leftStick1.png', 'leftStick2.png', 'leftStick3.png'];
const swordAttackRight = ['rightSword1.png', 'rightSword2.png', 'rightSword3.png'];
const swordAttackLeft = ['leftSword1.png', 'leftSword2.png', 'leftSword3.png'];
// lightingAnimationFrames 定义移到组件外部或顶层
const lightingAnimationFrames = [
  'lighting1.png', 'lighting2.png', 'lighting3.png', 'lighting4.png', 'lighting5.png'
];


function ChallengeArea() {
  // initial state
  const [position, setPosition] = useState(5); 
  const [currentImage, setCurrentImage] = useState('char_right1.png');
  const [direction, setDirection] = useState('right');
  // get bought items
  const [boughtItems, ] = useState(() => {
    const saved = localStorage.getItem('boughtItems');
    return saved ? JSON.parse(saved) : {};
  });
  // popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState({ title: '', body: '', background_color: ''});
  // image index for animation
  const imageIndex = useRef(0);
  // magic state
  const [isMagicAttack, setIsMagicAttack] = useState(false);
  // state for mouse position for apply magic attack
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
// 新增动画控制状态
const [showLighting, setShowLighting] = useState(false);
const [lightingPosition, setLightingPosition] = useState({ x: 0, y: 0 });
const [currentLightingImage, setCurrentLightingImage] = useState('');
// 使用useRef代替let来存储lightingAnimationIndex
const lightingAnimationIndex = useRef(0);

  // popup
  const showCustomPopup = (title, body, background_color) => {
    setPopupMessage({ title, body, background_color });
    setShowPopup(true);
  };

  // Preload every pic
  useEffect(() => {
    [...imagesRight, ...imagesLeft, 
      ...swordAttackRight, ...swordAttackLeft,
      ...AttackRight, ...AttackLeft,
      ...stickAttackRight, ...stickAttackLeft].forEach(image => {
      const img = new Image();
      img.src = image;
    });
  }, []);

  
  // Animation
  useEffect(() => {
      let attackAnimationInterval;
      const updateImageForDirection = (dir) => {
          const images = dir === 'right' ? imagesRight : imagesLeft;
          setCurrentImage(images[imageIndex.current % images.length]);
          imageIndex.current++;
      };
      /* ----------- key down start ----------*/
      const handleKeyDown = (event) => {
        // check if weapon is purchased
        const isSwordAvailable = boughtItems['sword'];
        const isStickAvailable = boughtItems['stick'];
        const isBookAvailable = boughtItems['magicBook'];
        if (event.key === "0") { // magic attck
          if (isBookAvailable){
            setIsMagicAttack(!isMagicAttack); // transfer to magic state
            const magicImage = direction === 'right' ? 'rightMagic.png' : 'leftMagic.png';
            setCurrentImage(magicImage);
            return; // prevent other state
          }else{
            showCustomPopup("Purchase Required", "You need to purchase the Magic Book to use this attack.", "rgba(243, 97, 105, 0.7)");
          }
        } if (event.key === "9") { // sword attack
          if (isSwordAvailable) {
            if (!attackAnimationInterval) {
              imageIndex.current = 0;
              attackAnimationInterval = setInterval(() => {
                const attackImages = direction === 'right' ? swordAttackRight : swordAttackRight;
                setCurrentImage(attackImages[imageIndex.current % attackImages.length]);
                imageIndex.current++;
              }, 150);
            }
          } else {
            showCustomPopup("Purchase Required", "You need to purchase the Sword to use this attack.", "rgba(243, 97, 105, 0.7)");
          }
        } else if (event.key === "8") { // stick attacks
          if (isStickAvailable) {
            if (!attackAnimationInterval) {
              imageIndex.current = 0; 
              attackAnimationInterval = setInterval(() => {
                const attackImages = direction === 'right' ? stickAttackRight : stickAttackLeft;
                setCurrentImage(attackImages[imageIndex.current % attackImages.length]);
                imageIndex.current++;
              }, 150);
            }
          } else {
            showCustomPopup("Purchase Required", "You need to purchase the Stick to use this attack.", "rgba(243, 97, 105, 0.7)");
          }
        } else if (event.key === "7") { // normal attack
          if (!attackAnimationInterval) {
            imageIndex.current = 0;
            attackAnimationInterval = setInterval(() => {
              const attackImages = direction === 'right' ? AttackRight : AttackLeft;
              setCurrentImage(attackImages[imageIndex.current % attackImages.length]);
              imageIndex.current++;
            }, 150);
          }
        } else if (event.key.toLowerCase() === "a" || event.key === "ArrowLeft") {
          setPosition(prevPosition => Math.max(prevPosition - 1, 0));
          setDirection('left');
          if (!attackAnimationInterval) {
            updateImageForDirection('left');
          }
        } else if (event.key.toLowerCase() === "d" || event.key === "ArrowRight") {
          setPosition(prevPosition => Math.min(prevPosition + 1, 100));
          setDirection('right');
          if (!attackAnimationInterval) {
            updateImageForDirection('right');
          }
        }
      };
      /* ----------- key down end ----------*/
      /* ----------- key up start ----------*/
      const handleKeyUp = (event) => {
        if (event.key === "0" && !isMagicAttack) {
          const transitionImage = direction === 'right' ? imagesRight[0] : imagesLeft[0];
          setCurrentImage(transitionImage);
        }if ((event.key === "7" || event.key === "8" || event.key === "9") && attackAnimationInterval) {
          clearInterval(attackAnimationInterval);
          attackAnimationInterval = null;
          const transitionImage = direction === 'right' ? imagesRight[0] : imagesLeft[0];
          setCurrentImage(transitionImage);
          setTimeout(() => {
            imageIndex.current = 0; // Reset index for walking animation after a short delay
          }, 100);
        }
      };
      /* ----------- key up end ----------*/
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);
      return () => {
          window.removeEventListener("keydown", handleKeyDown);
          window.removeEventListener("keyup", handleKeyUp);
          if (attackAnimationInterval) {
              clearInterval(attackAnimationInterval);
          }
      };
  }, [direction, boughtItems, isMagicAttack]); // Ensure boughtItems is a dependency

  // show use-magic icon with mouse
  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);


  // Magic attack click
  useEffect(() => {
    const handleMouseClick = (event) => {
      if (!isMagicAttack) return;
      setShowLighting(true);
      setLightingPosition({ x: event.clientX, y: event.clientY });
      lightingAnimationIndex.current = 0;
      setCurrentLightingImage(lightingAnimationFrames[lightingAnimationIndex.current]);
      const intervalId = setInterval(() => {
        lightingAnimationIndex.current += 1;
        if (lightingAnimationIndex.current >= lightingAnimationFrames.length) {
          setShowLighting(false);
          clearInterval(intervalId);
        } else {
          setCurrentLightingImage(lightingAnimationFrames[lightingAnimationIndex.current]);
        }
      }, 100); 
      return () => {
        clearInterval(intervalId);
      };
    };
    window.addEventListener('click', handleMouseClick);
    return () => {
      window.removeEventListener('click', handleMouseClick);
    };
  }, [isMagicAttack, setShowLighting, setLightingPosition, setCurrentLightingImage]);



  return (
    <div className="challenge-page">
      <Popup show={showPopup} onClose={() => setShowPopup(false)} message={popupMessage} />
      <div className="combat-background">
        <div className="character" style={{ left: `${position}%`, backgroundImage: `url(${currentImage})` }}></div>
        {/* Conditional rendering for the magic icon */}
        {isMagicAttack && (
          <img className="use-magic-icon" src="UseLighting.png" alt="Use Lighting" style={{ position: 'absolute', left: mousePosition.x, top: mousePosition.y, transform: 'translate(-50%, -51%)' }} />
        )}
        {/* Conditional rendering for the lighting animation */}
        {showLighting && (
          <img className="lighting" src={currentLightingImage} alt="Lighting Animation" style={{ position: 'absolute', left: lightingPosition.x, top: lightingPosition.y, transform: 'translate(-50%, -80%)' }} />
        )}
      </div>
      <div className="explain-text">
        {/* Your existing explanation text */}
      </div>
    </div>
  );
}

export default ChallengeArea;