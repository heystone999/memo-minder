import React, { useState, useEffect, useRef } from "react";
import "./ChallengeArea.css";
import Popup from '../popup/Popup';

// Character image
const imagesRight = ['char_right1.png', 'char_right2.png', 'char_right3.png'];
const imagesLeft = ['char_left1.png', 'char_left2.png', 'char_left3.png'];
const AttackRight = ['rightAtk1.png', 'rightAtk2.png', 'rightAtk3.png', 'rightAtk4.png', 'rightAtk6.png', 'rightAtk7.png', 'rightAtk8.png'];
const AttackLeft = ['leftAtk1.png', 'leftAtk2.png', 'leftAtk3.png', 'leftAtk4.png', 'leftAtk6.png', 'leftAtk7.png', 'leftAtk8.png'];
const stickAttackRight = ['rightStick1.png', 'rightStick2.png', 'rightStick3.png'];
const stickAttackLeft = ['leftStick1.png', 'leftStick2.png', 'leftStick3.png'];
const swordAttackRight = ['rightSword1.png', 'rightSword2.png', 'rightSword3.png'];
const swordAttackLeft = ['leftSword1.png', 'leftSword2.png', 'leftSword3.png'];
const lightingAnimationFrames = ['lighting1.png', 'lighting2.png', 'lighting3.png', 'lighting4.png', 'lighting5.png'];
// Boss image
const bossImagesLeft = ['wolfgoleft1.png', 'wolfgoleft2.png'];
const bossImagesRight = ['wolfgoright1.png', 'wolfgoright2.png'];

// Define the level data
const levels = [
  { bossPosition: 95, bossHealth: 100, bossImages: bossImagesLeft }, // Level 1
  // Define other levels here...
];

