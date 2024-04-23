export function handleEdgePosition(roundPosition: number, min: number, max: number) {
  return roundPosition < min ? min : roundPosition > max ? max : roundPosition;
}
export function roundPositionAndSnap(position: number, step: number) {
  return Math.round(position / step) * step;
}
