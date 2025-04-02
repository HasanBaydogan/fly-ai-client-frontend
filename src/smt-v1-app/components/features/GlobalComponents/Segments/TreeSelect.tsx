import React, { useState, useEffect } from 'react';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa';
import './TreeSelect.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export interface TreeNode {
  segmentId: string;
  segmentName: string;
  isSelected?: boolean; // true: seçili, false: seçili değil
  subSegments: TreeNode[];
}

interface TreeSelectProps {
  data: TreeNode[];
  setSelected: (selectedIds: string[]) => void;
  setSegments: (segments: TreeNode[]) => void;
}

/** Her seviyedeki segment için checkbox eklenmiş bileşen */
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
  // Bir node ve tüm alt node'ların ID'lerini döndüren yardımcı fonksiyon
  const getAllSegmentIds = (node: TreeNode): string[] => {
    let ids = [node.segmentId];
    if (node.subSegments && node.subSegments.length > 0) {
      node.subSegments.forEach(child => {
        ids = [...ids, ...getAllSegmentIds(child)];
      });
    }
    return ids;
  };

  // Belirli ID'ler için isSelected değerini güncelleyen yardımcı fonksiyon
  const updateSelectionInTree = (
    segments: TreeNode[],
    idsToUpdate: string[],
    isSelected: boolean
  ): TreeNode[] => {
    return segments.map(segment => ({
      ...segment,
      // Eğer segmentin alt segmenti varsa, isSelected değeri null olarak kalır.
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

  // Başlangıçta seçili olan segmentlerin ID'lerini bulur
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

  // data güncellendiğinde seçili değerleri yeniden yükle
  useEffect(() => {
    const initialSelected = getInitialSelectedIds(data);
    if (initialSelected.length > 0 && selectedIds.length === 0) {
      setSelectedIds(initialSelected);
    }
  }, [data, selectedIds]);

  // Seçili ID listesini parent bileşene bildir
  useEffect(() => {
    setSelected(selectedIds);
  }, [selectedIds, setSelected]);

  // Checkbox tıklanma işlemi: eğer üst segment seçilirse, altındaki tüm segmentler de seçilsin (ve tersine)
  const handleToggleSelect = (node: TreeNode) => {
    const allIds = getAllSegmentIds(node);
    const isCurrentlySelected = selectedIds.includes(node.segmentId);
    let newSelectedIds;
    if (isCurrentlySelected) {
      newSelectedIds = selectedIds.filter(id => !allIds.includes(id));
    } else {
      newSelectedIds = Array.from(new Set([...selectedIds, ...allIds]));
    }
    const updatedSegments = updateSelectionInTree(
      data,
      allIds,
      !isCurrentlySelected
    );
    setSegments(updatedSegments);
    setSelectedIds(newSelectedIds);
  };

  /**
   * Sağ tarafta tablo içinde gösterilecek <tr> satırlarını oluşturur.
   * Üst seviye segmentler kalın, alt segmentler ise seçili ise etiketli (selected-segment-tag), değilse normal yazı şeklinde render edilir.
   */
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
        // Eğer alt segmentlerden hiçbiri seçili değilse, başlığı göstermiyoruz.
        if (childrenRows.length === 0) {
          return [];
        }
        // Alt segmenti varsa, her durumda başlık olarak render et (kalın yazı)
        const row = (
          <tr key={node.segmentId}>
            <td style={{ paddingLeft: `${level * 20}px`, fontWeight: 'bold' }}>
              {node.segmentName}
            </td>
          </tr>
        );
        return [row, ...childrenRows];
      } else {
        // Eğer segmentin alt segmenti yoksa, yalnızca seçili ise badge olarak render et
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
      {/* SOL: Ağaç görünümü */}
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

      {/* SAĞ: Seçili öğelerin tablosu */}
      <div className="selected-segments" style={{ flex: 1 }}>
        <div style={{ height: '500px', overflowY: 'auto' }}>
          <table className="tables table-sm mb-0">
            <thead>
              <tr>{/* Başlık eklemek isterseniz buraya ekleyebilirsiniz */}</tr>
            </thead>
            <tbody>{renderSelectedSegmentsAsRows(data)}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
