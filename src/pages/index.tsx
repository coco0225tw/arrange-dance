import { HomeWrapper } from '@/styles';
import { useRef } from 'react';

import { useFabric } from './hook/useFabric';

export default function Home() {
  const canvasRef = useRef<fabric.Canvas | null>(null);
  useFabric(canvasRef);

  return (
    <HomeWrapper>
      <div className="canvas_wrapper">
        <canvas id="c" />
      </div>
    </HomeWrapper>
  );
}
