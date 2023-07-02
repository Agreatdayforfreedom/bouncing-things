export interface Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;
  color: string;
  isColliding: boolean;
  index: number;
  radius: number;
  shine: number;
  area?: number;
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
      shine: 0.1,
      color: `#${[...Array(6)]
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join("")}`,
      index: i + 1,
      mass: Math.floor(Math.random() * 3) + 1,
      radius: 20,
    };
    ball.area = ball.radius * ball.mass;
    set.push(ball);
  }

  return set;
}
