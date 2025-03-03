import Matter from 'matter-js';
export const frame = (width: number, height: number) => {
    // 천장 벽 두께 증가 및 위치 조정
    const wallThickness = 12;
    const ceiling = Matter.Bodies.rectangle(
      width / 2, 
      -wallThickness / 2, // 화면 상단 바깥쪽에 위치
      width, 
      wallThickness, 
      { isStatic: true }
    );

     // 왼쪽 벽과 오른쪽 벽 추가
     const leftWall = Matter.Bodies.rectangle(
       wallThickness / 2, 
       height / 2, 
       wallThickness, 
       height, 
       { isStatic: true }
     );
     
     const rightWall = Matter.Bodies.rectangle(
       width - wallThickness / 2, 
       height / 2, 
       wallThickness, 
       height, 
       { isStatic: true }
     );
  return {
    walls:[ceiling,leftWall,rightWall],
    wallThickness,
  };
};

