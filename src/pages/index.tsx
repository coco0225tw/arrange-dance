import { HomeWrapper } from '@/styles';
import { useRef } from 'react';

import { useFabricStatic } from './hook/useFabricStatic';

export default function Home() {
  const canvasRef = useRef<fabric.Canvas | null>(null);
  useFabricStatic(canvasRef);
  //todo 存fabric在store裡
  return (
    <HomeWrapper>
      <div className="canvas_wrapper">
        <canvas id="c" />
      </div>
    </HomeWrapper>
  );
}
