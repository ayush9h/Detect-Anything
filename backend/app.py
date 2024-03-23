from flask import Flask, request, jsonify, send_file
from flask_cors import CORS, cross_origin
from io import BytesIO
import cv2
import numpy as np

app = Flask(__name__)
CORS(app)

# Load YOLOv3 model and class names
net = cv2.dnn.readNet("yolov3.weights", "yolov3.cfg")
with open("coco.names", "r") as f:
    LABELS = [line.strip() for line in f.readlines()]

number_of_objects = 0
unique_classes = set()

# Function to perform object detection on an image
def detect_objects(image):
    (H, W) = image.shape[:2]

    blob = cv2.dnn.blobFromImage(image, 1 / 255.0, (416, 416), swapRB=True, crop=False)
    net.setInput(blob)
    layerOutputs = net.forward(net.getUnconnectedOutLayersNames())

    boxes = []
    confidences = []
    classIDs = []
    global number_of_objects
    for output in layerOutputs:
        for detection in output:
            scores = detection[5:]
            classID = np.argmax(scores)
            confidence = scores[classID]
            if confidence > 0.5:  # Filter out weak detections
                box = detection[0:4] * np.array([W, H, W, H])
                (centerX, centerY, width, height) = box.astype("int")
                x = int(centerX - (width / 2))
                y = int(centerY - (height / 2))
                boxes.append([x, y, int(width), int(height)])
                confidences.append(float(confidence))
                classIDs.append(classID)
                unique_classes.add(LABELS[classID])

    idxs = cv2.dnn.NMSBoxes(boxes, confidences, 0.5, 0.3)
    if len(idxs) > 0:
        for i in idxs.flatten():
            (x, y) = (boxes[i][0], boxes[i][1])
            (w, h) = (boxes[i][2], boxes[i][3])
            color = [int(c) for c in np.random.randint(0, 255, size=(3,))]
            cv2.rectangle(image, (x, y), (x + w, y + h), color, 2)
            text = "{}: {:.4f}".format(LABELS[classIDs[i]], confidences[i])
            cv2.putText(image, text, (x, y - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

    number_of_objects = len(idxs)
    return image

@app.route('/upload', methods=['POST'])
@cross_origin()
def upload_file():
    global unique_classes
    unique_classes = set()
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    img = cv2.imdecode(np.fromstring(file.read(), np.uint8), cv2.IMREAD_COLOR)
    if img is None:
        return jsonify({'error': 'Failed to read image'}), 400

    annotated_img = detect_objects(img)

    retval, buffer = cv2.imencode('.jpg', annotated_img) 
    if not retval:
        return jsonify({'error': 'Failed to encode image'}), 500

    output = BytesIO(buffer)
    return send_file(output, mimetype='image/jpeg')


@app.route('/numberOfObjects', methods=['POST'])
@cross_origin()
def get_number_of_objects():
    return jsonify({'numberOfObjects': number_of_objects, 'uniqueClasses': list(unique_classes)})

if __name__ == '__main__':
    app.run(debug=True)
