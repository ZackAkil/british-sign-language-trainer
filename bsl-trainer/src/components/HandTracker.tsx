import React, { useRef, useEffect, useState } from "react";
import {
  DrawingUtils,
  FilesetResolver,
  HandLandmarker,
} from "@mediapipe/tasks-vision";

interface VideoCanvasOverlayProps {}

const VideoCanvasOverlay: React.FC<VideoCanvasOverlayProps> = ({}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [rightHand, setRightHand] = useState(Number);
  const [leftHand, setLeftHand] = useState(Number);

  useEffect(() => {
    let handLandmarker: HandLandmarker;

    // Before we can use HandLandmarker class we must wait for it to finish
    // loading. Machine Learning models can be large and take a moment to
    // get everything needed to run.
    const createHandLandmarker = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
      );
      handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numHands: 2,
      });
      console.log("created handland marker");
      // demosSection.classList.remove("invisible");
    };
    createHandLandmarker();

    //     let lastVideoTime = -1;
    //     let results = undefined;
    async function predictWebcam() {
      const canvasElement = canvasRef.current;
      const video = videoRef.current;
      const canvasCtx = canvasElement?.getContext("2d");

      console.log("attempting predicting");

      if (canvasElement && video && canvasCtx) {
        console.log("predicting");

        canvasElement.style.width = video.videoWidth.toString();
        canvasElement.style.height = video.videoHeight.toString();
        canvasElement.width = video.videoWidth;
        canvasElement.height = video.videoHeight;

        canvasCtx.drawImage(video, 0, 0);
      }

      let startTimeMs = performance.now();
      if (handLandmarker && video) {
        const results = handLandmarker.detectForVideo(video, startTimeMs);
        console.log(results);

        if (canvasCtx) {
          const drawingUtils = new DrawingUtils(canvasCtx);

          if (results.landmarks) {
            let [leftPresent, rightPresent] = [false, false];

            for (const hands of results.handedness) {
              console.log("hands", hands);
              if (hands[0].displayName == "Right") {
                setLeftHand(hands[0].score);
                rightPresent = true;
              } else if (hands[0].displayName == "Left") {
                setRightHand(hands[0].score);
                leftPresent = true;
              }
            }

            if (!rightPresent) setLeftHand(0);
            if (!leftPresent) setRightHand(0);

            for (const landmarks of results.landmarks) {
              console.log("landmarks", landmarks);

              drawingUtils.drawConnectors(
                landmarks,
                HandLandmarker.HAND_CONNECTIONS,
                {
                  color: "#00FF00",
                  lineWidth: 5,
                }
              );
              drawingUtils.drawLandmarks(landmarks, {
                color: "#FF0000",
                lineWidth: 2,
              });
            }
          }
        }
      }
      //       //   // Now let's start detecting the stream.
      //       //   if (runningMode === "IMAGE") {
      //       //     runningMode = "VIDEO";
      //       //     await handLandmarker.setOptions({ runningMode: "VIDEO" });
      //       //   }
      //       let startTimeMs = performance.now();
      //       if (lastVideoTime !== video.currentTime) {
      //         lastVideoTime = video.currentTime;
      //         results = handLandmarker.detectForVideo(video, startTimeMs);
      //       }
      //       canvasCtx.save();
      //       canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      //       if (results.landmarks) {
      //         for (const landmarks of results.landmarks) {
      //           console.log(landmarks);
      //           //   drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
      //           //     color: "#00FF00",
      //           //     lineWidth: 5,
      //           //   });
      //           //   drawLandmarks(canvasCtx, landmarks, {
      //           //     color: "#FF0000",
      //           //     lineWidth: 2,
      //           //   });
      //         }
      //       }
      //       canvasCtx.restore();
      //       // Call this function again to keep predicting when the browser is ready.
      //       //   if (webcamRunning === true) {
      window.requestAnimationFrame(predictWebcam);
      //       //   }
    }
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    // const hasGetUserMedia = () => !!navigator.mediaDevices?.getUserMedia;
    const constraints = {
      video: true,
    };
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      video.srcObject = stream;
      video.addEventListener("loadeddata", predictWebcam);
    });
    //     const context = canvas.getContext("2d");
    //     video.addEventListener("canplay", () => {
    //       const width = video.videoWidth;
    //       const height = video.videoHeight;
    //       canvas.width = width;
    //       canvas.height = height;
    //       const drawFrame = () => {
    //         context?.drawImage(video, 0, 0, width, height);
    //         requestAnimationFrame(drawFrame);
    //       };
    //       drawFrame();
    //     });
  }, [videoRef, canvasRef]);

  return (
    <div>
      <p>hand tracker</p>
      <div>right hand: {rightHand}</div>
      <div>left hand: {leftHand}</div>
      <video
        style={{ width: "100%", display: "none" }}
        ref={videoRef}
        autoPlay
        playsInline
      />
      <canvas
        ref={canvasRef}
        style={{ border: "5px red solid", width: "100%" }}
      />
    </div>
  );
};

export default VideoCanvasOverlay;
