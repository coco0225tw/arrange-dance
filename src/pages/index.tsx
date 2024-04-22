import { HomeWrapper } from '@/styles';
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
