import { useEffect, useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';

const MODEL_URL = '/models';
const DETECTION_INTERVAL_MS = 1000;

// Maps face-api.js expression keys to the labels/emojis used across the app.
const EXPRESSION_META = {
  happy: { label: 'Happy', emoji: '😊' },
  sad: { label: 'Sad', emoji: '😢' },
  angry: { label: 'Angry', emoji: '😡' },
  neutral: { label: 'Neutral', emoji: '😐' },
  surprised: { label: 'Surprised', emoji: '😲' },
  fearful: { label: 'Fearful', emoji: '😨' },
  disgusted: { label: 'Disgusted', emoji: '🤢' }
};

export default function Camera({ onExpressionDetected, disabled }) {
  const webcamRef = useRef(null);
  const intervalRef = useRef(null);

  const [modelsLoading, setModelsLoading] = useState(true);
  const [modelsError, setModelsError] = useState('');
  const [cameraError, setCameraError] = useState('');
  const [cameraReady, setCameraReady] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);

  // Load face-api.js models once, from the local /public/models folder.
  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
        ]);
        setModelsLoading(false);
      } catch (err) {
        console.error('Failed to load face-api.js models:', err);
        setModelsError(
          'Could not load the AI models. Make sure the model files are present in frontend/public/models (see README).'
        );
        setModelsLoading(false);
      }
    };
    loadModels();
  }, []);

  const detectExpression = useCallback(async () => {
    const video = webcamRef.current?.video;
    if (!video || video.readyState !== 4) return;

    try {
      const detection = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (!detection) {
        setFaceDetected(false);
        return;
      }

      setFaceDetected(true);

      // Find the expression with the highest confidence score
      const expressions = detection.expressions;
      const [topExpression, confidence] = Object.entries(expressions).reduce(
        (best, entry) => (entry[1] > best[1] ? entry : best),
        ['neutral', 0]
      );

      const meta = EXPRESSION_META[topExpression] || EXPRESSION_META.neutral;
      onExpressionDetected({
        key: topExpression,
        label: meta.label,
        emoji: meta.emoji,
        confidence: Math.round(confidence * 100)
      });
    } catch (err) {
      // Detection can occasionally fail on a single frame - not fatal, just skip it
      console.warn('Face detection frame error:', err);
    }
  }, [onExpressionDetected]);

  // Run detection on a fixed interval once models + camera are ready
  useEffect(() => {
    if (modelsLoading || modelsError || cameraError || !cameraReady || disabled) return;

    intervalRef.current = setInterval(detectExpression, DETECTION_INTERVAL_MS);
    return () => clearInterval(intervalRef.current);
  }, [modelsLoading, modelsError, cameraError, cameraReady, disabled, detectExpression]);

  const handleUserMediaError = () => {
    setCameraError('Camera access is required for facial-expression detection. Please allow camera permission in your browser settings.');
  };

  return (
    <div className="camera-panel">
      <div className="camera-frame">
        {!modelsLoading && !modelsError && !cameraError && (
          <Webcam
            ref={webcamRef}
            audio={false}
            mirrored
            onUserMedia={() => setCameraReady(true)}
            onUserMediaError={handleUserMediaError}
            videoConstraints={{ width: 480, height: 360, facingMode: 'user' }}
            className="camera-video"
          />
        )}

        {modelsLoading && (
          <div className="camera-overlay">
            <div className="spinner" />
            <p>Loading AI models...</p>
          </div>
        )}

        {modelsError && (
          <div className="camera-overlay camera-overlay-error">
            <p>⚠️ {modelsError}</p>
          </div>
        )}

        {cameraError && (
          <div className="camera-overlay camera-overlay-error">
            <p>🚫 {cameraError}</p>
          </div>
        )}

        {!modelsLoading && !modelsError && !cameraError && cameraReady && !faceDetected && (
          <div className="camera-hint">No face detected. Please position your face inside the camera.</div>
        )}
      </div>
      <p className="camera-privacy-note">
        🔒 Your camera feed is processed entirely in your browser. Nothing is uploaded or stored.
      </p>
    </div>
  );
}
