MoodTune AI - Required face-api.js Model Files
================================================

This folder must contain the face-api.js model weight files before the
camera / facial-expression detection will work. These are binary files
and are NOT included in this project download — you need to fetch them
once, for free, from the official face-api.js GitHub repository.

WHY: face-api.js needs pre-trained neural network weights to detect
faces and recognize expressions. They are downloaded once and then run
entirely in your browser (nothing is uploaded anywhere).

STEP-BY-STEP
------------

1. Open this URL in your browser (the official model repository):
   https://github.com/justadudewhohacks/face-api.js/tree/master/weights

2. Download the following files (click each file, then "Download raw
   file", or download the whole "weights" folder as a ZIP and pull
   these files out):

   - tiny_face_detector_model-weights_manifest.json
   - tiny_face_detector_model-shard1
   - face_expression_model-weights_manifest.json
   - face_expression_model-shard1

3. Place all four files directly inside this folder:

   frontend/public/models/
   ├── tiny_face_detector_model-weights_manifest.json
   ├── tiny_face_detector_model-shard1
   ├── face_expression_model-weights_manifest.json
   └── face_expression_model-shard1

4. That's it. When you run the frontend (npm run dev), the Camera
   component loads these from /models automatically.

ALTERNATIVE (command line, if you have internet access and curl):

   cd frontend/public/models
   curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-weights_manifest.json
   curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-shard1
   curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_expression_model-weights_manifest.json
   curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_expression_model-shard1

If these files are missing, the app will show:
"Could not load the AI models..." — but the Manual Mood Selection,
Language, Genre, and YouTube search features will still work fine
without the camera.
