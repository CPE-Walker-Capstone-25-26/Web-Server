export interface Run {
    id: string;
    userId: string;
    began: Date;
    distanceKm?: number;
    duration?: number;
    
    dataLeft?: number[];  
    avgLeft?: number;
    dataRight?: number[];
    avgRight?: number;
  }