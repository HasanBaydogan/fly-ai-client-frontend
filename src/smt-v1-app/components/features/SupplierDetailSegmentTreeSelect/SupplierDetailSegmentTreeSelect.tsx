import React, { useState } from 'react';
import { FaChevronRight, FaChevronDown, FaTimes } from 'react-icons/fa';
import './TreeSelect.css';

interface TreeNode {
  segmentId: string;
  segmentName: string;
  subSegments: TreeNode[];
}

interface TreeSelectProps {
  data: TreeNode[];
  onSelect: (segmentId: string) => void;
  selectedIds: string[];
}

const TreeSelectItem = ({
  node,
  level = 0,
  onSelect,
  selectedIds
}: {
  node: TreeNode;
  level?: number;
  onSelect: (segmentId: string) => void;
  selectedIds: string[];
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = node.subSegments.length > 0;

  const handleClick = () => {
    if (hasChildren) {
      setIsOpen(!isOpen);
    } else {
      onSelect(node.segmentId);
    }
  };

  return (
    <div className="tree-item" style={{ marginLeft: `${level * 20}px` }}>
      <div
        className={`tree-item-header ${
          !hasChildren && selectedIds.includes(node.segmentId) ? 'selected' : ''
        }`}
        onClick={handleClick}
      >
        {hasChildren ? (
          <span className="tree-icon">
            {isOpen ? <FaChevronDown /> : <FaChevronRight />}
          </span>
        ) : (
          <span className="tree-icon-placeholder" />
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
              onSelect={onSelect}
              selectedIds={selectedIds}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const TreeSelect = ({
  data,
  onSelect,
  selectedIds
}: TreeSelectProps) => {
  // Seçili segment isimlerini bulmak için yardımcı fonksiyon
  const findSegmentName = (id: string, nodes: TreeNode[]): string | null => {
    for (const node of nodes) {
      if (node.segmentId === id) return node.segmentName;
      const found = findSegmentName(id, node.subSegments);
      if (found) return found;
    }
    return null;
  };

  const handleRemoveSegment = (segmentId: string) => {
    onSelect(segmentId);
  };

  return (
    <div className="tree-select-container">
      <div className="selected-segments">
        {selectedIds.map(id => {
          const name = findSegmentName(id, data);
          return (
            name && (
              <div key={id} className="selected-segment-tag">
                <span>{name}</span>
                <FaTimes
                  className="remove-icon"
                  onClick={() => handleRemoveSegment(id)}
                />
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
            onSelect={onSelect}
            selectedIds={selectedIds}
          />
        ))}
      </div>
    </div>
  );
};
