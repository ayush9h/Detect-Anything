import "../App.css";
import "../styles/Image.css";
import React, { useState, useRef } from "react";

function Image() {
  const [file, setFile] = useState();
  const [loading, setLoading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [resultImage, setResultImage] = useState(null);
  const [numberOfObjects, setNumberOfObjects] = useState(0);
  const [uniqueClasses, setUniqueClasses] = useState([]);
  const fileInputRef = useRef();

  function handleUpload(e) {
    setUploadMessage("");
    const uploadedFile = e.target.files[0];
    setFile(URL.createObjectURL(uploadedFile));

    const formData = new FormData();
    formData.append("file", uploadedFile);

    setLoading(true);
    fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          return response.blob();
        } else {
          throw new Error("Upload failed. Please try again.");
        }
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        setResultImage(url);
        setUploadMessage(
          "Image Uploaded successfully! See the detailed picture below."
        );
        // Request the number of objects detected and unique classes
        fetch("http://localhost:5000/numberOfObjects", {
          method: "POST",
        })
          .then((response) => response.json())
          .then((data) => {
            setNumberOfObjects(data.numberOfObjects);
            setUniqueClasses(data.uniqueClasses);
          })
          .catch((error) => {
            console.error("Error fetching number of objects:", error);
          });
      })
      .catch((error) => {
        setUploadMessage(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function handleClick() {
    fileInputRef.current.click();
  }
  return (
    <>
      <div className='usage-window' id='try'>
        <div className='max-width'>
          <h1>Try it Out</h1>
          <p>
            Try uploading an image to see the magic of object detection in
            action.
          </p>
          <div className='upload-result-grid'>
            <div className='upload-window'>
              <div className='upload-section'>
                <form>
                  <div>
                    <input
                      type='file'
                      className='myFile'
                      name='filename'
                      onChange={handleUpload}
                      ref={fileInputRef}
                      style={{ display: "none" }}></input>
                    <button type='button' onClick={handleClick}>
                      Select an Image File
                    </button>
                    <p>Upload an image in (.jpeg, .jpg, .png) format.</p>
                  </div>
                  {loading && <p>Uploading...</p>}
                  {uploadMessage && (
                    <p
                      style={{
                        color: "#66FF00",
                        fontSize: "1.5rem",
                      }}>
                      {uploadMessage}
                    </p>
                  )}
                </form>
              </div>
            </div>

            <div className='result-window'>
              {resultImage ? (
                <div>
                  <img
                    src={resultImage}
                    alt='Grayscale'
                    className='result-image'
                  />
                </div>
              ) : (
                <h1>Your Output appears here.</h1>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className='analysis-container'>
        <div className='max-width'>
          <h1>Analysis of the image uploaded: </h1>
          {numberOfObjects > 0 && (
            <p>
              1. Total Number of objects detected in the image:{" "}
              {numberOfObjects}
            </p>
          )}
          {uniqueClasses.length > 0 && (
            <p>
              2. Unique Classes detected in the image:{" "}
              {uniqueClasses.join(", ")}
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default Image;
