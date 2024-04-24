import { fabric } from 'fabric';
import { useEffect } from 'react';
import { Canvas } from 'fabric/fabric-impl';
import { fabricConfig } from '../../fabricConfig';
declare module 'fabric/fabric-impl' {
  export interface IObjectOptions {
    id?: string;
  }
} //todo*
//https://stackoverflow.com/questions/74032025/how-to-add-a-custom-attribute-to-a-fabricjs-object-with-typescript
import { roundPositionAndSnap, handleEdgePosition, handleStartingArrangePosition } from '@/utils/fabricUtils';
export type startingPositionType = 'vertical' | 'horizontal';
export const useFabric = (canvasRef: React.MutableRefObject<Canvas | null>) => {
  const { gridSize, defaultDancerCount, gridBackGroundColor, defaultCircleColor, overlapOffset } = fabricConfig;

  ////會從store拿
  const column = fabricConfig.defaultCol(defaultDancerCount);
  const row = fabricConfig.defaultRow(defaultDancerCount);

  const dancer = defaultDancerCount;
  const startingPositionType = 'horizontal';

  const isTextVisible = true;
  ////

  //todo eslint not working
  //initial state

  useEffect(() => {
    initCanvas();

    function initCanvas() {
      canvasRef.current = new fabric.Canvas('c', {
        selection: false,
        width: gridSize * column + 1,
        height: gridSize * row + 1,
        backgroundColor: gridBackGroundColor,
      });
    }

    return () => {
      canvasRef?.current?.dispose();
    };
  }, [canvasRef, column, gridBackGroundColor, gridSize, row]);

  useEffect(() => {
    generateGrid();

    function generateGrid() {
      addVerticalLines();
      addHorizontalLines();
    }
    function addVerticalLines() {
      const columnCounts = column + 1;
      const startY = 0;
      const endY = gridSize * row;
      for (let i = 0; i < columnCounts; i++) {
        const startX = i * gridSize;
        const endX = startX;
        addLine([startX, startY, endX, endY]);
      }
    }
    function addHorizontalLines() {
      const rowCounts = row + 1;
      const startX = 0;
      const endX = gridSize * column;
      for (let i = 0; i < rowCounts; i++) {
        const startY = i * gridSize;
        const endY = startY;
        addLine([startX, startY, endX, endY]);
      }
    }
    function addLine(positions: [startX: number, startY: number, endX: number, endY: number]) {
      canvasRef?.current?.add(new fabric.Line(positions, { ...fabricConfig.lineStyle() }));
    }
  }, [canvasRef, column, gridSize, row]);

  useEffect(() => {
    addDancers(isTextVisible);

    function addDancers(isTextVisible: boolean) {
      const dancerCount = fabricConfig.defaultDancerCount;
      const getPositionFunc = handleStartingArrangePosition({
        positionType: startingPositionType,
        col: column,
        row: row,
        dancerCount: dancerCount,
        step: fabricConfig.stepUnit(),
      });

      for (let i = 0; i < dancerCount; i++) {
        const textSetting = {
          text: (i + 1).toString(),
          visible: isTextVisible,
        };
        const circleColor = fabricConfig.defaultCircleColor;
        const position = getPositionFunc(i);
        addGroup(textSetting, position, circleColor);
      }
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
  }, [canvasRef, column, dancer, isTextVisible, row]);

  useEffect(() => {
    const canvas = canvasRef?.current as fabric.Canvas;

    function movingDancerAnimate(e: fabric.IEvent<MouseEvent>, scale: number) {
      const target = e.target;
      if (!target) return;
      fabric.util.animate({
        startValue: target.scaleX,
        endValue: scale,
        duration: 100,
        onChange: function (value) {
          target.scale(value);
          canvas.renderAll();
        },
        onComplete: function () {
          target.setCoords();
        },
      });
    }
    canvas.on('mouse:down', function (options) {
      movingDancerAnimate(options, 1.1);
      options?.target?.bringToFront();
    });
    //todo mobile
    canvas.on('mouse:up', function (options) {
      movingDancerAnimate(options, 1);
    });
    return () => {
      canvas.off('mouse:down');
      canvas.off('mouse:up');
    };
  }, [canvasRef]);

  // snap to grid and edge
  useEffect(() => {
    const canvas = canvasRef?.current as fabric.Canvas;
    const boundaryAxis = {
      left: fabricConfig.stepUnit(),
      top: fabricConfig.stepUnit(),
      right: fabricConfig.gridSize * column - fabricConfig.stepUnit(),
      bottom: fabricConfig.gridSize * row - fabricConfig.stepUnit(),
    };

    canvas.on('object:moving', function (options) {
      const target = options.target;
      if (!target) return;

      target.setCoords();
      const targetLeft = target.left as number;
      const targetTop = target.top as number;
      const roundX = roundPositionAndSnap(targetLeft, fabricConfig.stepUnit());
      const roundY = roundPositionAndSnap(targetTop, fabricConfig.stepUnit());
      const handleEdgeX = handleEdgePosition(roundX, boundaryAxis.left, boundaryAxis.right);
      const handleEdgeY = handleEdgePosition(roundY, boundaryAxis.top, boundaryAxis.bottom);
      target.set({
        left: handleEdgeX,
        top: handleEdgeY,
      });

      //overlap
      const group = canvas.getObjects('group') as fabric.Group[];
      group.forEach((obj) => {
        if (obj === target) return;

        const isOverlap =
          target.isContainedWithinObject(obj) ||
          target.intersectsWithObject(obj) ||
          obj.isContainedWithinObject(target);

        if (isOverlap) {
          target.set({
            left: handleEdgeX + fabricConfig.overlapOffset,
            top: handleEdgeY + fabricConfig.overlapOffset,
          });
        }
      });
    });
    return () => {
      canvas.off('object:moving');
    };
  }, [canvasRef, column, row]);
};
