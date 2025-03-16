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

// 계산된 최대 포인트 개수를 캐싱
let cachedMaxPointsCount: number | null = null;
let cachedScreenWidth: number = width;
let cachedScreenHeight: number = height;

/**
 * 현재 화면 크기와 버블 크기를 고려하여 생성 가능한 최대 포인트 개수를 계산합니다.
 * 결과를 캐싱하여 일관된 값을 반환합니다.
 * @param minDistance 포인트 간 최소 거리
 * @param forceRecalculate 캐시된 값을 무시하고 강제로 재계산할지 여부
 * @returns 생성 가능한 최대 포인트 개수
 */
const getMaxPointsCount = (minDistance: number = minDistanceValue, forceRecalculate: boolean = false): number => {
  // 현재 화면 크기 가져오기
  const currentWidth = Dimensions.get('window').width;
  const currentHeight = Dimensions.get('window').height;
  
  // 캐시된 값이 있고, 화면 크기가 변경되지 않았으며, 강제 재계산이 아니라면 캐시된 값 반환
  if (
    cachedMaxPointsCount !== null && 
    !forceRecalculate && 
    currentWidth === cachedScreenWidth && 
    currentHeight === cachedScreenHeight
  ) {
    return cachedMaxPointsCount;
  }
  
  // 화면의 유효 영역 계산 (여백 제외)
  const effectiveWidth = currentWidth - 2 * margin;
  const effectiveHeight = currentHeight - 2 * margin;
  
  // 포아송 디스크 샘플링 설정
  const pds = new PoissonDiskSampling({ 
    shape: [effectiveWidth, effectiveHeight], 
    minDistance: minDistance
  });
  
  // 모든 가능한 포인트 생성 후 개수 계산
  const points = pds.fill();
  
  // 결과를 캐시에 저장
  cachedMaxPointsCount = points.length;
  cachedScreenWidth = currentWidth;
  cachedScreenHeight = currentHeight;
  
  // console.log(`[PoissonDisk] 최대 포인트 개수 계산: ${cachedMaxPointsCount} (화면: ${Math.round(currentWidth)}x${Math.round(currentHeight)})`);
  
  return cachedMaxPointsCount;
};

/**
 * 지정된 개수만큼의 포아송 디스크 샘플링 좌표를 생성합니다.
 * 좌표가 화면 전체를 채울 수 없다면, 화면의 위쪽부터 채웁니다.
 * 항상 y좌표 기준으로 정렬하여 인덱스 0이 가장 위에 오도록 합니다.
 * 버블 크기를 고려하여 겹치지 않도록 최소 거리를 설정합니다.
 * @param count 생성할 좌표의 개수
 * @returns 조정된 좌표 배열 (y좌표 기준 정렬됨)
 */
const generatePoints = (count: number = 10) => {
  // 요청된 개수가 최대 가능 개수보다 많으면 최대 가능 개수로 제한
  const maxCount = getMaxPointsCount();
  const limitedCount = Math.min(count, maxCount);
  
  const pds = new PoissonDiskSampling({ 
    shape: [width - 2*margin, height - 2*margin], 
    minDistance: minDistanceValue // 버블 지름 + 안전 여백
  });
  
  // 포인트 생성
  let points = pds.fill();
  
  // 항상 y 좌표(높이)를 기준으로 정렬하여 위쪽부터 채우기
  points.sort((a, b) => a[1] - b[1]);
  
  // 요청된 개수만큼만 반환
  if (points.length > limitedCount) {
    points = points.slice(0, limitedCount);
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
export {generatePoints, generatePointsAll, getMaxPointsCount};
