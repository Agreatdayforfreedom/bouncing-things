export interface Ball {
  x: number;
  y: number;
  positions: Array<{ x: number; y: number }>;
  dx: number;
  dy: number;
  color: string;
  isColliding: boolean;
  accelerate: boolean;
  index: number;
  radius: number;
  dashed: boolean;
  shine: boolean;
  brightness: number;
  area?: number;
  util_count: number; //save util number for compute
  mass: number;
}

export function GenInstances(total: number): Ball[] {
  let set: Ball[] = [];
  for (let i = 0; i < total; i++) {
    const ball: Ball = {
      x: Math.floor(Math.random() * i * 2 + 1),
      y: Math.floor(Math.random() * i * 2),
      dx: Math.floor(Math.random() * i * 2 + 1.5),
      dy: Math.floor(Math.random() * i * 2 + 1.5),
      isColliding: false,
      positions: [],
      accelerate: false,
      dashed: Math.random() * 10 > 5,
      shine: false,
      color: `#${[...Array(6)]
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join("")}`,
      index: i + 1,
      brightness: 0,
      mass: Math.floor(Math.random() * 3) + 1,
      util_count: 0,
      radius: 10,
    };
    ball.area = ball.radius * ball.mass;
    set.push(ball);
  }

  return set;
}
