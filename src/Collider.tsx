import { Ball } from "./Ball";
import { g, restitution } from "./constants";

// export function tailText(ctx: CanvasRenderingContext2D, ball: Ball) {
//   if (ball.isColliding) {
//     console.log(ball.index);
//     // console.log(first)
//     for (const text of ball.texts) {
//       // if (text.alpha < 0.5) break;

//       text.x = ball.x;
//       text.y = ball.y;
//       let dx = Math.random() * 0.5;
//       let dy = Math.random() * 0.5;
//       dx *= Math.round(Math.random()) ? 1 : -1;
//       dy *= Math.round(Math.random()) ? 1 : -1;
//       text.dir.x = dx;
//       text.dir.y = dy;
//     }
//   }

// for (var i = 0; i < ball.texts.length; i++) {
//   const text = ball.texts[i];
//   if (text.alpha < 0) break;
//   ctx.beginPath();
//   ctx.fillText(ball.name, ball.texts[i].x, ball.texts[i].y);

//   text.x += text.dir.x * 2; //2 speed;
//   text.y += text.dir.y * 2;

//   ctx.font = "serif";
//   ctx.fillStyle = "rgba(255, 255, 255, " + text.alpha + ")";
//   text.alpha -= 0.025;
//   ctx.save();
//   ctx.closePath();
// }
// }

export function detectCollisions(
  widthScreen: number,
  heightScreen: number,
  ball: Ball,
  balls: Ball[]
) {
  let obj1;
  let obj2;
  // Reset collision state of all objects
  // tailText(ctx, ball);
  for (let i = 0; i < balls.length; i++) {
    //reset ball brightness
    // if (ball.util_count > 10) {
    //   ball.shine = false;
    //   ball.brightness = 0;
    //   ball.util_count = 0.5;
    balls[i].isColliding = false;
  }

  if (ball.x < ball.radius) {
    ball.dx = Math.abs(ball.dx) * restitution;
    ball.x = ball.radius;
  } else if (ball.x > widthScreen - ball.radius) {
    ball.dx = -Math.abs(ball.dx) * restitution;
    ball.x = widthScreen - ball.radius;
  }

  // Check for bottom and top
  if (ball.y < ball.radius) {
    ball.dy = Math.abs(ball.dy) * restitution;
    ball.y = ball.radius;
  } else if (ball.y > heightScreen - ball.radius) {
    ball.dy = -Math.abs(ball.dy) * restitution;
    ball.y = heightScreen - ball.radius;
  }
  // Start checking for collisions
  for (let i = 0; i < balls.length; i++) {
    obj1 = balls[i];
    if (obj1.immunity) break;
    for (let j = i + 1; j < balls.length; j++) {
      obj2 = balls[j];

      // Compare object1 with object2
      if (
        circleIntersect(
          obj1.x,
          obj1.y,
          obj1.radius,
          obj2.x,
          obj2.y,
          obj2.radius
        )
      ) {
        // if (obj1.clicked) {
        //   console.log("INTERCECT");
        // }
        obj1.util_count = 1;

        obj1.isColliding = true;
        obj2.isColliding = true;

        obj1.shine = true;
        obj2.shine = true;

        let vCollision = { x: obj2.x - obj1.x, y: obj2.y - obj1.y };
        let distance = Math.sqrt(
          (obj2.x - obj1.x) * (obj2.x - obj1.x) +
            (obj2.y - obj1.y) * (obj2.y - obj1.y)
        );
        let vCollisionNorm = {
          x: vCollision.x / distance,
          y: vCollision.y / distance,
        };
        let vRelativeVelocity = {
          x: obj1.dx - obj2.dx,
          y: obj1.dy - obj2.dy,
        };
        let speed =
          vRelativeVelocity.x * vCollisionNorm.x +
          vRelativeVelocity.y * vCollisionNorm.y;

        // speed += g * 0.0166;
        if (speed < 0) {
          break;
        }
        let impulse = (2 * speed) / (obj1.mass + obj2.mass);
        // obj1.dx = 0;
        // obj2.dx = 0;
        obj1.dx -= impulse * restitution * obj2.mass * vCollisionNorm.x;
        obj1.dy -= impulse * restitution * obj2.mass * vCollisionNorm.y;
        obj2.dx += impulse * restitution * obj1.mass * vCollisionNorm.x;
        obj2.dy += impulse * restitution * obj1.mass * vCollisionNorm.y;
      }
    }
  }
}

function circleIntersect(
  x1: number,
  y1: number,
  r1: number,
  x2: number,
  y2: number,
  r2: number
) {
  // Calculate the distance between the two circles
  //! alternatives
  //! 1
  // let dx = x1 - x2;
  // let dy = y1 - y2;
  // let squareDistance1 = Math.sqrt(dx * dx + dy * dy);

  //! 2
  // let squareDistance = Math.hypot(x1 - x2, y1 - y2);
  //! 3
  let squareDistance = (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
  // squareDistance = squareDistance * 2;
  // When the distance is smaller or equal to the sum
  // of the two radius, the circles touch or overlap
  // return squareDistance <= r1 + r2;
  return squareDistance <= (r1 + r2) * (r1 + r2);
}

function rectIntersect(
  x1: number,
  y1: number,
  w1: number,
  h1: number,
  x2: number,
  y2: number,
  w2: number,
  h2: number
) {
  // Check x and y for overlap
  if (x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2) {
    return false;
  }
  return true;
}

//square collider
// if (
//   ball.x + ball.dx > ref.current.width - ball.size ||
//   ball.x + ball.dx < 0
// ) {
//   ball.dx = -ball.dx;
//   // setBallPosition({ dx: -dx });
// }
// if (
//   ball.y + ball.dy > ref.current.height - ball.size ||
//   ball.y + ball.dx < 0
// ) {
//   ball.dy = -ball.dy;
//   // setBallPosition({ dy: -dy });
// }
