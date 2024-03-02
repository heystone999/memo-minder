import React, { useState, useEffect, useRef } from "react";
import "./ChallengeArea.css";

const defaultProducts = [
  { id: 'stick', name: 'Stick', price: 15, imgSrc: '/stick.png', soldSrc: '/stick.png' },
  { id: 'sword', name: 'Sword', price: 30, imgSrc: '/sword.png', soldSrc: '/sword.png' },
  { id: 'magicBook', name: 'MagicBook', price: 40, imgSrc: '/book.png', soldSrc: '/book.png' },
];

const imagesRight = ['char_right1.png', 'char_right2.png', 'char_right3.png'];
const imagesLeft = ['char_left1.png', 'char_left2.png', 'char_left3.png'];
const AttackRight = ['rightAtk1.png', 'rightAtk2.png', 'rightAtk3.png', 'rightAtk4.png','rightAtk6.png', 'rightAtk7.png', 'rightAtk8.png'];
const AttackLeft = ['leftAtk1.png', 'leftAtk2.png', 'leftAtk3.png','leftAtk4.png','leftAtk6.png', 'leftAtk7.png','leftAtk8.png'];
const swordAttackRight = ['rightSword1.png', 'rightSword2.png', 'rightSword3.png'];
const swordAttackLeft = ['leftSword1.png', 'leftSword2.png', 'leftSword3.png'];

// Preload every pic
[...imagesRight, ...imagesLeft, ...swordAttackRight, ...swordAttackLeft, ...AttackRight, ...AttackLeft ].forEach(image => {
  const img = new Image();
  img.src = image;
});

function ChallengeArea(products = defaultProducts) {
    const [position, setPosition] = useState(5); // Initial state
    const [currentImage, setCurrentImage] = useState('char_right1.png'); // Initial pic
    const [direction, setDirection] = useState('right'); // Track the direction
    const imageIndex = useRef(0); // Use useRef to persist imageIndex across renders

    useEffect(() => {
        let attackAnimationInterval;

        const updateImageForDirection = (dir) => {
            const images = dir === 'right' ? imagesRight : imagesLeft;
            setCurrentImage(images[imageIndex.current % images.length]);
            imageIndex.current++;
        };

        const handleKeyDown = (event) => {
          if (event.key === "8") {
              if (!attackAnimationInterval) {
                  imageIndex.current = 0; // 重置imageIndex为0，确保从攻击动画的第一帧开始
                  attackAnimationInterval = setInterval(() => {
                      const attackImages = direction === 'right' ? swordAttackRight : swordAttackLeft;
                      setCurrentImage(attackImages[imageIndex.current % attackImages.length]);
                      imageIndex.current++;
                  }, 200);
              }
          } else if (event.key === "7") {
            if (!attackAnimationInterval) {
                imageIndex.current = 0; // 同样重置imageIndex为0
                attackAnimationInterval = setInterval(() => {
                    const attackImages = direction === 'right' ? AttackRight : AttackLeft;
                    setCurrentImage(attackImages[imageIndex.current % attackImages.length]);
                    imageIndex.current++;
                }, 200);
            }
          } else if (event.key.toLowerCase() === "a" || event.key === "ArrowLeft") {
              setPosition(prevPosition => Math.max(prevPosition - 1.8, 0));
              setDirection('left');
              if (!attackAnimationInterval) { // 确保在非攻击状态下才更新行走动画
                  updateImageForDirection('left');
              }
          } else if (event.key.toLowerCase() === "d" || event.key === "ArrowRight") {
              setPosition(prevPosition => Math.min(prevPosition + 1.8, 100));
              setDirection('right');
              if (!attackAnimationInterval) { // 同上
                  updateImageForDirection('right');
              }
          }
        };
      

        const handleKeyUp = (event) => {
          if ((event.key === "7" || event.key === "8") && attackAnimationInterval) {
              clearInterval(attackAnimationInterval);
              attackAnimationInterval = null;
      
              // 选择一个与攻击动画最后一帧视觉上更接近的行走动画帧作为过渡
              const transitionImage = direction === 'right' ? imagesRight[0] : imagesLeft[0];
              setCurrentImage(transitionImage);
      
              // 可选：如果希望在动画结束后有一个更平滑的过渡，可以在这里设置一个延时，然后再重置imageIndex.current为0
              setTimeout(() => {
                  imageIndex.current = 0; // Reset index for walking animation after a short delay
              }, 200); // 200ms后重置，这个时间可以根据需要调整
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
    }, [direction]); // Add direction to useEffect dependencies

    return (
        <div className="challenge-page">
            <div className="combat-background">
                <div className="character" style={{ left: `${position}%`, backgroundImage: `url(${currentImage})` }}></div>
            </div>
            <div className="explain-text">
              <span>Move Left <div className="keyboard-icon">A</div>/<div className="keyboard-icon">{"<"}-</div>Move Right<div className="keyboard-icon">W</div>/<div className="keyboard-icon">-{">"}</div></span>
              <span>Normal Attack <div className="keyboard-icon">7</div>Sword Attack<div className="keyboard-icon">8</div></span>
            </div>
        </div>
    );
}

export default ChallengeArea;
