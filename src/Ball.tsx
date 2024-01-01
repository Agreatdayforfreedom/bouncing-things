type Vec2 = { x: number; y: number };

export function Vec2_init(): Vec2 {
  return { x: 0, y: 0 };
}

const textsName: string[] = [
  "Nietzsche",
  "Poe",
  "Newton",
  "Gauss",
  "Leibniz",
  "Moreno",
  "Hoppe",
  "Rothbard",
  "JHSoto",
  "Assange",
];

export interface Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;
  color: string;
  positions: Array<Vec2>;
  isColliding: boolean;
  accelerate: boolean;
  immunity: boolean;
  index: number;
  name: string;
  radius: number;
  dashed: boolean;
  shine: boolean;
  brightness: number;
  area: number;
  util_count: number; //save util number for compute
  mass: number;
  drawDirVector: boolean;
  positionOnAcc: Vec2;
  clicked: boolean;
  // texts: Array<Vec2 & { dir: Vec2; alpha: number }>;
  inverseDir: Vec2; // inverse direction of the ball
  image: string;

  //dev
  crash: boolean;
}
export function GenInstances(total: number): Ball[] {
  let set: Ball[] = [];

  for (let i = 0; i < 50; i++) {
    const ball: Ball = {
      x: Math.floor(Math.random() * i * 100),
      y: Math.floor(Math.random() * i * 100),
      dx: Math.floor(Math.random() * i * 2 + 1),
      dy: Math.floor(Math.random() * i * 2 + 1),
      isColliding: false,
      positions: [],
      accelerate: false,
      dashed: Math.random() * 10 > 5,
      shine: false,
      immunity: true, //the ball has immunity the first 500ms
      color: `#${[...Array(6)]
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join("")}`,
      index: i + 1,
      name: textsName[i],
      drawDirVector: false,
      brightness: 0,
      mass: 0,
      positionOnAcc: Vec2_init(),
      inverseDir: Vec2_init(),
      util_count: 0,
      crash: false,
      clicked: false,
      // texts: [
      //   { ...Vec2_init(), dir: Vec2_init(), alpha: 1 },
      //   { ...Vec2_init(), dir: Vec2_init(), alpha: 1 },
      //   { ...Vec2_init(), dir: Vec2_init(), alpha: 1 },
      //   { ...Vec2_init(), dir: Vec2_init(), alpha: 1 },
      //   { ...Vec2_init(), dir: Vec2_init(), alpha: 1 },
      //   { ...Vec2_init(), dir: Vec2_init(), alpha: 1 },
      //   { ...Vec2_init(), dir: Vec2_init(), alpha: 1 },
      //   { ...Vec2_init(), dir: Vec2_init(), alpha: 1 },
      // ],

      radius: Math.floor(Math.random() * (30 - 15 + 1)) + 15,
      image: i + 1 <= 10 ? `/${i + 1}.png` : "",
      area: 0,
    };
    ball.area = Math.PI * (ball.radius * ball.radius);
    ball.mass = 2 * Math.PI * ball.radius ** 2;
    set.push(ball);
  }

  return set;
}
