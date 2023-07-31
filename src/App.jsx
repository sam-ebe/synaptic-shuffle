import { useState } from "react";
import { fetchedImages, backCardUrl } from "./data/data";
import "./App.css";
// current issue : if clicked a bad match : the image dont reset to backcard
// add Timeout
function MemoryGame() {
  return (
    <>
      <h1>Synaptic Shuffle</h1>
      <button>Restart</button>
      <p>Score</p>
      <Board fetchedImages={fetchedImages} />
    </>
  );
}

export default MemoryGame;

function Board({ fetchedImages }) {
  const [images, setImages] = useState(shuffledImages(fetchedImages));
  const [firstClickedCardIndex, setfirstClickedCardIndex] = useState(null);
  const handleCardClick = (index) => {
    console.log(images);
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

      console.log(pairId1);
      console.log(pairId2);
      console.log("1 image clicked");

      if (images[firstClickedCardIndex].id === images[index].id) {
        // keep visible => isRevealed: true
        setfirstClickedCardIndex(null);
        console.log("pair");
      } else {
        // hide => isRevealed: false for both cards firstClickedCardIndex and index

        setTimeout(() => {
          console.log("hi");
          setfirstClickedCardIndex(null);
          const updatedImages = images.map((image, id) => {
            return id === firstClickedCardIndex || id === index
              ? { ...image, isRevealed: false }
              : image;
          });

          setImages(updatedImages);
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
 * - Fast click : disable click on other cards
 * - Turn card animation */
