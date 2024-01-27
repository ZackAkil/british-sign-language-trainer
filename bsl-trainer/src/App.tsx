import { useEffect, useRef, useState } from "react";
import "./App.css";
import Trainer from "./trainer/main";
import VideoCanvasOverlay from "./components/HandTracker";

function App() {
  // const game: Trainer = new Trainer();
  const [currentTime, setCurrentTime] = useState(0);

  const [currentChar, setCurrentChar] = useState("");

  const [userCurrentChar, setUserCurrentChar] = useState("");

  const [remainingChars, setRemainingChars] = useState([""]);

  const gameRef = useRef<Trainer | null>(null);

  useEffect(() => {
    console.log("hello again");

    if (!gameRef.current) {
      gameRef.current = new Trainer(
        setCurrentTime,
        setCurrentChar,
        setRemainingChars
      );
    }
  }, []); // Empty dependency array runs the effect only once

  return (
    <>
      <h1>BSL Trainer</h1>

      <div className="card">
        <button
          onClick={() => {
            gameRef.current && gameRef.current.startGame();
          }}
        >
          Start
        </button>

        <button
          onClick={() => {
            gameRef.current && gameRef.current.endGame();
          }}
        >
          Stop
        </button>

        <button
          onClick={() => {
            gameRef.current && gameRef.current.resetGame();
          }}
        >
          Reset
        </button>

        <h2>{currentTime}</h2>
        <h1>{currentChar}</h1>

        <br></br>

        <input
          type="text"
          value={userCurrentChar}
          onChange={(e) => {
            gameRef.current?.checkChar(e.target.value);
            setUserCurrentChar(e.target.value);
          }}
        />
        <br></br>
        <i>{userCurrentChar}</i>
        <br></br>
        <p>{remainingChars}</p>
      </div>

      <VideoCanvasOverlay></VideoCanvasOverlay>
      {/* <Demo></Demo> */}
    </>
  );
}

export default App;
