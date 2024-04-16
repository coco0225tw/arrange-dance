import { fabric } from 'fabric';
import { useEffect, useRef } from 'react';
import { HomeWrapper } from '@/styles';
import { Canvas } from 'fabric/fabric-impl';
export default function Home() {
  const canvasRef = useRef<Canvas | null>(null);
  const size = 50;
  const column = 18;
  const row = 12;
  const circleRadius = size / 2 - 4;
  const boundaryAxis = {
    left: size,
    top: size,
    right: size * (column - 1),
    bottom: size * (row - 1),
  };
  const initCanvas = () => {
    canvasRef.current = new fabric.Canvas('c', {
      selection: false,
      width: size * column + 1,
      height: size * row + 1,
      backgroundColor: '#222222',
    });
  };
  const generateGrid = () => {
    for (let i = 0; i < column + 1; i++) {
      canvasRef?.current?.add(
        new fabric.Line([i * size, 0, i * size, size * row], { stroke: '#ccc', strokeWidth: 0.5, selectable: false })
      );
    }
    for (let i = 0; i < row + 1; i++) {
      canvasRef?.current?.add(
        new fabric.Line([0, i * size, size * column, i * size], { stroke: '#ccc', strokeWidth: 0.5, selectable: false })
      );
    }
  };
  //todo eslint not working
  useEffect(() => {
    initCanvas();
    generateGrid();
    return () => {
      canvasRef?.current?.dispose();
    };
  }, []);
  const addCircle = () => {
    return new fabric.Circle({
      radius: circleRadius,
      fill: '#f37966',
      originX: 'center',
      originY: 'center',
      centeredRotation: true,
      hasControls: false,
      selectable: true,
    });
  };
  const addText = () => {
    return new fabric.Text('d', {
      fontSize: 24,
      originX: 'center',
      originY: 'center',
      selectable: false,
      hasControls: false,
      fill: '#eeeeee',
      visible: true,
      //fontFamily: '3d.demo',
    });
  };
  const addGroup = () => {
    canvasRef?.current?.add(
      new fabric.Group([addCircle(), addText()], {
        left: 350,
        top: 350,
        originX: 'center',
        originY: 'center',
        hasControls: false,
      })
    );
  };

  // snap to grid
  useEffect(() => {
    canvasRef?.current?.on('object:moving', function (options) {
      const remainderX = ((options?.target?.left as number) % size) / size >= 0.5 ? -size : size;
      const remainderY = ((options?.target?.top as number) % size) / size >= 0.5 ? -size : size;
      const objectY = Math.round((options?.target?.top as number) / size) * size;
      const objectX = Math.round((options?.target?.left as number) / size) * size;
      const offsetX =
        objectX < boundaryAxis.left ? boundaryAxis.left : objectX > boundaryAxis.right ? boundaryAxis.right : objectX;
      const offsetY =
        objectY < boundaryAxis.top ? boundaryAxis.top : objectY > boundaryAxis.bottom ? boundaryAxis.bottom : objectY;
      if (offsetX === 300 && objectY === 300) {
        options?.target?.set({
          left: offsetX + remainderX,
          top: offsetY + remainderY,
        });
      } else {
        options?.target?.set({
          left: offsetX,
          top: offsetY,
        });
      }
    });
    return () => {
      canvasRef?.current?.off();
    };
  }, []);

  return (
    <HomeWrapper>
      <canvas id="c" />
      <button onClick={() => addGroup()}></button>
    </HomeWrapper>
  );
}
