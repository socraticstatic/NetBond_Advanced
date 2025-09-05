import { useState } from 'react';
import { Button } from '../../../common/Button';

export function BandwidthScalingPolicy() {
  const [scaleUpThreshold, setScaleUpThreshold] = useState(80);
  const [scaleDownThreshold, setScaleDownThreshold] = useState(20);
  const [minBandwidth, setMinBandwidth] = useState(100);
  const [maxBandwidth, setMaxBandwidth] = useState(1000);
  const [peakHoursStart, setPeakHoursStart] = useState("");
  const [peakHoursEnd, setPeakHoursEnd] = useState("");

  return (
    <div className="space-y-8">
      <div className="card">
        <div className="card-header bg-gray-50">
          <h2 className="text-lg font-medium text-gray-900">Bandwidth Scaling Configuration</h2>
        </div>
        
        <div className="p-6">
          <div className="bg-brand-lightBlue border border-brand-blue/20 rounded-lg p-4 mb-6">
            <p className="text-sm text-brand-blue">
              Configure automatic bandwidth scaling policies to optimize network performance and cost efficiency.
            </p>
          </div>

          <div className="space-y-8">
            {/* Auto-scaling Thresholds */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Auto-scaling Thresholds</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Scale Up Threshold (%)
                  </label>
                  <input
                    type="number"
                    value={scaleUpThreshold}
                    onChange={(e) => setScaleUpThreshold(parseInt(e.target.value) || 0)}
                    className="form-control"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Scale Down Threshold (%)
                  </label>
                  <input
                    type="number"
                    value={scaleDownThreshold}
                    onChange={(e) => setScaleDownThreshold(parseInt(e.target.value) || 0)}
                    className="form-control"
                  />
                </div>
              </div>
            </div>

            {/* Scaling Limits */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Scaling Limits</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Bandwidth (Mbps)
                  </label>
                  <input
                    type="number"
                    value={minBandwidth}
                    onChange={(e) => setMinBandwidth(parseInt(e.target.value) || 0)}
                    className="form-control"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum Bandwidth (Mbps)
                  </label>
                  <input
                    type="number"
                    value={maxBandwidth}
                    onChange={(e) => setMaxBandwidth(parseInt(e.target.value) || 0)}
                    className="form-control"
                  />
                </div>
              </div>
            </div>

            {/* Scaling Schedule */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Scaling Schedule</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Peak Hours Start
                  </label>
                  <input
                    type="time"
                    value={peakHoursStart}
                    onChange={(e) => setPeakHoursStart(e.target.value)}
                    className="form-control"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Peak Hours End
                  </label>
                  <input
                    type="time"
                    value={peakHoursEnd}
                    onChange={(e) => setPeakHoursEnd(e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 mt-6">
            <Button
              variant="outline"
            >
              Reset
            </Button>
            <Button
              variant="primary"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}