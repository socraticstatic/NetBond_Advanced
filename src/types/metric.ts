interface Metric {
  id: string;
  name: string;
  description: string;
  category: string;
  dataType: 'number' | 'percentage' | 'string';
  aggregation?: 'avg' | 'sum' | 'min' | 'max' | 'count';
  unit?: string;
}

export interface MetricGroup {
  id: string;
  name: string;
  metrics: Metric[];
}

export interface ThresholdRule {
  id: string;
  metricId: string;
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte' | 'between';
  value1: number;
  value2?: number;
  severity: 'info' | 'warning' | 'critical';
  action?: 'notify' | 'alert' | 'escalate';
}