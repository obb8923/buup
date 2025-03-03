import Matter from 'matter-js';
import { useEffect, useState } from 'react';

interface WorldOptions {
  gravity?: { x: number; y: number };
  bounds?: { width: number; height: number };
}

export const useMatterWorld = (options: WorldOptions = {}) => {
  const engine = Matter.Engine.create();
  const {world} = engine;

  useEffect(() => {

   // 중력 설정: options를 통해 중력 값을 조정할 수 있습니다.
   engine.gravity.x = options.gravity?.x ?? 0;
   engine.gravity.y = options.gravity?.y ?? 1;
engine.gravity.scale = 1;
    // 게임 루프 설정
    const gameLoop = setInterval(() => {
      Matter.Engine.update(engine, 1000 / 60);
    }, 1000 / 60);

    return () => {
      clearInterval(gameLoop);
      Matter.World.clear(world, false);
      Matter.Engine.clear(engine);
    };
  }, [engine, world]);

  // 물체 생성 헬퍼 함수들
  const addCircle = (x: number, y: number, radius: number, options = {}) => {
    const circle = Matter.Bodies.circle(x, y, radius, options);
    Matter.World.add(world, circle);
    return circle;
  };

  const addRectangle = (x: number, y: number, width: number, height: number, options = {}) => {
    const rectangle = Matter.Bodies.rectangle(x, y, width, height, options);
    Matter.World.add(world, rectangle);
    return rectangle;
  };

  const removeBody = (body: Matter.Body) => {
    Matter.World.remove(world, body);
  };

  return {
    engine,
    world,
    addCircle,
    addRectangle,
    removeBody
  };
};