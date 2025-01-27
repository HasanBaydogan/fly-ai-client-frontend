import React, { useState, useEffect } from 'react';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa';
import './TreeSelect.css';

interface TreeNode {
  segmentId: string;
  segmentName: string;
  isSelected?: boolean;
  subSegments: TreeNode[];
}

interface TreeSelectProps {
  data: TreeNode[];
  onSelect: (selectedIds: string[]) => void;
}

const TreeSelectItem = ({
  node,
  level = 0,
  selectedIds,
  onToggleSelect
}: {
  node: TreeNode;
  level?: number;
  selectedIds: string[];
  onToggleSelect: (segmentId: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = node.subSegments.length > 0;
  const isSelected = selectedIds.includes(node.segmentId);

  useEffect(() => {
    if (node.isSelected) {
      onToggleSelect(node.segmentId);
    }
  }, []);

  const handleClick = () => {
    if (hasChildren) {
      setIsOpen(!isOpen);
    } else {
      onToggleSelect(node.segmentId);
    }
  };

  return (
    <div className="tree-item" style={{ marginLeft: `${level * 20}px` }}>
      <div
        className={`tree-item-header ${
          !hasChildren && isSelected ? 'selected' : ''
        }`}
        onClick={handleClick}
      >
        {hasChildren ? (
          <span className="tree-icon">
            {isOpen ? <FaChevronDown /> : <FaChevronRight />}
          </span>
        ) : (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(node.segmentId)}
            onClick={e => e.stopPropagation()}
          />
        )}
        <span className="tree-label">{node.segmentName}</span>
      </div>
      {isOpen && hasChildren && (
        <div className="tree-children">
          {node.subSegments.map(child => (
            <TreeSelectItem
              key={child.segmentId}
              node={child}
              level={level + 1}
              selectedIds={selectedIds}
              onToggleSelect={onToggleSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const TreeSelect = ({ data, onSelect }: TreeSelectProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleToggleSelect = (segmentId: string) => {
    setSelectedIds(prev => {
      const newSelected = prev.includes(segmentId)
        ? prev.filter(id => id !== segmentId)
        : [...prev, segmentId];
      onSelect(newSelected);
      return newSelected;
    });
  };

  // İlk yüklemede isSelected true olanları seç
  useEffect(() => {
    const getInitialSelectedIds = (nodes: TreeNode[]): string[] => {
      return nodes.reduce((acc: string[], node) => {
        if (node.isSelected) {
          acc.push(node.segmentId);
        }
        if (node.subSegments.length > 0) {
          acc.push(...getInitialSelectedIds(node.subSegments));
        }
        return acc;
      }, []);
    };

    const initialSelected = getInitialSelectedIds(data);
    setSelectedIds(initialSelected);
    onSelect(initialSelected);
  }, [data]);

  return (
    <div className="tree-select-container">
      <div className="selected-segments">
        {selectedIds.map(id => {
          const findSegmentName = (nodes: TreeNode[]): string | null => {
            for (const node of nodes) {
              if (node.segmentId === id) return node.segmentName;
              const found = findSegmentName(node.subSegments);
              if (found) return found;
            }
            return null;
          };

          const name = findSegmentName(data);
          return (
            name && (
              <div key={id} className="selected-segment-tag">
                <span>{name}</span>
                <span
                  className="remove-icon"
                  onClick={() => handleToggleSelect(id)}
                >
                  ×
                </span>
              </div>
            )
          );
        })}
      </div>
      <div className="tree-select">
        {data.map(node => (
          <TreeSelectItem
            key={node.segmentId}
            node={node}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
          />
        ))}
      </div>
    </div>
  );
};
