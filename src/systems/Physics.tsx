import Matter from 'matter-js';

const Physics = (entities: any, { time }: any) => {
  // Matter.js 엔진 업데이트
  const { engine } = entities.physics;
  Matter.Engine.update(engine, time.delta);
  
  // 엔티티 위치 업데이트
  const updatedEntities = { ...entities };
  
  Object.keys(entities).forEach(key => {
    if (key !== 'physics' && entities[key].body) {
      const body = entities[key].body;
      
      // 불변성을 유지하며 엔티티 업데이트
      updatedEntities[key] = {
        ...entities[key],
        position: [body.position.x, body.position.y],
        angle: body.angle
      };
    }
  });

  return updatedEntities;
};

export { Physics };