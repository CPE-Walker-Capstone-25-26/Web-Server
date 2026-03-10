export interface Run {
    id: string;
    userId: string;
    began: Date;
    distanceKm?: number;
    duration?: number;
    steps?: number;
    
    dataLeft?: number[];  
    avgLeft?: number;
    dataRight?: number[];
    avgRight?: number;
  }