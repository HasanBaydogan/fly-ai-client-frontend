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

/** Sol taraftaki ağaç görünümlü seçici için tek tek item render eden bileşen. */
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
  const hasChildren = node.subSegments && node.subSegments.length > 0;
  const isSelected = selectedIds.includes(node.segmentId);

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
        className={`tree-item-header ${isSelected ? 'selected' : ''}`}
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

export const TreeSelect = ({
  data,
  setSelected,
  setSegments
}: TreeSelectProps) => {
  // Başlangıçta seçili olanların ID'lerini bul
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

  // Bir segmentin isSelected değerini güncelleyip, alt ağaçlara uygular
  const updateIsSelectedInSegments = (
    segments: TreeNode[],
    segmentId: string,
    isSelected: boolean
  ): TreeNode[] => {
    return segments.map(segment => ({
      ...segment,
      isSelected:
        segment.segmentId === segmentId ? isSelected : segment.isSelected,
      subSegments: updateIsSelectedInSegments(
        segment.subSegments,
        segmentId,
        isSelected
      )
    }));
  };

  // data güncellendiğinde, başlangıç seçili değerleri yeniden yükle
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

  // Checkbox veya segment tıklanınca seçimi toggle et
  const handleToggleSelect = (segmentId: string) => {
    setSelectedIds(prev => {
      const isCurrentlySelected = prev.includes(segmentId);
      const newSelectedIds = isCurrentlySelected
        ? prev.filter(id => id !== segmentId)
        : [...prev, segmentId];

      // segment objelerini de güncelle
      const updatedSegments = updateIsSelectedInSegments(
        data,
        segmentId,
        !isCurrentlySelected
      );
      setSegments(updatedSegments);

      return newSelectedIds;
    });
  };

  /**
   * Sağ tarafta tablo içinde gösterilecek <tr> satırlarını oluşturan fonksiyon.
   * - Üst düzey (level=0) segmentler: Kalın (bold) metin.
   * - Alt düzey segmentler:
   *   - Seçiliyse, `.selected-segment-tag` görünümünde.
   *   - Seçili değilse, normal yazı.
   */
  const renderSelectedSegmentsAsRows = (
    nodes: TreeNode[],
    level: number = 0
  ): JSX.Element[] => {
    return nodes.flatMap(node => {
      const isNodeSelected = selectedIds.includes(node.segmentId);
      const childrenRows = renderSelectedSegmentsAsRows(
        node.subSegments,
        level + 1
      );

      // Eğer bu node seçili değil VE alt node'ların hepsi null/boş döndüyse, hiçbir şey render etme
      if (!isNodeSelected && childrenRows.length === 0) {
        return [];
      }

      // Kendi satırımızı oluşturuyoruz
      let row: JSX.Element;
      if (level === 0) {
        // Üst düzey
        row = (
          <tr key={node.segmentId}>
            <td style={{ paddingLeft: `${level * 20}px`, fontWeight: 'bold' }}>
              {node.segmentName}
            </td>
          </tr>
        );
      } else {
        // Alt düzey
        if (isNodeSelected) {
          // Seçili alt segment => Sizin "selected-segment-tag" görünümünüz
          row = (
            <tr key={node.segmentId}>
              <td style={{ paddingLeft: `${level * 20}px` }}>
                <div className="selected-segment-tag">
                  <span>{node.segmentName}</span>
                  <span
                    className="remove-icon"
                    onClick={() => handleToggleSelect(node.segmentId)}
                  >
                    ×
                  </span>
                </div>
              </td>
            </tr>
          );
        } else {
          // Seçili değil => normal yazı
          row = (
            <tr key={node.segmentId}>
              <td style={{ paddingLeft: `${level * 20}px` }}>
                {node.segmentName}
              </td>
            </tr>
          );
        }
      }

      // Hem kendi satırımızı hem de childrenRows'u döndürüyoruz
      return [row, ...childrenRows];
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
          height: '300px',
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

      {/* SAĞ: Seçili öğelerin tablosu (scroll edilebilir) */}
      <div className="selected-segments" style={{ flex: 1 }}>
        <div style={{ height: '300px', overflowY: 'auto' }}>
          <table className="tables table-sm mb-0">
            <thead>
              <tr>{/* <th>Segment</th> */}</tr>
            </thead>
            <tbody>{renderSelectedSegmentsAsRows(data)}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
