import { useEffect, useState } from "react";
import { fetchedImages, backCardUrl } from "./data/data";
import "./App.css";

function MemoryGame() {
  const [score, setScore] = useState(0);
  const [reset, setReset] = useState(false);
  const handleScore = () => {
    setScore(score + 1);
  };
  const handleReset = () => {
    setReset(!reset);
    setScore(0);
  };
  return (
    <>
      <h1>Synaptic Shuffle</h1>
      <button onClick={handleReset}>Restart</button>
      <p>Pairs found: {score}</p>
      <Board
        fetchedImages={fetchedImages}
        handleScore={handleScore}
        reset={reset}
        handleReset={handleReset}
      />
    </>
  );
}
export default MemoryGame;

function Board({ fetchedImages, handleScore, reset, handleReset }) {
  const [images, setImages] = useState(shuffledImages(fetchedImages));
  const [firstClickedCardIndex, setfirstClickedCardIndex] = useState(null);
  const [isTwoCardsRevealed, setIsTwoCardsRevealed] = useState(false);

  useEffect(() => {
    console.log("board rerendered");
    if (reset) {
      resetBoard();
      handleReset(false);
    }
  });

  const resetBoard = () => {
    setImages(shuffledImages(fetchedImages));
    setfirstClickedCardIndex(null);
    setIsTwoCardsRevealed(false);
    handleScore(0); // Reset the score to zero in the `MemoryGame` component
  };

  const handleCardClick = (index) => {
    if (isTwoCardsRevealed) {
      // Two cards are already revealed, don't process any further clicks
      return;
    }
    // if the clicked image has already been revealed
    if (images[index].isRevealed === true) {
      // The card is already revealed, get another valid click
      return;
    }

    const updatedImages = images.map((image, id) => {
      return id === index ? { ...image, isRevealed: true } : image;
    });
    setImages(updatedImages);

    if (firstClickedCardIndex === null) {
      // first card clicked
      setfirstClickedCardIndex(index);
      setImages(updatedImages);
    } else {
      let pairId1 = images[firstClickedCardIndex].id;
      let pairId2 = images[index].id;

      if (pairId1 === pairId2) {
        // keep visible => isRevealed: true
        setfirstClickedCardIndex(null);
        setIsTwoCardsRevealed(false);
        handleScore();
      } else {
        // hide => isRevealed: false for both cards firstClickedCardIndex and index
        setIsTwoCardsRevealed(true); // Set the flag to disable further clicks

        setTimeout(() => {
          setfirstClickedCardIndex(null);
          const updatedImages = images.map((image, id) => {
            return id === firstClickedCardIndex || id === index
              ? { ...image, isRevealed: false }
              : image;
          });

          setImages(updatedImages);
          setIsTwoCardsRevealed(false); // Reset the flag after hiding the unmatched cards
        }, 500);
      }
    }
  };

  return (
    <div className="board">
      {images.map((image, index) => (
        <Card
          image={image}
          key={index}
          index={index}
          onClick={handleCardClick}
        />
      ))}
    </div>
  );
}

function Card({ image, onClick, index }) {
  return (
    <div className="card">
      <img
        onClick={() => onClick(index)}
        src={image.isRevealed ? image.url : backCardUrl}
        alt=""
      />
    </div>
  );
}

function shuffledImages(images) {
  // append copies of each images
  let imagesArray = [...images, ...images];
  // add isRevealed property
  imagesArray = imagesArray.map((image) => {
    return { ...image, isRevealed: false };
  });
  return shuffle(imagesArray);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/* TODO :
 * - Turn card animation */
