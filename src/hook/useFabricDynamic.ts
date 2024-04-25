import { fabricConfig } from '@/fabricConfig';
import { fabric } from 'fabric';
import { Canvas } from 'fabric/fabric-impl';

export function useFabricDynamic(canvasRef: React.MutableRefObject<Canvas | null>) {
  function addGroup(
    textSetting: { text: string; visible: boolean },
    position: { left: number; top: number },
    circleColor: string
  ) {
    canvasRef?.current?.add(
      new fabric.Group([addCircle(circleColor), addText(textSetting)], {
        ...fabricConfig.groupStyle(),
        left: position.left,
        top: position.top,
        id: textSetting.text,
      })
    );
  }
  function addText(setting: { text: string; visible: boolean }) {
    const { text, visible } = setting;
    return new fabric.Text(text, {
      ...fabricConfig.textStyle(),
      visible: visible,
      //fontFamily: '3d.demo', //todo
    });
  }
  function addCircle(color: string) {
    return new fabric.Circle({
      ...fabricConfig.circleStyle(),
      fill: color,
    });
  }

  return {
    addGroup,
  };
}
