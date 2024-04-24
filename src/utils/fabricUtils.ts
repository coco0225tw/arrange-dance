import { startingPositionType } from '@/pages/hook/useFabric';
export function handleEdgePosition(roundPosition: number, min: number, max: number) {
  return roundPosition < min ? min : roundPosition > max ? max : roundPosition;
}
export function roundPositionAndSnap(position: number, step: number) {
  return Math.round(position / step) * step;
}

function firstDancerOffset(dancerCount: number, gridCount: number) {
  const dist = gridCount - dancerCount;

  switch (true) {
    case dist > 0: {
      return (dist + 1) / 2;
    }
    default:
      return 1 / 2;
  }
}
function getTotalDancerLineCount(dancerCount: number, gridCount: number) {
  const quo = Math.floor(dancerCount / gridCount);
  const dancerLineCount = dancerCount % gridCount === 0 ? quo : quo + 1;
  return dancerLineCount;
}

function handleDancerLine(dancerIndex: number, gridCount: number, totalDancerLineCount: number) {
  const moveLineOffset = -(totalDancerLineCount - 1) * 0.5;
  const quo = Math.floor(dancerIndex / gridCount) + moveLineOffset;
  const rem = dancerIndex % gridCount;
  return { lineIndex: quo, offset: rem };
}

export function handleStartingArrangePosition({
  positionType,
  col,
  row,
  dancerCount,
  step,
}: {
  positionType: startingPositionType;
  col: number;
  row: number;
  dancerCount: number;
  step: number;
}) {
  const gap = step * 2;

  switch (positionType) {
    case 'vertical': {
      const totalDancerLineCount = getTotalDancerLineCount(dancerCount, row);
      const verticalMiddle = col / 2;
      const offsetTop = firstDancerOffset(dancerCount, row);
      return function (dancerIndex: number) {
        const { lineIndex, offset } = handleDancerLine(dancerIndex, row, totalDancerLineCount);
        return { left: (verticalMiddle + lineIndex) * gap, top: (offsetTop + offset) * gap };
      };
    }
    case 'horizontal': {
      const totalDancerLineCount = getTotalDancerLineCount(dancerCount, col);
      const horizontalMiddle = row / 2;
      const offsetLeft = firstDancerOffset(dancerCount, col);
      return function (dancerIndex: number) {
        const { lineIndex, offset } = handleDancerLine(dancerIndex, col, totalDancerLineCount);
        return { left: (offsetLeft + offset) * gap, top: (horizontalMiddle + lineIndex) * gap };
      };
    }
    default: {
      const totalDancerLineCount = getTotalDancerLineCount(dancerCount, col);
      const horizontalMiddle = row / 2;
      const offsetLeft = firstDancerOffset(dancerCount, col);
      return function (dancerIndex: number) {
        const { lineIndex, offset } = handleDancerLine(dancerIndex, col, totalDancerLineCount);
        return { left: (offsetLeft + offset) * gap, top: (horizontalMiddle + lineIndex) * gap };
      };
    }
  }
}
