import "../App.css";
import "../styles/Home.css";
function Home() {
  return (
    <>
      {/* Home Title Card */}
      <div className='home-container'>
        <div className='max-width'>
          <div className='home-title'>Detect Objects with OpenCV</div>
          <div className='home-desc'>
            Detect multiple objects in complex images with ease. <br />
            Powered by OpenCV, React and Flask. Accessible. Open Source.
          </div>
          <div>
            <button className='check-button'>
              <a href='#try'>Try it Out</a>
            </button>
          </div>
        </div>
      </div>

      {/* Example Container */}
      <div className='examples-container' id='usage'>
        <div className='max-width'>
          <h1>Example Usage:</h1>
          <div className='example-image-container'>
            <div className='example-image'></div>
            <div className='example-result'>
              <h1>How it Works: </h1>
              <p>
                Object detection works by analyzing an image to identify and
                locate objects within it, often by using deep learning models
                that classify and localize objects based on patterns and
                features within the image. These models typically output
                bounding boxes around detected objects along with their
                corresponding class labels.
              </p>
              <h1> Results: </h1>
              <p>
                As we can see from the example, various objects have been
                detected in the image including the traffic lights and
                pedestrian. Each identified object has been annotated to a
                specific class. <br />
              </p>
              <h1>Conclusion: </h1>
              <p>
                This technique can be widely used in applications that do video
                surveillance, real-time traffic management, predicting traffic
                density, and counting the number of people in real time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
