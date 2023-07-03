import {
  ChangeEvent,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { Ball, GenInstances } from "./Ball";
import { detectCollisions } from "./Collider";

function App() {
  const [TotalBalls, setTotalBalls] = useState<number>(10);
  // const [balls, setBalls] = useState<Ball[]>([]);
  const balls: Ball[] = [];
  const speed = 0.2;
  const ref = useRef<HTMLCanvasElement>(null);

  const changeTotalBalls = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(parseInt(e.target.value));
    if (parseInt(e.target.value) > 100) return;
    if (!Number.isNaN(parseInt(e.target.value)))
      setTotalBalls(parseInt(e.target.value));
  };

  useEffect(() => {
    if (ref.current) {
      const total = GenInstances(TotalBalls);
      balls.push(...total);
    }
  }, [TotalBalls]);

  useEffect(() => {
    let frameId: number;
    if (ref?.current) {
      const ctx = ref?.current?.getContext("2d");
      const frame = (time: any) => {
        if (ctx && ref.current && balls.length > 0) {
          ctx.clearRect(0, 0, ref.current.width, ref.current.height);
          for (const ball of balls) {
            ctx.save();

            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            ctx.strokeStyle = ball.color;
            ctx.shadowColor = ball.color;
            // ctx.shadowColor = ball.color;
            ctx.shadowBlur = ball.brightness;
            ctx.lineWidth = ball.brightness / 10;

            if (
              ball.dx < 1.5 &&
              ball.dx > -1.5 &&
              ball.dy < 1.5 &&
              ball.dy > -1.5
            ) {
              ball.dx *= 4;
              ball.dy *= 4;
            }
            ctx.stroke();
            ctx.closePath();
            ctx.setTransform(1, 0, 0, 1, 0, 0);

            // ctx.beginPath();
            // ctx.moveTo(ball.x, ball.y);
            // ctx.lineTo(ball.x + ball.dx * 10, ball.y + ball.dy * 10);
            // ctx.strokeStyle = "#ff00ff";
            // ctx.stroke();

            ctx.restore();

            doShine(ball);
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

  function doShine(ball: Ball) {
    if (ball.shine) {
      const fn = -1 * ball.util_count ** 2 + 10 * ball.util_count + 5;

      ball.brightness = fn;
      ball.util_count += 0.1;
    }
  }
  return (
    <>
      <header className="header"></header>
      <main className="main">
        <aside className="aside"></aside>
        <section>
          <div className="inputDiv">
            <input
              type="number"
              className="input"
              defaultValue={TotalBalls}
              onChange={changeTotalBalls}
              max={100}
              min={1}
            />
            <span>max: 100</span>
            <span>max: 1</span>
            <span>current: {TotalBalls}</span>
          </div>
          <canvas ref={ref} id="tutorial" width="800" height="600"></canvas>
        </section>
      </main>
    </>
  );
}

export default App;
