export const fabricConfig = {
  gridSize: 44,
  defaultRow: function (dancerCount: number) {
    return 8;
  },
  defaultCol: function (dancerCount: number) {
    return 8;
  },
  defaultDancerCount: 5,
  minDancerCount: 2,
  maxDanceCount: 30,

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
      strokeWidth: 0.2,
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
      fontSize: 12,
      fill: this.nameColor,
    };
  },
  circleStyle: function () {
    return {
      ...this.commonObjectStyle,
      radius: this.gridSize / 4 + 2,
      stroke: 'rgb(243,121,102,0.5)', //todo
      strokeWidth: 6,
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
