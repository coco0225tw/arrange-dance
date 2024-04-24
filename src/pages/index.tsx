import { HomeWrapper } from '@/styles';
import { useRef } from 'react';
import { useFabric } from './hook/useFabric';
export default function Home() {
  useFabric();

  return (
    <HomeWrapper>
      <canvas id="c" />
      {/* <button onClick={() => addGroup()}></button> */}
    </HomeWrapper>
  );
}
