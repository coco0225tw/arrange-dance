export function handleEdgePosition(roundPosition: number, min: number, max: number) {
  return roundPosition < min ? min : roundPosition > max ? max : roundPosition;
}
export function roundPosition(position: number, gridSize: number) {
  return Math.round(position / gridSize) * gridSize;
}

export function handleOverLapPosition(position: number, gridSize: number) {
  return (position % gridSize) / gridSize >= 0.5 ? -gridSize : gridSize;
}
