// import React, { useState, useEffect } from 'react';
// import { FaChevronRight, FaChevronDown } from 'react-icons/fa';
// import './TreeSelect.css';

// export interface TreeNode {
//   segmentId: string;
//   segmentName: string;
//   isSelected?: boolean;
//   subSegments: TreeNode[];
// }

// interface TreeSelectProps {
//   data: TreeNode[];
//   setSelected: (selectedIds: string[]) => void;
//   setSegments: (segments: TreeNode[]) => void; // `segments` state'ini de güncellemek için
// }

// const TreeSelectItem = ({
//   node,
//   level = 0,
//   selectedIds,
//   onToggleSelect
// }: {
//   node: TreeNode;
//   level?: number;
//   selectedIds: string[];
//   onToggleSelect: (segmentId: string) => void;
// }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const hasChildren = node.subSegments && node.subSegments.length > 0;
//   const isSelected = selectedIds.includes(node.segmentId);

//   const handleClick = () => {
//     if (hasChildren) {
//       setIsOpen(!isOpen);
//     } else {
//       onToggleSelect(node.segmentId);
//     }
//   };

//   return (
//     <div className="tree-item" style={{ marginLeft: `${level * 20}px` }}>
//       <div
//         className={`tree-item-header ${isSelected ? 'selected' : ''}`}
//         onClick={handleClick}
//       >
//         {hasChildren ? (
//           <span className="tree-icon">
//             {isOpen ? <FaChevronDown /> : <FaChevronRight />}
//           </span>
//         ) : (
//           <input
//             type="checkbox"
//             checked={isSelected}
//             onChange={() => onToggleSelect(node.segmentId)}
//             onClick={e => e.stopPropagation()}
//           />
//         )}
//         <span className="tree-label">{node.segmentName}</span>
//       </div>
//       {isOpen && hasChildren && (
//         <div className="tree-children">
//           {node.subSegments.map(child => (
//             <TreeSelectItem
//               key={child.segmentId}
//               node={child}
//               level={level + 1}
//               selectedIds={selectedIds}
//               onToggleSelect={onToggleSelect}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export const TreeSelect = ({
//   data,
//   setSelected,
//   setSegments
// }: TreeSelectProps) => {
//   // isSelected: true olanları başlangıçta bul
//   const getInitialSelectedIds = (nodes: TreeNode[]): string[] => {
//     return nodes.reduce((acc: string[], node: TreeNode) => {
//       if (node.isSelected === true) {
//         acc.push(node.segmentId);
//       }
//       if (node.subSegments && node.subSegments.length > 0) {
//         acc.push(...getInitialSelectedIds(node.subSegments));
//       }
//       return acc;
//     }, []);
//   };

//   // Başlangıç seçimleri
//   const [selectedIds, setSelectedIds] = useState<string[]>(() =>
//     getInitialSelectedIds(data)
//   );

//   // Yeni bir segment seçildiğinde veya kaldırıldığında `isSelected` değerini günceller.
//   const updateIsSelectedInSegments = (
//     segments: TreeNode[],
//     segmentId: string,
//     isSelected: boolean
//   ) => {
//     return segments.map(segment => ({
//       ...segment,
//       isSelected:
//         segment.segmentId === segmentId ? isSelected : segment.isSelected,
//       subSegments: updateIsSelectedInSegments(
//         segment.subSegments,
//         segmentId,
//         isSelected
//       )
//     }));
//   };

//   // Backend verisi geldiğinde `isSelected` değerlerini state'e güncelle
//   useEffect(() => {
//     const initialSelected = getInitialSelectedIds(data);
//     if (initialSelected.length > 0 && selectedIds.length === 0) {
//       setSelectedIds(initialSelected);
//     }
//   }, [data, selectedIds]);

//   // Seçili segmentleri parent'a bildir
//   useEffect(() => {
//     setSelected(selectedIds);
//   }, [selectedIds, setSelected]);

//   const handleToggleSelect = (segmentId: string) => {
//     setSelectedIds(prev => {
//       const isCurrentlySelected = prev.includes(segmentId);
//       const newSelectedIds = isCurrentlySelected
//         ? prev.filter(id => id !== segmentId)
//         : [...prev, segmentId];

//       // `segments` state'ini güncelle
//       const updatedSegments = updateIsSelectedInSegments(
//         data,
//         segmentId,
//         !isCurrentlySelected
//       );
//       setSegments(updatedSegments);

//       return newSelectedIds;
//     });
//   };

//   return (
//     <div className="tree-select-container">
//       {/* Seçili Öğeleri Göster */}
//       <div className="selected-segments">
//         {selectedIds.map(id => {
//           const findSegmentName = (nodes: TreeNode[]): string | null => {
//             for (const node of nodes) {
//               if (node.segmentId === id) return node.segmentName;
//               const found = findSegmentName(node.subSegments);
//               if (found) return found;
//             }
//             return null;
//           };

//           const name = findSegmentName(data);
//           return (
//             name && (
//               <div key={id} className="selected-segment-tag">
//                 <span>{name}</span>
//                 <span
//                   className="remove-icon"
//                   onClick={() => handleToggleSelect(id)}
//                 >
//                   ×
//                 </span>
//               </div>
//             )
//           );
//         })}
//       </div>

//       {/* Ağaç Seçim Bileşeni */}
//       <div className="tree-select">
//         {data.map(node => (
//           <TreeSelectItem
//             key={node.segmentId}
//             node={node}
//             selectedIds={selectedIds}
//             onToggleSelect={handleToggleSelect}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };
