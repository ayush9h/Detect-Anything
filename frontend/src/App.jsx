import React, { useState, useRef } from "react";
import "./App.css";
import Home from "./components/Home";
import Image from "./components/Image";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
function App() {
  return (
    <>
      <Navbar />
      <Home />
      <Image />
      <Footer />
    </>
  );
}

export default App;
