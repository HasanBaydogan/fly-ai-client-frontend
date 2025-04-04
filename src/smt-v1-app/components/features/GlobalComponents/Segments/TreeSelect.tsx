import React, { useState, useEffect } from 'react';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa';
import './TreeSelect.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export interface TreeNode {
  segmentId: string;
  segmentName: string;
  isSelected?: boolean;
  subSegments: TreeNode[];
}

interface TreeSelectProps {
  data: TreeNode[];
  setSelected: (selectedIds: string[]) => void;
  setSegments: (segments: TreeNode[]) => void;
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
  onToggleSelect: (node: TreeNode) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = node.subSegments && node.subSegments.length > 0;
  const isSelected = selectedIds.includes(node.segmentId);

  return (
    <div className="tree-item" style={{ marginLeft: `${level * 20}px` }}>
      <div className={`tree-item-header ${isSelected ? 'selected' : ''}`}>
        {hasChildren && (
          <span className="tree-icon" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FaChevronDown /> : <FaChevronRight />}
          </span>
        )}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(node)}
          onClick={e => e.stopPropagation()}
        />
        <span className="tree-label">{node.segmentName}</span>
      </div>
      {hasChildren && isOpen && (
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

export const TreeSelect = ({
  data,
  setSelected,
  setSegments
}: TreeSelectProps) => {
  const getAllSegmentIds = (node: TreeNode): string[] => {
    let ids = [node.segmentId];
    if (node.subSegments && node.subSegments.length > 0) {
      node.subSegments.forEach(child => {
        ids = [...ids, ...getAllSegmentIds(child)];
      });
    }
    return ids;
  };

  const areAllSubsegmentsSelected = (
    node: TreeNode,
    selectedIds: string[]
  ): boolean => {
    if (!node.subSegments || node.subSegments.length === 0) {
      return false;
    }
    return node.subSegments.every(subsegment => {
      const allSubsegmentIds = getAllSegmentIds(subsegment);
      return allSubsegmentIds.every(id => selectedIds.includes(id));
    });
  };

  const areAnySubsegmentsSelected = (
    node: TreeNode,
    selectedIds: string[]
  ): boolean => {
    if (!node.subSegments || node.subSegments.length === 0) {
      return false;
    }
    return node.subSegments.some(subsegment => {
      const allSubsegmentIds = getAllSegmentIds(subsegment);
      return allSubsegmentIds.some(id => selectedIds.includes(id));
    });
  };

  const updateParentSelections = (
    nodes: TreeNode[],
    selectedIds: string[]
  ): string[] => {
    const updatedIds = new Set(selectedIds);

    const processNode = (node: TreeNode): void => {
      if (!node.subSegments || node.subSegments.length === 0) {
        return;
      }

      node.subSegments.forEach(processNode);

      const allChildrenSelected = areAllSubsegmentsSelected(
        node,
        Array.from(updatedIds)
      );
      const anyChildrenDeselected = !areAllSubsegmentsSelected(
        node,
        Array.from(updatedIds)
      );

      if (allChildrenSelected) {
        updatedIds.add(node.segmentId);
      } else if (anyChildrenDeselected) {
        updatedIds.delete(node.segmentId);
      }
    };

    nodes.forEach(processNode);

    return Array.from(updatedIds);
  };

  const updateSelectionInTree = (
    segments: TreeNode[],
    idsToUpdate: string[],
    isSelected: boolean
  ): TreeNode[] => {
    return segments.map(segment => ({
      ...segment,
      isSelected:
        segment.subSegments && segment.subSegments.length > 0
          ? null
          : idsToUpdate.includes(segment.segmentId)
          ? isSelected
          : segment.isSelected,
      subSegments: updateSelectionInTree(
        segment.subSegments,
        idsToUpdate,
        isSelected
      )
    }));
  };

  const getInitialSelectedIds = (nodes: TreeNode[]): string[] => {
    return nodes.reduce((acc: string[], node: TreeNode) => {
      if (node.isSelected) {
        acc.push(node.segmentId);
      }
      if (node.subSegments && node.subSegments.length > 0) {
        acc.push(...getInitialSelectedIds(node.subSegments));
      }
      return acc;
    }, []);
  };

  const [selectedIds, setSelectedIds] = useState<string[]>(() =>
    getInitialSelectedIds(data)
  );

  useEffect(() => {
    const initialSelected = getInitialSelectedIds(data);
    if (initialSelected.length > 0 && selectedIds.length === 0) {
      setSelectedIds(initialSelected);
    }
  }, [data, selectedIds]);

  useEffect(() => {
    setSelected(selectedIds);
  }, [selectedIds, setSelected]);

  const handleToggleSelect = (node: TreeNode) => {
    const allIds = getAllSegmentIds(node);
    const isCurrentlySelected = selectedIds.includes(node.segmentId);
    let newSelectedIds;
    if (isCurrentlySelected) {
      newSelectedIds = selectedIds.filter(id => !allIds.includes(id));
    } else {
      newSelectedIds = Array.from(new Set([...selectedIds, ...allIds]));
    }
    newSelectedIds = updateParentSelections(data, newSelectedIds);
    const updatedSegments = updateSelectionInTree(
      data,
      allIds,
      !isCurrentlySelected
    );
    setSegments(updatedSegments);
    setSelectedIds(newSelectedIds);
  };

  const renderSelectedSegmentsAsRows = (
    nodes: TreeNode[],
    level: number = 0
  ): JSX.Element[] => {
    return nodes.flatMap(node => {
      const hasChildren = node.subSegments && node.subSegments.length > 0;
      const childrenRows = renderSelectedSegmentsAsRows(
        node.subSegments,
        level + 1
      );

      if (hasChildren) {
        if (childrenRows.length === 0) {
          return [];
        }
        const row = (
          <tr key={node.segmentId}>
            <td style={{ paddingLeft: `${level * 20}px`, fontWeight: 'bold' }}>
              {node.segmentName}
            </td>
          </tr>
        );
        return [row, ...childrenRows];
      } else {
        if (!selectedIds.includes(node.segmentId)) {
          return [];
        }
        const row = (
          <tr key={node.segmentId}>
            <td style={{ paddingLeft: `${level * 20}px` }}>
              <div className="selected-segment-tag">
                <span>{node.segmentName}</span>
                <span
                  className="remove-icon"
                  onClick={() => handleToggleSelect(node)}
                >
                  ×
                </span>
              </div>
            </td>
          </tr>
        );
        return [row];
      }
    });
  };

  return (
    <div
      className="tree-select-container p-2"
      style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}
    >
      <div
        className="tree-select"
        style={{
          flex: 2,
          height: '500px',
          overflowY: 'auto',
          border: '1px solid #ddd',
          borderRadius: '4px',
          padding: '8px'
        }}
      >
        {data.map(node => (
          <TreeSelectItem
            key={node.segmentId}
            node={node}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
          />
        ))}
      </div>

      <div className="selected-segments" style={{ flex: 1 }}>
        <div style={{ height: '500px', overflowY: 'auto' }}>
          <table className="tables table-sm mb-0">
            <thead>
              <tr></tr>
            </thead>
            <tbody>{renderSelectedSegmentsAsRows(data)}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
