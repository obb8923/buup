import PoissonDiskSampling from "poisson-disk-sampling";
import { Dimensions } from "react-native";
import { BubbleConstant as BC } from "../../constants/EntitiesConstants";

// 버블의 최대 크기와 진폭을 고려한 여백 설정
const maxBubbleSize = BC.maxSize;
const maxAmplitude = 5; // 최대 진폭 값

// 버블이 겹치지 않도록 여백 설정 (버블 지름 + 추가 여백)
const bubbleDiameter = maxBubbleSize * 2; // 버블 지름
const safetyMargin = 20; // 추가 안전 여백
const margin = bubbleDiameter / 2 + safetyMargin; // 화면 가장자리 여백

// 최소 거리는 버블 지름보다 커야 겹치지 않음
const minDistanceValue = bubbleDiameter + safetyMargin;

const { width, height } = Dimensions.get('window');

/**
 * 지정된 개수만큼의 포아송 디스크 샘플링 좌표를 생성합니다.
 * 좌표가 화면 전체를 채울 수 없다면, 화면의 위쪽부터 채웁니다.
 * 항상 y좌표 기준으로 정렬하여 인덱스 0이 가장 위에 오도록 합니다.
 * 버블 크기를 고려하여 겹치지 않도록 최소 거리를 설정합니다.
 * @param count 생성할 좌표의 개수
 * @returns 조정된 좌표 배열 (y좌표 기준 정렬됨)
 */
const generatePoints = (count: number = 10) => {
  const pds = new PoissonDiskSampling({ 
    shape: [width - 2*margin, height - 2*margin], 
    minDistance: minDistanceValue // 버블 지름 + 안전 여백
  });
  
  // 포인트 생성
  let points = pds.fill();
  
  // 항상 y 좌표(높이)를 기준으로 정렬하여 위쪽부터 채우기
  points.sort((a, b) => a[1] - b[1]);
  
  // 요청된 개수만큼만 반환
  if (points.length > count) {
    points = points.slice(0, count);
  }
  
  // 여백을 고려하여 좌표 조정
  return points.map((point: number[]) => [point[0] + margin, point[1] + margin]);
};

const generatePointsAll = (minDistance: number = minDistanceValue)=> { // 기본값을 버블 크기에 맞게 설정
    const pds = new PoissonDiskSampling({ 
        shape: [width - 2*margin, height - 2*margin], 
        minDistance: minDistance,
      });
      
      let points = pds.fill();
      
      // 항상 y 좌표 기준으로 정렬
      points.sort((a, b) => a[1] - b[1]);
      
      // 여백을 고려하여 좌표 조정
      return points.map((point: number[]) => [point[0] + margin, point[1] + margin]);
}
export {generatePoints, generatePointsAll};
