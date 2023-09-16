
export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export function drawRoundedRect(rect: Rect, r: number, ctx: CanvasRenderingContext2D) {
  var ptA = new Point(rect.x + r, rect.y);
  var ptB = new Point(rect.x + rect.width, rect.y);
  var ptC = new Point(rect.x + rect.width, rect.y + rect.height);
  var ptD = new Point(rect.x, rect.y + rect.height);
  var ptE = new Point(rect.x, rect.y);

  ctx.beginPath();

  ctx.moveTo(ptA.x, ptA.y);
  ctx.arcTo(ptB.x, ptB.y, ptC.x, ptC.y, r);
  ctx.arcTo(ptC.x, ptC.y, ptD.x, ptD.y, r);
  ctx.arcTo(ptD.x, ptD.y, ptE.x, ptE.y, r);
  ctx.arcTo(ptE.x, ptE.y, ptA.x, ptA.y, r);

  ctx.stroke();
}
