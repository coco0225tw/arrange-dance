export const fabricConfig = {
  gridSize: 70,
  defaultRow: 8,
  defaultCol: 8,
  defaultDancerCount: 5,
  gridBackGroundColor: '#222222',
  nameColor: '#eeeeee',
  defaultCircleColor: '#f37966',
  overlapOffset: 2,
  stepUnit: function () {
    return this.gridSize / 2;
  },
  groupSize: function () {
    return this.gridSize / 4;
  },
  lineStyle: function () {
    return {
      ...this.commonObjectStyle,
      stroke: this.nameColor,
      strokeWidth: 0.5,
    };
  },
  groupStyle: function () {
    return {
      ...this.commonObjectStyle,
      selectable: true,
      width: this.groupSize(),
      height: this.groupSize(),
    };
  },
  textStyle: function () {
    return {
      ...this.commonObjectStyle,
      fontSize: 20,
      fill: this.nameColor,
    };
  },
  circleStyle: function () {
    return {
      ...this.commonObjectStyle,
      radius: this.gridSize / 2 - 10,
      stroke: this.nameColor,
      strokeWidth: 0.5,
      strokeUniform: true,
    };
  },

  commonObjectStyle: {
    originX: 'center',
    originY: 'center',
    hasControls: false,
    hasBorders: false,
    selectable: false,
  },
};
