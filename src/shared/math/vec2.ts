export type Vec2 = { x: number, y: number };

export function mul(v1: Vec2, m: number): Vec2 {
  return {
    x: v1.x * m,
    y: v1.y * m
  }
}

export function diff(v1: Vec2, v2: Vec2) {
  return add(v1, mul(v2, -1));
}

export function add(v1: Vec2, v2: Vec2): Vec2 {
  return {
    x: v1.x + v2.x,
    y: v1.y + v2.y
  }
}

export function normal(v: Vec2) {

  const rawNormal = {
    x: -v.y,
    y: v.x,
  }
  return normalize(rawNormal);
}

export function abs(v: Vec2): number {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}

export function normalize(v: Vec2): Vec2 {
  return mul(v, 1/abs(v));
}

export function middle(v1: Vec2, v2: Vec2) {
  return mul(add(v1, v2), 0.5)
}

export function shorten(v: Vec2, d: number) {
  return extend(v, -1 * d);
}

export function extend(v: Vec2, d: number) {
  const a = abs(v);
  return mul(normalize(v), a + d);
}