import {
  ChangeEvent,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { Ball, GenInstances, Vec2_init } from "./Ball";
import { detectCollisions } from "./Collider";

import React, { useLayoutEffect } from "react";

function useWindowSize() {
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
  const [TotalBalls, setTotalBalls] = useState<number>(10);
  const [drawVectorCheck, setDrawVectorCheck] = useState<boolean>(false);
  // const [balls, setBalls] = useState<Ball[]>([]);
  const balls: Ball[] = [];
  const ref = useRef<HTMLCanvasElement>(null);

  const changeTotalBalls = (e: ChangeEvent<HTMLInputElement>) => {
    if (parseInt(e.target.value) > 10) return setTotalBalls(10);
    if (!Number.isNaN(parseInt(e.target.value)))
      setTotalBalls(parseInt(e.target.value));
  };
  const size = useWindowSize();
  useEffect(() => {
    if (ref.current) {
      ref.current.width = size[0];
      ref.current.height = size[1];
    }
    if (ref.current) {
      const total = GenInstances(TotalBalls);
      balls.push(...total);
    }
  }, [TotalBalls, size]);

  function poe(img: any, size: any) {
    var tempCanvas = document.createElement("canvas"),
      tCtx = tempCanvas.getContext("2d");

    tempCanvas.width = size * 2;
    tempCanvas.height = size * 2;

    if (tCtx)
      tCtx.drawImage(img, 0, 0, img.width, img.height, 0, 0, size, size);
  }
  // useEffect(() => {
  //   for (const ball of balls) {
  //   }
  // }, [drawVectorCheck]);
  useEffect(() => {
    let frameId: number;
    if (ref?.current) {
      const ctx = ref?.current?.getContext("2d");
      let image_loading = false;
      // if (ctx)

      const frame = (time: number) => {
        if (ctx && ref.current && balls.length > 0) {
          ctx.clearRect(0, 0, ref.current.width, ref.current.height);
          for (const ball of balls) {
            // if (drawVectorCheck) {
            //   ball.drawDirVector = true;
            // }
            let img = new Image();

            img.src = ball.image;
            // console.log(ball.image);
            // ctx.save();
            // var pattern = ctx.createPattern(image, "repeat");
            img.onload = function () {
              image_loading = true;
              // ctx.beginPath();
              // ctx.fill();
              // console.log("drawing");
            };

            //!try to draw th vector
            // if (ball.drawDirVector) {
            //   ctx.beginPath();
            //   ctx.moveTo(ball.x, ball.y);
            //   ctx.lineTo(
            // ball.x + ball.dx * Math.abs(ball.dx) * 5, // get 1, -1 direction
            // ball.y + ball.dy * Math.abs(ball.dy) * 5
            //   );
            //   ctx.strokeStyle = "red";
            //   ctx.stroke();
            //   // ctx.restore();
            //   // ctx.save();
            //   // ctx.closePath();
            // }
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            ctx.fill();
            // ctx.drawImage(img, ball.x - img.width / 2, ball.y - img.width / 2);
            ctx.save();
            ctx.clip();
            ctx.drawImage(
              img,
              ball.x - ball.radius,
              ball.y - ball.radius,
              ball.radius * 2,
              ball.radius * 2
            );
            // ctx.fill();
            ctx.closePath();
            ctx.restore();
            // ctx.globalCompositeOperation = "destination-in";
            // console.log(ball.area);
            // if (pattern) {
            //   ctx.strokeStyle = pattern;
            // }
            // ctx.fill();

            // ctx.stroke();
            // ctx.shadowColor = ball.color; !

            // poe(img, ball.x);
            // const pattern = ctx.createPattern(image, "repeat");
            // if (pattern) {
            // ctx.fillStyle = pattern;
            //! temporary canvas
            // }
            // ctx.save();
            // ctx.globalCompositeOperation = "source-in";
            // ctx.drawImage(image, 0, 0);
            // ctx.stroke();
            // ctx.restore();
            // ctx.fill();

            // ctx.lineDashOffset = 1;
            // if (ball.dashed) {
            //   ctx.setLineDash([1, 3]);
            // }
            if (ball.immunity && time > 500) ball.immunity = false;
            // ctx.shadowColor = ball.color;
            ctx.shadowBlur = ball.brightness;
            ctx.lineWidth = ball.brightness / 10;
            if (
              ball.dx < 1.5 &&
              ball.dx > -1.5 &&
              ball.dy < 1.5 &&
              ball.dy > -1.5
            ) {
              ball.dx *= 5;
              ball.dy *= 5;
              ball.accelerate = true;
            } else {
              ball.dx -= ball.dx * 0.01;
              ball.dy -= ball.dy * 0.01;
            }

            // } else ball.accelerate = false;

            ctx.setTransform(1, 0, 0, 1, 0, 0);

            // ctx.beginPath();
            // ctx.moveTo(ball.x, ball.y);
            // ctx.lineTo(ball.x + ball.dx * 10, ball.y + ball.dy * 10);
            // ctx.strokeStyle = "#ff00ff";
            // ctx.stroke();

            // ctx.restore();

            //*funtions
            doShine(ball);
            // burnFigure(ctx, ball);
            storePositionOnAcc(ball);
            tailText(ctx, ball);
            storeLastPosition(ball);
            detectCollisions(
              ref.current.width,
              ref.current.height,
              ball,
              balls
            );
            ball.x += ball.dx;
            ball.y += ball.dy;
          }
          frameId = requestAnimationFrame(frame);
        }
      };
      frameId = requestAnimationFrame(frame);
    }

    return () => cancelAnimationFrame(frameId);
  }, [balls, TotalBalls]);

  var motionTrailLength = 10;

  function tailText(ctx: CanvasRenderingContext2D, ball: Ball) {
    if (ball.texts[0].x) {
      if (ball.dx < 4 && ball.dx > -4 && ball.dy < 4 && ball.dx > -4) {
        // console.log("dissapear")
        console.log(ball.texts);
        ball.accelerate = false;
        for (const text of ball.texts) {
          text.x = 0;
          text.y = 0;
        }
        return;
      }
      // console.log(ball.texts, "<<");
      // console.log("gooo");
      // if (ball && ball.positions.length > 0)
      for (var i = 0; i < ball.texts.length; i++) {
        const text = ball.texts[i];
        ctx.beginPath();
        ctx.fillText("poe", ball.texts[i].x, ball.texts[i].y);
        //! to
        // console.log(ball.positionOnAcc, i);
        //ball.texts[i].dir * i + 1 * ball.inverseDir.y
        //(ball.texts[i].dir * i + 1) * ball.inverseDir.y
        let rand = 1;
        // rand *= Math.round(Math.random()) ? 1 : -1;

        text.x += text.dir.x * 2; //2 speed;
        text.y += text.dir.y * 2;

        // rand *= Math.round(Math.random()) ? 1 : -1;

        //   ball.texts[i].dir * Math.abs(ball.inverseDir.x) * 0.01;
        //   ball.texts[i].dir * Math.abs(ball.inverseDir.y) * 0.01;
        // console.log(text.dir, i);
        ctx.font = "serif";
        ctx.fillStyle = "rgba(255, 255, 255, " + text.alpha + ")";
        text.alpha -= 0.025;
        ctx.save();
        ctx.closePath();
      }
    }
  }

  function burnFigure(ctx: CanvasRenderingContext2D, ball: Ball) {
    if (ball.accelerate) {
      if (ball.dx < 4 && ball.dx > -4 && ball.dy < 4 && ball.dx > -4) {
        ball.accelerate = false;
        return;
      }
      for (var i = 0; i < ball.positions.length; i++) {
        //do draw
        var ratio = (i + 1) / ball.positions.length;
        ctx.beginPath();
        ctx.arc(
          ball.positions[i].x,
          ball.positions[i].y,
          (ball.radius * (i + 1)) / 7.5,
          0,
          2 * Math.PI,
          true
        );
        ctx.fillStyle = `${ball.color}${Math.floor(ratio)}9`;
        ctx.fill();
      }
    }
  }

  function storePositionOnAcc(ball: Ball) {
    if (ball.accelerate) {
      for (const text of ball.texts) {
        text.x = ball.x;
        text.y = ball.y;
        text.alpha = 1;
        let dx = Math.random() * 2;
        let dy = Math.random() * 2;
        dx *= Math.round(Math.random()) ? 1 : -1;
        dy *= Math.round(Math.random()) ? 1 : -1;
        text.dir.x = dx;
        text.dir.y = dy;
      }
      ball.inverseDir = { x: ball.dx * -1, y: ball.dy * -1 }; //!

      ball.accelerate = false;
      // if (ball.index === 1) console.log(ball.positionOnAcc);
    }
  }

  function storeLastPosition(ball: Ball) {
    // push an item
    ball.positions.push({
      x: ball.x,
      y: ball.y,
    }); //get rid of first item
    if (ball.positions.length > motionTrailLength) {
      ball.positions.shift();
    }
  }

  function doShine(ball: Ball) {
    if (ball.shine) {
      const fn = -1 * ball.util_count ** 2 + 10 * ball.util_count + 5;

      ball.brightness = fn;
      ball.util_count += 0.1;
    }
  }
  return (
    <>
      <main className="main">
        <section>
          <div className="inputDiv">
            <input
              type="number"
              className="input"
              value={TotalBalls}
              onChange={changeTotalBalls}
              max={100}
              min={1}
            />
            <span>max: 10</span>
            <span>max: 1</span>
            <span>current: {TotalBalls}</span>
            {/* <input //todo:
              type="checkbox"
              className="checkbox"
              checked={drawVectorCheck}
              onChange={() => setDrawVectorCheck(!drawVectorCheck)}
            /> */}
          </div>
          <canvas ref={ref} id="objects"></canvas>
        </section>
      </main>
    </>
  );
}

export default App;
