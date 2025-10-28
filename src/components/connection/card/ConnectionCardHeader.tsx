import { useState, useRef, useEffect } from 'react';
import { Edit2, Minimize2 } from 'lucide-react';
import { NetworkNode } from '../../../types';
import { IconButton } from '../../common/IconButton';
import { ConnectionOverflowMenu } from '../ConnectionOverflowMenu';

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
  connection: any;
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
  connection
}: ConnectionCardHeaderProps) {
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Get provider logo based on provider name
  const getProviderLogo = () => {
    if (!connection.provider) return icon;
    
    switch(connection.provider.toLowerCase()) {
      case 'aws':
        return (
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" 
            alt="AWS" 
            className="h-6 w-6" 
          />
        );
      case 'azure':
        return (
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Microsoft_Azure.svg" 
            alt="Azure" 
            className="h-6 w-6" 
          />
        );
      case 'google':
        return (
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg" 
            alt="Google Cloud" 
            className="h-6 w-6" 
          />
        );
      default:
        return icon;
    }
  };

  return (
    <div className="p-4 border-b border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gray-50 rounded-lg">
            {getProviderLogo()}
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
                  className={`w-full px-2 py-1 text-sm font-medium bg-white border ${nameError ? 'border-red-500' : 'border-brand-blue'} rounded focus:outline-none focus:ring-2 focus:ring-brand-blue`}
                  placeholder="Enter connection name"
                  onClick={(e) => e.stopPropagation()}
                />
                {nameError && (
                  <p className="text-xs text-red-500 mt-1">{nameError}</p>
                )}
              </div>
            ) : (
              <h3 
                className="text-sm font-medium text-gray-900 cursor-text"
                onClick={onEditNameClick}
              >
                {name}
              </h3>
            )}
            <p className="text-xs text-gray-500">{type}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
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