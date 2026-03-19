import { useState, useRef, useEffect } from 'react';
import { CreditCard as Edit2, Minimize2, Cloud, AlertTriangle, XOctagon } from 'lucide-react';
import { NetworkNode } from '../../../types';
import { IconButton } from '../../common/IconButton';
import { ConnectionOverflowMenu } from '../ConnectionOverflowMenu';
import { Connection, AlertSeverity } from '../../../types/connection';

interface ConnectionCardHeaderProps {
  name: string;
  type: string;
  icon: React.ReactNode;
  isEditingName: boolean;
  nodeName: string;
  nameError: string | null;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNameSubmit: () => void;
  onNameKeyDown: (e: React.KeyboardEvent) => void;
  onEditNameClick: () => void;
  onMinimize: () => void;
  connection: Connection;
  onAlertClick?: (e: React.MouseEvent) => void;
}

/**
 * Header component for the connection card
 * Displays the connection name, type, and actions
 */
export function ConnectionCardHeader({
  name,
  type,
  icon,
  isEditingName,
  nodeName,
  nameError,
  onNameChange,
  onNameSubmit,
  onNameKeyDown,
  onEditNameClick,
  onMinimize,
  connection,
  onAlertClick
}: ConnectionCardHeaderProps) {
  const nameInputRef = useRef<HTMLInputElement>(null);

  const alerts = connection.alerts || [];
  const activeAlerts = alerts.filter(a => !a.acknowledged && (a.severity === 'critical' || a.severity === 'warning'));
  const criticalAlerts = activeAlerts.filter(a => a.severity === 'critical');
  const warningAlerts = activeAlerts.filter(a => a.severity === 'warning');

  const getSeverityColor = (): string => {
    if (criticalAlerts.length > 0) return 'bg-red-500';
    return 'bg-amber-500';
  };

  const getSeverityIcon = () => {
    if (criticalAlerts.length > 0) return <XOctagon className="h-4 w-4 text-fw-bodyLight" />;
    return <AlertTriangle className="h-4 w-4 text-fw-bodyLight" />;
  };

  return (
    <div className="p-4 border-b border-fw-secondary">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-fw-wash rounded-lg">
            {icon}
          </div>
          <div>
            {isEditingName ? (
              <div>
                <input
                  ref={nameInputRef}
                  type="text"
                  value={nodeName}
                  onChange={onNameChange}
                  onBlur={onNameSubmit}
                  onKeyDown={onNameKeyDown}
                  className={`w-full px-2 py-1 text-sm font-medium bg-fw-base border ${nameError ? 'border-fw-error' : 'border-fw-active'} rounded focus:outline-none focus:ring-2 focus:ring-fw-active`}
                  placeholder="Enter connection name"
                  onClick={(e) => e.stopPropagation()}
                />
                {nameError && (
                  <p className="text-xs text-fw-error mt-1">{nameError}</p>
                )}
              </div>
            ) : (
              <h3
                className="text-sm font-medium text-fw-heading cursor-text"
                onClick={onEditNameClick}
              >
                {name}
              </h3>
            )}
            <p className="text-xs text-fw-bodyLight">{type}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
          {/* Alert Indicator */}
          {activeAlerts.length > 0 && (
            <button
              onClick={onAlertClick}
              className="relative flex items-center justify-center h-8 w-8 rounded-lg hover:bg-fw-wash transition-colors"
              title={`${activeAlerts.length} active alert${activeAlerts.length > 1 ? 's' : ''}`}
            >
              {getSeverityIcon()}
              <span className={`absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full ${getSeverityColor()} text-white text-[10px] font-semibold shadow-sm`}>
                {activeAlerts.length}
              </span>
            </button>
          )}

          <IconButton
            icon={<Minimize2 className="h-4 w-4" />}
            onClick={onMinimize}
            variant="ghost"
            size="sm"
            title="Minimize"
          />
          <ConnectionOverflowMenu connection={connection} />
        </div>
      </div>
    </div>
  );
}