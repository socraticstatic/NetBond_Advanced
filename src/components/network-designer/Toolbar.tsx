import { useEffect, useRef, useState } from 'react';
import { LayoutGrid, Share2, Server, Cloud, Database, Network, Plus, Play, Save, Undo2, Trash2, Check, Maximize2, Minimize2, FileDown, FolderOpen } from 'lucide-react';
import { NODE_CATEGORIES } from './constants/nodeTypes';

interface ToolbarProps {
  onAddNode: (type: string, subType?: string, meta?: Record<string, string>) => void;
  onToggleEdgeCreation: () => void;
  isCreatingEdge: boolean;
  onUndo: () => void;
  canUndo: boolean;
  onClearCanvas: () => void;
  onToggleMaximize: () => void;
  isMaximized: boolean;
  onCreateConnections: () => void;
  hasConnections: boolean;
  onOpenTemplates: () => void;
  onOpenSaveTemplate: () => void;
  onExportPDF: () => void;
  onSaveDraft: () => void;
  onOpenDrafts: () => void;
}

type MenuKey = 'function' | 'cloud' | 'datacenter' | 'network' | null;

export function Toolbar({
  onAddNode,
  onToggleEdgeCreation,
  isCreatingEdge,
  onUndo,
  canUndo,
  onClearCanvas,
  onCreateConnections,
  hasConnections,
  onOpenTemplates,
  onOpenSaveTemplate,
  onExportPDF,
  onSaveDraft,
  onOpenDrafts,
  onToggleMaximize,
  isMaximized,
}: ToolbarProps) {
  const [openMenu, setOpenMenu] = useState<MenuKey>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    }
    if (openMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenu]);

  function toggleMenu(key: MenuKey) {
    setOpenMenu(prev => prev === key ? null : key);
  }

  function handleSelect(categoryKey: string, item: { type?: string; provider?: string }) {
    setOpenMenu(null);
    if (categoryKey === 'cloud' && item.provider) {
      onAddNode('destination', item.provider, { cloudProvider: item.provider });
    } else if (categoryKey === 'datacenter' && item.provider) {
      onAddNode('datacenter', item.provider, { dcProvider: item.provider });
    } else if (categoryKey === 'network' && item.type) {
      onAddNode('network', item.type);
    } else if (categoryKey === 'function' && item.type) {
      onAddNode('function', item.type);
    }
  }

  const hasNodes = hasConnections; // edges exist means nodes exist

  // Cloud_Designer toolbar layout:
  // Choose | Cloud Router | Function ▾ | Cloud ▾ | Datacenter ▾ | Network ▾ | + Connection | Play | Save | Undo | Clear | Create

  return (
    <div ref={menuRef} className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 px-3 py-2 rounded-full shadow-lg border border-fw-secondary bg-fw-base">

      {/* Choose (Templates) */}
      <button
        onClick={onOpenTemplates}
        title="Choose template"
        className="flex items-center gap-1.5 px-3 py-1.5 text-figma-base font-medium text-fw-heading hover:bg-fw-wash rounded-full transition-colors"
      >
        <LayoutGrid className="h-4 w-4" />
        <span>Choose</span>
      </button>

      <div className="w-px h-5 bg-fw-secondary mx-1" />

      {/* Cloud Router - direct add */}
      <button
        onClick={() => onAddNode('function', 'router', {})}
        title="Add Cloud Router"
        className="flex items-center gap-1.5 px-3 py-1.5 text-figma-base font-medium text-fw-heading hover:bg-fw-wash rounded-full transition-colors whitespace-nowrap"
      >
        <Share2 className="h-4 w-4 flex-shrink-0" />
        <span>Cloud Router</span>
      </button>

      <div className="w-px h-5 bg-fw-secondary mx-1" />

      {/* Function dropdown */}
      <div className="relative">
        <button
          onClick={() => toggleMenu('function')}
          title="Add network function"
          className={`flex items-center gap-1.5 px-3 py-1.5 text-figma-base font-medium rounded-full transition-colors ${
            openMenu === 'function' ? 'text-fw-link bg-fw-accent' : 'text-fw-heading hover:bg-fw-wash'
          }`}
        >
          <Server className="h-4 w-4" />
          <span>Function</span>
        </button>
        {openMenu === 'function' && (
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 bg-fw-base rounded-xl shadow-lg border border-fw-secondary z-30 overflow-hidden py-1">
            {NODE_CATEGORIES.function.items.map((item) => (
              <button
                key={item.type}
                onClick={() => handleSelect('function', item)}
                className="w-full text-left px-3 py-1.5 text-figma-sm text-fw-heading hover:bg-fw-wash transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Cloud dropdown */}
      <div className="relative">
        <button
          onClick={() => toggleMenu('cloud')}
          title="Add cloud destination"
          className={`flex items-center gap-1.5 px-3 py-1.5 text-figma-base font-medium rounded-full transition-colors ${
            openMenu === 'cloud' ? 'text-fw-link bg-fw-accent' : 'text-fw-heading hover:bg-fw-wash'
          }`}
        >
          <Cloud className="h-4 w-4" />
          <span>Cloud</span>
        </button>
        {openMenu === 'cloud' && (
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-52 bg-fw-base rounded-xl shadow-lg border border-fw-secondary z-30 overflow-hidden py-1">
            {NODE_CATEGORIES.cloud.items.map((item) => (
              <button
                key={item.provider}
                onClick={() => handleSelect('cloud', item)}
                className="w-full text-left px-3 py-1.5 text-figma-sm text-fw-heading hover:bg-fw-wash transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Datacenter dropdown */}
      <div className="relative">
        <button
          onClick={() => toggleMenu('datacenter')}
          title="Add datacenter"
          className={`flex items-center gap-1.5 px-3 py-1.5 text-figma-base font-medium rounded-full transition-colors ${
            openMenu === 'datacenter' ? 'text-fw-link bg-fw-accent' : 'text-fw-heading hover:bg-fw-wash'
          }`}
        >
          <Database className="h-4 w-4" />
          <span>Datacenter</span>
        </button>
        {openMenu === 'datacenter' && (
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 bg-fw-base rounded-xl shadow-lg border border-fw-secondary z-30 overflow-hidden py-1">
            {NODE_CATEGORIES.datacenter.items.map((item) => (
              <button
                key={item.provider}
                onClick={() => handleSelect('datacenter', item)}
                className="w-full text-left px-3 py-1.5 text-figma-sm text-fw-heading hover:bg-fw-wash transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Network dropdown */}
      <div className="relative">
        <button
          onClick={() => toggleMenu('network')}
          title="Add network type"
          className={`flex items-center gap-1.5 px-3 py-1.5 text-figma-base font-medium rounded-full transition-colors ${
            openMenu === 'network' ? 'text-fw-link bg-fw-accent' : 'text-fw-heading hover:bg-fw-wash'
          }`}
        >
          <Network className="h-4 w-4" />
          <span>Network</span>
        </button>
        {openMenu === 'network' && (
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-56 bg-fw-base rounded-xl shadow-lg border border-fw-secondary z-30 overflow-hidden py-1">
            {NODE_CATEGORIES.network.items.map((item) => (
              <button
                key={item.type}
                onClick={() => handleSelect('network', item)}
                className="w-full text-left px-3 py-1.5 text-figma-sm text-fw-heading hover:bg-fw-wash transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="w-px h-5 bg-fw-secondary mx-1" />

      {/* Connection toggle */}
      <button
        onClick={onToggleEdgeCreation}
        title={isCreatingEdge ? 'Click nodes to connect. Toggle when done.' : 'Connect nodes'}
        className={`p-2 rounded-full transition-colors ${
          isCreatingEdge
            ? 'text-fw-link bg-fw-accent'
            : 'text-fw-heading hover:bg-fw-wash'
        }`}
      >
        <Plus className="h-4 w-4" />
      </button>

      <div className="w-px h-5 bg-fw-secondary mx-1" />

      {/* Run Scenario (Play) */}
      <button
        disabled={!hasConnections}
        title="Run scenario"
        className={`p-2 rounded-full transition-colors ${
          hasConnections ? 'text-fw-heading hover:bg-fw-wash' : 'text-fw-disabled cursor-not-allowed'
        }`}
      >
        <Play className="h-4 w-4" />
      </button>

      {/* Save Template */}
      <button
        onClick={onOpenSaveTemplate}
        disabled={!hasConnections}
        title="Save template"
        className={`p-2 rounded-full transition-colors ${
          hasConnections ? 'text-fw-heading hover:bg-fw-wash' : 'text-fw-disabled cursor-not-allowed'
        }`}
      >
        <Save className="h-4 w-4" />
      </button>

      {/* Save Draft */}
      <button
        onClick={onSaveDraft}
        disabled={!hasConnections}
        title="Save draft"
        className={`flex items-center gap-1.5 px-3 py-1.5 text-figma-base font-medium rounded-full transition-colors ${
          hasConnections ? 'text-fw-heading hover:bg-fw-wash' : 'text-fw-disabled cursor-not-allowed'
        }`}
      >
        <Save className="h-4 w-4" />
        <span>Draft</span>
      </button>

      {/* Open Drafts */}
      <button
        onClick={onOpenDrafts}
        title="Open saved drafts"
        className="flex items-center gap-1.5 px-3 py-1.5 text-figma-base font-medium text-fw-heading hover:bg-fw-wash rounded-full transition-colors"
      >
        <FolderOpen className="h-4 w-4" />
        <span>Drafts</span>
      </button>

      <div className="w-px h-5 bg-fw-secondary mx-1" />

      {/* Undo */}
      <button
        onClick={onUndo}
        disabled={!canUndo}
        title="Undo"
        className={`p-2 rounded-full transition-colors ${
          canUndo ? 'text-fw-heading hover:bg-fw-wash' : 'text-fw-disabled cursor-not-allowed'
        }`}
      >
        <Undo2 className="h-4 w-4" />
      </button>

      {/* Clear Canvas */}
      <button
        onClick={onClearCanvas}
        disabled={!hasConnections}
        title="Clear canvas"
        className={`p-2 rounded-full transition-colors ${
          hasConnections ? 'text-fw-heading hover:bg-fw-wash' : 'text-fw-disabled cursor-not-allowed'
        }`}
      >
        <Trash2 className="h-4 w-4" />
      </button>

      <div className="w-px h-5 bg-fw-secondary mx-1" />

      {/* Export PDF */}
      <button
        onClick={onExportPDF}
        disabled={!hasConnections}
        title="Export PDF"
        className={`p-2 rounded-full transition-colors ${
          hasConnections ? 'text-fw-heading hover:bg-fw-wash' : 'text-fw-disabled cursor-not-allowed'
        }`}
      >
        <FileDown className="h-4 w-4" />
      </button>

      {/* Maximize / Minimize */}
      <button
        onClick={onToggleMaximize}
        title={isMaximized ? 'Minimize' : 'Maximize'}
        className="p-2 rounded-full transition-colors text-fw-heading hover:bg-fw-wash"
      >
        {isMaximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
      </button>

      <div className="w-px h-5 bg-fw-secondary mx-1" />

      {/* Create Connections */}
      <button
        onClick={onCreateConnections}
        disabled={!hasConnections}
        title="Create connections"
        className={`p-2 rounded-full transition-colors ${
          hasConnections ? 'text-fw-heading hover:bg-fw-wash' : 'text-fw-disabled cursor-not-allowed'
        }`}
      >
        <Check className="h-4 w-4" />
      </button>
    </div>
  );
}
