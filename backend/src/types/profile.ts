export type FarmType =
  | 'crop'
  | 'livestock'
  | 'mixed'
  | 'poultry'
  | 'dairy'
  | 'aquaculture'
  | 'greenhouse'
  | 'orchard';

export interface RiskSummaryRequest {
  farm_type: FarmType;
  activities?: string[];
}

export interface RiskSummaryResponse {
  summary: string;
  farm_type: string;
}