function ChallengeArea() {
  // initial state
  const [position, setPosition] = useState(5); 
  const [health, setHealth] = useState(100);
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
  // magic attack lighting
  const [showLighting, setShowLighting] = useState(false);
  const [lightingPosition, setLightingPosition] = useState({ x: 0, y: 0 });
  const [currentLightingImage, setCurrentLightingImage] = useState('');
  const lightingAnimationIndex = useRef(0);
  // popup
  const showCustomPopup = (title, body, background_color) => {
    setPopupMessage({ title, body, background_color });
    setShowPopup(true);
  };
  // boss state
  const [currentLevel, setCurrentLevel] = useState(0); // Current level index
  const [bossPosition, setBossPosition] = useState(levels[currentLevel].bossPosition); // Initial boss position
  const [bossHealth, setBossHealth] = useState(levels[currentLevel].bossHealth); // Boss health state
  const [currentBossImage, setCurrentBossImage] = useState(levels[currentLevel].bossImages[0]); // Initial boss image
  const bossImageIndex = useRef(0);
  // Add boss attack power
  const [bossAttackCooldown, setBossAttackCooldown] = useState(false); 
  const bossCooldownTime = 1000; 
  // New state to track if the game has started
  const [gameStarted, setGameStarted] = useState(false);
  const [isChallengeAvailable, setIsChallengeAvailable] = useState(false);

  // Add state for tracking challenge attempts
  const [attempts, setAttempts] = useState(() => {
    // Retrieve attempts from localStorage or default to 1
    const savedAttempts = localStorage.getItem('challengeAttempts');
    const attemptsData = savedAttempts ? JSON.parse(savedAttempts) : { count: 1, date: new Date().toDateString() };
    // Check if it's a new day to reset attempts
    if (new Date().toDateString() !== attemptsData.date) {
      return { count: 1, date: new Date().toDateString() };
    }
    return attemptsData;
  });
  const maxAttempts = 1; // Maximum attempts allowed per day
  
  useEffect(() => {
    // Persist attempts to localStorage
    localStorage.setItem('challengeAttempts', JSON.stringify(attempts));
  }, [attempts]);

  const startChallenge = () => {
    // Update logic to decrement attempts and set the last attempt date
    if (attempts.count > 0) {
      setAttempts(prev => ({ ...prev, count: prev.count - 1 }));
      setGameStarted(true);
    }
  };

  // Check challenge availability based on attempts count instead of last attempt date
  useEffect(() => {
    setIsChallengeAvailable(attempts.count > 0);
  }, [attempts.count]);

  // Check Challenge Availability
  useEffect(() => {
    const checkChallengeAvailability = () => {
      const lastAttempt = localStorage.getItem('lastAttempt');
      if (!lastAttempt) {
        setIsChallengeAvailable(true);
        return;
      }

      const lastAttemptDate = new Date(parseInt(lastAttempt));
      const now = new Date();
      const nextAvailableDate = new Date(lastAttemptDate);
      nextAvailableDate.setDate(nextAvailableDate.getDate() + 1);
      nextAvailableDate.setHours(8, 0, 0, 0); // Set to 8 AM on the next day

      if (now >= nextAvailableDate) {
        setIsChallengeAvailable(true);
      } else {
        setIsChallengeAvailable(false);
      }
    };

    checkChallengeAvailability();
    const intervalId = setInterval(checkChallengeAvailability, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, []);


  // Preload every pic
  useEffect(() => {
    [...imagesRight, ...imagesLeft, 
      ...swordAttackRight, ...swordAttackLeft,
      ...AttackRight, ...AttackLeft,
      ...stickAttackRight, ...stickAttackLeft,
      ...bossImagesLeft, ...bossImagesRight].forEach(image => {
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
    // apply damage to boss
    const applyDamageToBoss = (damageAmount) => {
      setBossHealth((prevHealth) => Math.max(prevHealth - damageAmount, 0));
    };
    const handleKeyDown = (event) => {
      // check if weapon is purchased
      const isSwordAvailable = boughtItems['sword'];
      const isStickAvailable = boughtItems['stick'];
      const isBookAvailable = boughtItems['magicBook'];
  
      switch(event.key) {
        case "0": // Toggle magic attack
          if (isBookAvailable) {
            setIsMagicAttack(!isMagicAttack);
            const magicImage = direction === 'right' ? 'rightMagic.png' : 'leftMagic.png';
            setCurrentImage(magicImage);
          } else {
            showCustomPopup("Purchase Required", "You need to purchase the Magic Book to use this attack.", "rgba(243, 97, 105, 0.7)");
          }
          break;
        case "9": // Sword attack
          if (isSwordAvailable) {
            if (!attackAnimationInterval) {
              imageIndex.current = 0;
              attackAnimationInterval = setInterval(() => {
                const attackImages = direction === 'right' ? swordAttackRight : swordAttackLeft;
                setCurrentImage(attackImages[imageIndex.current % attackImages.length]);
                imageIndex.current++;
                if (imageIndex.current === attackImages.length) {
                  clearInterval(attackAnimationInterval);
                  attackAnimationInterval = null;
                  applyDamageToBoss(15); 
                }
              }, 150);
            }
          } else {
            showCustomPopup("Purchase Required", "You need to purchase the Sword to use this attack.", "rgba(243, 97, 105, 0.7)");
          }
          break;
        case "8": // Stick attack
          if (isStickAvailable) {
            if (!attackAnimationInterval) {
              imageIndex.current = 0;
              attackAnimationInterval = setInterval(() => {
                const attackImages = direction === 'right' ? stickAttackRight : stickAttackLeft;
                setCurrentImage(attackImages[imageIndex.current % attackImages.length]);
                imageIndex.current++;
                if (imageIndex.current === attackImages.length) {
                  clearInterval(attackAnimationInterval);
                  attackAnimationInterval = null;
                  applyDamageToBoss(10); 
                }
              }, 150);
            }
          } else {
            showCustomPopup("Purchase Required", "You need to purchase the Stick to use this attack.", "rgba(243, 97, 105, 0.7)");
          }
          break;
        case "7": // Normal attack
          if (!attackAnimationInterval) {
            imageIndex.current = 0;
            attackAnimationInterval = setInterval(() => {
              const attackImages = direction === 'right' ? AttackRight : AttackLeft;
              setCurrentImage(attackImages[imageIndex.current % attackImages.length]);
              imageIndex.current++;
              if (imageIndex.current === attackImages.length) {
                clearInterval(attackAnimationInterval);
                attackAnimationInterval = null;
                applyDamageToBoss(5); 
              }
            }, 150);
          }
          break;
        case "a":
        case "ArrowLeft":
          setPosition(prevPosition => Math.max(prevPosition - 1, 0));
          setDirection('left');
          if (!attackAnimationInterval) {
            updateImageForDirection('left');
          }
          break;
        case "d":
        case "ArrowRight":
          setPosition(prevPosition => Math.min(prevPosition + 1, 100));
          setDirection('right');
          if (!attackAnimationInterval) {
            updateImageForDirection('right');
          }
          break;
        default:
          break;
      }
    };
  
    const handleKeyUp = (event) => {
      if (["0", "7", "8", "9"].includes(event.key)) {
        const transitionImage = direction === 'right' ? imagesRight[0] : imagesLeft[0];
        setCurrentImage(transitionImage);
      }
      if (isMagicAttack) { 
        const magicImage = direction === 'right' ? 'rightMagic.png' : 'leftMagic.png';
        setCurrentImage(magicImage);
      }
      if (attackAnimationInterval) {
        clearInterval(attackAnimationInterval);
        attackAnimationInterval = null;
      }
    };
  
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      if (attackAnimationInterval) {
        clearInterval(attackAnimationInterval);
      }
    };
  }, [direction, boughtItems, isMagicAttack, position, bossHealth]); 
  

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
      const lightingPos = { x: event.clientX, y: event.clientY };
      setLightingPosition(lightingPos);
      lightingAnimationIndex.current = 0;
      setCurrentLightingImage(lightingAnimationFrames[lightingAnimationIndex.current]);

      const intervalId = setInterval(() => {
        lightingAnimationIndex.current += 1;
        if (lightingAnimationIndex.current >= lightingAnimationFrames.length) {
          setShowLighting(false);
          clearInterval(intervalId);
          // check collision
          if (CharacterAttackCollision(lightingPos, bossPosition)) {
            setBossHealth((prevHealth) => Math.max(prevHealth - 20, 0)); 
          }
        } else {
          setCurrentLightingImage(lightingAnimationFrames[lightingAnimationIndex.current]);
        }
      }, 100);

      return () => clearInterval(intervalId);
    };

    window.addEventListener('click', handleMouseClick);
    return () => window.removeEventListener('click', handleMouseClick);
  }, [isMagicAttack, bossPosition, bossHealth]);

  // Boss Attack Collision detection function
  const BossAttackCollision = (distance) => {
    const collisionThreshold = 10; 
    return Math.abs(distance) <= collisionThreshold;
  };

  // Character Attack collision detection
  const CharacterAttackCollision = (lightingPosition, bossPosition) => {
    const gameArea = document.querySelector('.combat-background');
    if (!gameArea) {
      console.error('Game area not found');
      return false;
    }
    const gameAreaWidth = gameArea.offsetWidth; 
    const gameAreaLeftEdge = gameArea.getBoundingClientRect().left; 
    const lightingPositionPercentage = ((lightingPosition.x - gameAreaLeftEdge) / gameAreaWidth) * 100;

    const collisionThreshold = 10;
    const distance = Math.abs(lightingPositionPercentage - bossPosition); 
    return distance <= collisionThreshold;
  };

  /* ------------- Boss Logic Start ------------ */
  // Boss Logic with game start condition
  useEffect(() => {
    // Only start boss logic if the game has started
    if (!gameStarted) return;

    const bossSpeed = 0.3; // Boss move speed
    const moveBoss = () => {
      const distance = bossPosition - position;
      // Update boss position
      if (distance < -12) {
        setBossPosition(bossPosition => Math.min(bossPosition + bossSpeed, 100));
        setCurrentBossImage(bossImagesRight[bossImageIndex.current % bossImagesRight.length]);
      } else if (distance > 6) {
        setBossPosition(bossPosition => Math.max(bossPosition - bossSpeed, 0));
        setCurrentBossImage(bossImagesLeft[bossImageIndex.current % bossImagesLeft.length]);
      }
      bossImageIndex.current = (bossImageIndex.current + 1) % bossImagesLeft.length;
      // Set boss attack interval
      if (!bossAttackCooldown && BossAttackCollision(distance)) {
        if (bossHealth > 0) {
          setHealth(prevHealth => Math.max(prevHealth - 5, 0));
          setBossAttackCooldown(true);
          setTimeout(() => {
            setBossAttackCooldown(false);
          }, bossCooldownTime);
        }
      }
    };

    const intervalId = setInterval(moveBoss, 80);

    return () => clearInterval(intervalId);
  }, [position, bossPosition, bossAttackCooldown, bossHealth, gameStarted]); // Added gameStarted as a dependency

  /* ------------- Boss Logic End ------------- */

  // check victory
  useEffect(() => {
    if (bossHealth === 0) {
      showCustomPopup("Victory!", "Congratulations, you have defeated the boss!", "rgba(8,186,255, 0.7)");
      // Move to the next level if available
      if (currentLevel < levels.length - 1) {
        setCurrentLevel(currentLevel  + 1);
        setBossPosition(levels[currentLevel + 1].bossPosition);
        setBossHealth(levels[currentLevel + 1].bossHealth);
        setCurrentBossImage(levels[currentLevel + 1].bossImages[0]);
      }
    }
  }, [bossHealth, currentLevel]);

  return (
    <div className="challenge-page">
      {!gameStarted ? (
        // Initial screen layout
        <div className="start-screen">
          <h1>Challenge Area</h1>
          <div className="select-boss">
            <button>LEVEL 5 - WOLF <img src="wolf-icon.png" alt="" /></button>
            <button>LEVEL 10 - CAT <img src="wolf-icon.png" alt="" /></button>
          </div>
          <div className="start-button">
            <div className="challenge-info">
            <p>Challenge Attempts {attempts.count}/{maxAttempts}</p>
              <p>Level 5</p>
            </div>
            {/*- Start Button -*/}
            <button onClick={startChallenge} disabled={!isChallengeAvailable}>
              START
            </button>
            {attempts.count === 0 && (
              <div className="notice">
                You have reached your daily challenge limit.<br/> 
                Please try again tomorrow at 8 am.
              </div>
            )}
          </div>
         
        </div>
      ) : (

        // ------- Game content -------- //
        <>
          <Popup show={showPopup} onClose={() => setShowPopup(false)} message={popupMessage} />
          <div className="combat-background">
            {/* Character Health Bar */}
            <div className="combat-health">
              <img src="/heart.png" alt="" />
              <div className="combat-health-bar">
                  <div className="combat-health-level" style={{ width: `${health}%` }}></div>
              </div>
              <span>{health}/100</span>
            </div>
            {/* Boss Health Bar */}
            <div className="boss-health">
              <span>{bossHealth}/100</span>
              <div className="boss-health-bar">
                  <div className="boss-health-level" style={{ width: `${bossHealth}%` }}></div>
              </div>
              <img src="/wolf-icon.png" alt="" />
            </div>
            {/* Character */}
            <div className="character" style={{ left: `${position}%`, backgroundImage: `url(${currentImage})` }}></div>
            {/* Boss */}
            {bossHealth > 0 &&(
              <div className="boss" style={{ left: `${bossPosition}%`, backgroundImage: `url(${currentBossImage})` }}></div>
            )}
            
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
            <span>Move Left <div className="keyboard-icon">A</div>/<div className="keyboard-icon">{"<"}-</div> Move Right <div className="keyboard-icon">D</div>/<div className="keyboard-icon">-{">"}</div></span>
            <span>Normal Attack <div className="keyboard-icon">7</div> Stick Attack <div className="keyboard-icon">8</div> Sword Attack <div className="keyboard-icon">9</div></span>
            <span>Open Magic State<div className="keyboard-icon">0</div>Magic Attack<div className="keyboard-icon">Mouse Click</div></span>
          </div>
        </>
      )}
    </div>
  );
}
export default ChallengeArea;


