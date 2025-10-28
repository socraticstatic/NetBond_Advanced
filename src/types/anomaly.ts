export type AnomalySeverity = 'critical' | 'warning' | 'info';
export type AnomalyStatus = 'active' | 'acknowledged' | 'resolved';
export type AnomalyMetricType = 'latency' | 'bandwidth' | 'packet_loss' | 'jitter' | 'error_rate' | 'throughput' | 'uptime';

export interface Anomaly {
  id: string;
  connectionId: string;
  connectionName: string;
  metricType: AnomalyMetricType;
  severity: AnomalySeverity;
  status: AnomalyStatus;
  detectedAt: string;
  resolvedAt?: string;
  baselineValue: number;
  detectedValue: number;
  deviation: number;
  confidenceScore: number;
  title: string;
  description: string;
  aiInsight: string;
  recommendation?: string;
  pattern?: 'spike' | 'gradual_increase' | 'gradual_decrease' | 'cyclic_change' | 'sudden_drop';
  correlatedAnomalies?: string[];
  timeSeriesData: {
    timestamp: string;
    value: number;
    isAnomaly: boolean;
  }[];
}

export interface AnomalyBaseline {
  metricType: AnomalyMetricType;
  connectionId: string;
  normalRange: {
    min: number;
    max: number;
    mean: number;
    stdDev: number;
  };
  lastUpdated: string;
  sampleSize: number;
  confidenceBand: number;
}

export interface AnomalyInsight {
  id: string;
  type: 'pattern' | 'correlation' | 'prediction' | 'recommendation';
  title: string;
  description: string;
  affectedConnections: string[];
  severity: AnomalySeverity;
  confidenceScore: number;
  actionable: boolean;
  suggestedActions?: string[];
}

export interface AnomalyDetectionStats {
  totalDetected: number;
  activeCount: number;
  resolvedCount: number;
  criticalCount: number;
  warningCount: number;
  infoCount: number;
  averageConfidence: number;
  detectionRate: number;
  falsePositiveRate: number;
  trendsLastWeek: {
    date: string;
    count: number;
  }[];
}

export interface AnomalyFilter {
  severity?: AnomalySeverity[];
  status?: AnomalyStatus[];
  connectionIds?: string[];
  metricTypes?: AnomalyMetricType[];
  dateRange?: {
    start: string;
    end: string;
  };
}
