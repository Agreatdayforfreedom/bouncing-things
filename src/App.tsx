import {
  ChangeEvent,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { Ball, GenInstances, Vec2_init } from "./Ball";
import { detectCollisions } from "./Collider";

import React, { useLayoutEffect } from "react";
import { g } from "./constants";
import MainProvider from "./context/MainProvider";
import Content from "./components/Content";
import Canvas from "./components/Canvas";

export function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      // ref.current.widg
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
}
function App() {
  const [hiddenContent, setHiddenContent] = useState(false);

  return (
    <>
      <MainProvider>
        <main className="main">
          {!hiddenContent && <Content hidden={hiddenContent} />}
          <button
            className="hidden-content-btn"
            onClick={() => setHiddenContent(!hiddenContent)}
          >
            hide
          </button>
          <Canvas />
        </main>
      </MainProvider>
    </>
  );
}

export default App;
