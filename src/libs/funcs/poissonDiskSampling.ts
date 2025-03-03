import PoissonDiskSampling from "poisson-disk-sampling";
import { Dimensions } from "react-native";

const margin = 50; // 화면 가장자리에서의 여백
const { width, height } = Dimensions.get('window');

/**
 * 지정된 개수만큼의 포아송 디스크 샘플링 좌표를 생성합니다.
 * 좌표가 화면 전체를 채울 수 없다면, 화면의 위쪽부터 채웁니다.
 * @param count 생성할 좌표의 개수
 * @returns 조정된 좌표 배열
 */
const generatePoints = (count: number = 10) => {
  const pds = new PoissonDiskSampling({ 
    shape: [width - 2*margin, height - 2*margin], 
    minDistance: 100
  });
  
  // 포인트 생성
  let points = pds.fill();
  
  // 요청된 개수만큼만 반환
  if (points.length > count) {
    // y 좌표(높이)를 기준으로 정렬하여 위쪽부터 채우기
    points.sort((a, b) => a[1] - b[1]);
    points = points.slice(0, count);
  }
  
  // 여백을 고려하여 좌표 조정
  return points.map((point: number[]) => [point[0] + margin, point[1] + margin]);
};

const generatePointsAll = (minDistance: number = 100)=>{
    const pds = new PoissonDiskSampling({ 
        shape: [width , height], 
        minDistance: minDistance,
      });
      return pds.fill();
}
export {generatePoints, generatePointsAll};
