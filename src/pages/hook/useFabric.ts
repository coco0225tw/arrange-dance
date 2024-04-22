import { fabric } from 'fabric';
import { useEffect, useRef } from 'react';
import { Canvas } from 'fabric/fabric-impl';
import { fabricConfig } from '../../fabricConfig';
declare module 'fabric/fabric-impl' {
  export interface IObjectOptions {
    id?: string;
  }
} //todo*
//https://stackoverflow.com/questions/74032025/how-to-add-a-custom-attribute-to-a-fabricjs-object-with-typescript
import { roundPosition, handleEdgePosition, handleOverLapPosition } from '@/utils/fabricUtils';
export const useFabric = () => {
  const {
    gridSize,
    defaultCol,
    defaultRow,
    defaultDancerCount,
    radiusOffset,
    gridBackGroundColor,
    nameColor,
    defaultCircleColor,
  } = fabricConfig;
  const canvasRef = useRef<Canvas | null>(null);
  const size = gridSize;
  const column = defaultCol;
  const row = defaultRow;
  const circleRadius = size / 2 - radiusOffset;
  const circleColor = defaultCircleColor;
  const dancer = defaultDancerCount;

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
      backgroundColor: gridBackGroundColor,
    });
  };
  const generateGrid = () => {
    addVerticalLines();
    addHorizontalLines();
  };
  const addVerticalLines = () => {
    const columnCounts = column + 1;
    const startY = 0;
    const endY = size * row;
    for (let i = 0; i < columnCounts; i++) {
      const startX = i * size;
      const endX = startX;
      addLine([startX, startY, endX, endY]);
    }
  };
  const addHorizontalLines = () => {
    const rowCounts = row + 1;
    const startX = 0;
    const endX = size * column;
    for (let i = 0; i < rowCounts; i++) {
      const startY = i * size;
      const endY = startY;
      addLine([startX, startY, endX, endY]);
    }
  };
  const addLine = (position: [startX: number, startY: number, endX: number, endY: number]) => {
    canvasRef?.current?.add(new fabric.Line(position, fabricConfig.lineStyle()));
  };

  const addCircle = () => {
    return new fabric.Circle({
      radius: circleRadius,
      fill: circleColor,
      originX: 'center',
      originY: 'center',
      centeredRotation: true,
      hasControls: false,
      selectable: true,
    });
  };
  const addText = (setting: { text: string; visible: boolean; nameColor: string }) => {
    const { text, visible, nameColor } = setting;
    return new fabric.Text(text, {
      fontSize: 24,
      originX: 'center',
      originY: 'center',
      selectable: false,
      hasControls: false,
      fill: nameColor,
      visible: visible,
      //fontFamily: '3d.demo', //todo
    });
  };
  const addGroup = (
    textSetting: { text: string; visible: boolean; nameColor: string },
    position: { left: number; top: number }
  ) => {
    canvasRef?.current?.add(
      new fabric.Group([addCircle(), addText(textSetting)], {
        left: position.left,
        top: position.top,
        originX: 'center',
        originY: 'center',
        hasControls: false,
        width: size,
        height: size,
        id: textSetting.text,
      })
    );
  };

  //todo eslint not working
  useEffect(() => {
    initCanvas();
    generateGrid();

    for (let i = 1; i <= dancer; i++) {
      const textSetting = {
        text: i.toString(),
        visible: true,
        nameColor: nameColor,
      };
      const position = { left: boundaryAxis.left, top: i * size };
      addGroup(textSetting, position);
    } //todo

    return () => {
      canvasRef?.current?.dispose();
    };
  }, [dancer]);

  // snap to grid and edge
  useEffect(() => {
    canvasRef?.current?.on('object:moving', function (options) {
      const target = options.target;
      if (!target) return;

      const targetLeft = target.left;
      const targetTop = target.top;
      if (!targetLeft || !targetTop) return;

      target.setCoords();

      const handleEdgeX = handleEdgePosition(roundPosition(targetLeft, size), boundaryAxis.left, boundaryAxis.right);
      const handleEdgeY = handleEdgePosition(roundPosition(targetTop, size), boundaryAxis.top, boundaryAxis.bottom);
      //snap to grid
      target.set({
        left: handleEdgeX,
        top: handleEdgeY,
      });

      //overlap
      const group = canvasRef.current?.getObjects('group');
      group?.forEach((obj) => {
        if (obj === target) return;

        const objLeft = obj.left;
        const objWidth = obj.width;
        const objTop = obj.top;
        const objHeight = obj.height;
        const targetWidth = target.width;
        const targetHeight = target.height;
        if (!objLeft || !objWidth || !objTop || !objHeight || !targetWidth || !targetHeight) return;

        const isOverlap =
          target.isContainedWithinObject(obj) ||
          target.intersectsWithObject(obj) ||
          obj.isContainedWithinObject(target);
        if (isOverlap) {
          const distLeft = (objLeft + objWidth) / 2 - (targetLeft + targetWidth) / 2;
          const distTop = (objTop + objHeight) / 2 - (targetTop + targetHeight) / 2;
          //todo
          const left = distLeft > 0 ? objLeft - targetWidth : objLeft + targetWidth;
          const top = distTop > 0 ? objTop - targetHeight : objTop + targetHeight;

          const handleEdgeX = handleEdgePosition(roundPosition(left, size), boundaryAxis.left, boundaryAxis.right);
          const handleEdgeY = handleEdgePosition(roundPosition(top, size), boundaryAxis.top, boundaryAxis.bottom);

          target.set({
            left: handleEdgeX,
            top: handleEdgeY,
          });
        }
      });
    });
    return () => {
      canvasRef?.current?.off();
    };
  }, []);
};
