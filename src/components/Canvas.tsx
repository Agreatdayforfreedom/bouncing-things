import React from "react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useWindowSize } from "../App";
import { Ball, GenInstances } from "../Ball";
import { detectCollisions } from "../Collider";
import { g } from "../constants";

const Canvas = () => {
  const [TotalBalls, setTotalBalls] = useState<number>(10);
  const [drawVectorCheck, setDrawVectorCheck] = useState<boolean>(false);
  let totalClicked = 0;
  // const [balls, setBalls] = useState<Ball[]>([]);
  const balls: Ball[] = [];
  const ref = useRef<HTMLCanvasElement>(null);
  const refFps = useRef<HTMLSpanElement>(null);
  const drawVectorRef = useRef<HTMLInputElement>(null);
  const totalBallsRef = useRef<HTMLInputElement>(null);
  const gravityRef = useRef<HTMLInputElement>(null);
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

      const total = GenInstances(TotalBalls);
      balls.push(...total);
    }
  }, [TotalBalls, size]);
  var mousePosition = { x: 0, y: 0 };
  var p = "xd";
  const [mouseCoords, setMouseCoords] = useState({} as any);
  const [clickPressed, setClickPressed] = useState(false);

  useEffect(() => {
    let frameId: number;
    let perSecond: number = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mousePosition = { x: event.clientX, y: event.clientY };
    };

    const handleClick = (event: MouseEvent, ball: Ball) => {
      // console.log(event, { x: ball.x, y: ball.y });
      // console.log(event);
      if (
        event.clientX <= ball.x + ball.radius &&
        event.clientX >= ball.x - ball.radius &&
        event.clientY <= ball.y + ball.radius &&
        event.y >= ball.y - ball.radius
      ) {
        // console.log("click");
        ball.clicked = true;
      }
    };

    if (ref?.current) {
      ref.current.addEventListener("click", (evt: MouseEvent) => {
        if (totalClicked < 1) {
          balls.forEach((ball: Ball) => {
            if (
              evt.clientX <= ball.x + ball.radius &&
              evt.clientX >= ball.x - ball.radius &&
              evt.clientY <= ball.y + ball.radius &&
              evt.y >= ball.y - ball.radius
            ) {
              // console.log("click");
              ball.clicked = true;
              totalClicked = 1;
            }
          });
        } else
          balls.forEach((ball: Ball) => {
            if (ball.clicked) {
              ball.clicked = false;
              totalClicked = 0;
            }
          });
      });

      const ctx = ref?.current?.getContext("2d");

      let image_loading = false;
      // if (ctx)
      var lastCalledTime: number;

      const frame = (time: number) => {
        if (!lastCalledTime) {
          lastCalledTime = performance.now();
          // fps = 0;
        }
        var delta = (performance.now() - lastCalledTime) / 1000;
        lastCalledTime = performance.now();

        if (!perSecond || time - perSecond >= 1000) {
          perSecond = time;
          if (refFps?.current) {
            let fps = 1 / delta;
            if (
              refFps.current.textContent &&
              fps.toString().substring(0, 2) !== refFps.current.textContent
            )
              refFps.current.textContent =
                "FPS: " + fps.toString().substring(0, 2);
          }
        }

        //canvas
        if (ctx && ref.current && balls.length > 0) {
          // const mousecoords = ref.current.getBoundingClientRect();

          ctx.clearRect(0, 0, ref.current.width, ref.current.height);
          // console.log(mousecoords.x, mousecoords.y);
          window.addEventListener("mousemove", handleMouseMove, false);

          for (const ball of balls) {
            let img = new Image();

            img.src = ball.image; //!todo

            img.onload = function () {
              image_loading = true;
            };

            //!try to draw th vector
            // if (ball.drawDirVector) {

            // }
            ctx.save();
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            ctx.closePath();

            // ctx.rotate((20 * Math.PI) / 180);
            if (ball.image.length > 0) {
              ctx.fill();
              ctx.clip();
              ctx.drawImage(
                img,
                ball.x - ball.radius,
                ball.y - ball.radius,
                ball.radius * 2,
                ball.radius * 2
              );
            } else {
              ctx.fillStyle = ball.color;
              ctx.fill();
            }
            // ctx.drawImage(image, -width / 2, -height / 2, width, height);
            // ctx.rotate(-angleInRadians);
            // ctx.translate(-ball.x, -ball.y);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.restore();

            if (ball.immunity && time > 500) ball.immunity = false;
            // ctx.shadowColor = ball.color;
            ctx.shadowBlur = ball.brightness;
            ctx.lineWidth = ball.brightness / 10;

            //*functions
            // doShine(ball);
            // burnFigure(ctx, ball);
            storePositionOnAcc(ball);
            // storeLastPosition(ball);
            detectCollisions(
              ref.current.width,
              ref.current.height,
              ball,
              balls
            );
            // if (ball.isColliding) {
            //   console.log(ball.index, ">");
            // // }
            // tailText(ctx, ball);
            // if (ball.index == 1) {
            //   (ball.x = mousePosition.x), (ball.y = mousePosition.y);
            // }

            //draw direction vector
            if (drawVectorRef.current?.checked) {
              // ctx.save();
              // ctx.beginPath();
              // ctx.moveTo(ball.x, ball.y);
              // ctx.lineTo(
              //   ball.x + ball.dx * Math.abs(ball.dx) * 0.1, // get 1, -1 direction
              //   ball.y + ball.dy * Math.abs(ball.dy) * 0.1
              // );
              // ctx.strokeStyle = "black";
              // ctx.stroke();
              // ctx.closePath();

              ctx.beginPath();
              ctx.arc(
                ball.x + ball.dx * Math.abs(ball.dx) * 0.1, // get 1, -1 direction
                ball.y + ball.dy * Math.abs(ball.dy) * 0.1,
                2,
                0,
                Math.PI * 2
              );
              // console.log(ball.dx, ball.dy);

              ctx.fillStyle = "blue";
              ctx.fill();
              ctx.closePath();
              ctx.restore();
            }

            //gravity
            if (
              gravityRef.current?.checked &&
              ball.y + ball.radius < ref.current.height &&
              !ball.isColliding &&
              !ball.clicked
            ) {
              ball.dy += g * delta;
            }
            if (ball.clicked) {
              // console.log(ball.x, mouseCoords.x);
              ball.x = mousePosition.x;
              ball.y = mousePosition.y;
            } else {
              ball.x += ball.dx;
              ball.y += ball.dy;
            }
          }
          frameId = requestAnimationFrame(frame);
        }
      };
      requestAnimationFrame(frame);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      ref.current?.removeEventListener("click", (evt: MouseEvent) =>
        handleClick(evt, {} as Ball)
      );

      cancelAnimationFrame(frameId);
    };
  }, []);

  var motionTrailLength = 10;

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
    ball.inverseDir = { x: ball.dx * -1, y: ball.dy * -1 }; //!

    // ball.accelerate = false;
    // if (ball.index === 1) console.log(ball.positionOnAcc);
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
      <div className="canvas-ui">
        <div className="inputDiv">
          <input
            type="number"
            className="input"
            value={balls.length + 1}
            // ref={totalBallsRef}
            max={50}
            min={1}
          />
          <span className="fps" ref={refFps}>
            {p}
          </span>
          <span>balls: {balls.length + 1}</span>
          <div className="box">
            <span>dirVector</span>
            <input type="checkbox" className="checkbox" ref={drawVectorRef} />
          </div>
          <div className="box">
            <span>gravity</span>
            <input type="checkbox" className="checkbox" ref={gravityRef} />
          </div>
        </div>
        <canvas ref={ref} id="objects"></canvas>
      </div>
    </>
  );
};

export default React.memo(Canvas);
