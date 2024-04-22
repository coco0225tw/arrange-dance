export const fabricConfig = {
  gridSize: 50,
  defaultRow: 10,
  defaultCol: 10,
  defaultDancerCount: 5,
  radiusOffset: 4,
  gridBackGroundColor: '#222222',
  nameColor: '#eeeeee',
  defaultCircleColor: '#f37966',
  lineStyle: function () {
    return {
      stroke: this.nameColor,
      strokeWidth: 0.5,
      selectable: false,
    };
  },
};
