import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

interface ExcelAdvancedViewerProps {
  blob: Blob;
  onClose: () => void;
}

const ExcelAdvancedViewer: React.FC<ExcelAdvancedViewerProps> = ({
  blob,
  onClose
}) => {
  const [tableData, setTableData] = useState<JSX.Element | null>(null);

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = e => {
      const binaryStr = e.target?.result;
      if (typeof binaryStr === 'string') {
        // Workbook'u oku
        const workbook = XLSX.read(binaryStr, {
          type: 'binary',
          cellStyles: true
        });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const htmlTable = generateHtmlTable(worksheet);
        setTableData(htmlTable);
      }
    };
    reader.readAsBinaryString(blob);
  }, [blob]);

  /**
   * 1) Gerçekten kullanılan hücrelerin bounding box aralığını döndürür.
   * 2) Merges (birleşik hücre) alanlarını da hesaba katar.
   */
  const getUsedRange = (ws: XLSX.IWorkSheet) => {
    // Başlangıç değerleri
    let minRow = Infinity,
      maxRow = -Infinity;
    let minCol = Infinity,
      maxCol = -Infinity;

    // 1) Tüm hücre adreslerini dolaşarak min/max row/col bul
    Object.keys(ws).forEach(key => {
      if (key[0] === '!') return; // ! ile başlayanlar meta alanları
      const cellRef = XLSX.utils.decode_cell(key);
      if (cellRef.r < minRow) minRow = cellRef.r;
      if (cellRef.r > maxRow) maxRow = cellRef.r;
      if (cellRef.c < minCol) minCol = cellRef.c;
      if (cellRef.c > maxCol) maxCol = cellRef.c;
    });

    // 2) Merges alanlarını da dahil et
    const merges = ws['!merges'] || [];
    merges.forEach((merge: XLSX.IRange) => {
      if (merge.s.r < minRow) minRow = merge.s.r;
      if (merge.s.c < minCol) minCol = merge.s.c;
      if (merge.e.r > maxRow) maxRow = merge.e.r;
      if (merge.e.c > maxCol) maxCol = merge.e.c;
    });

    // Eğer hiç veri yoksa
    if (minRow === Infinity) {
      return { minR: 0, maxR: -1, minC: 0, maxC: -1 };
    }

    return { minR: minRow, maxR: maxRow, minC: minCol, maxC: maxCol };
  };

  /**
   * Worksheet'ten HTML tablosu oluşturur; merges bilgilerini de uygular.
   * Kullanılan hücre aralığı hesaplanarak gereksiz boşluklar giderilir.
   */
  const generateHtmlTable = (worksheet: XLSX.IWorkSheet): JSX.Element => {
    const { minR, maxR, minC, maxC } = getUsedRange(worksheet);
    if (maxR < minR || maxC < minC) {
      return <div>Bu sayfada veri bulunamadı.</div>;
    }

    const merges: XLSX.IRange[] = worksheet['!merges'] || [];
    const rendered: Record<string, boolean> = {};

    const tableRows: JSX.Element[] = [];
    for (let row = minR; row <= maxR; row++) {
      const cells: JSX.Element[] = [];
      for (let col = minC; col <= maxC; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });

        // Daha önce bir merge tarafından kaplandıysa atla
        if (rendered[cellAddress]) continue;

        // Merge kontrolü
        let rowspan = 1;
        let colspan = 1;
        let skipCell = false;

        for (const merge of merges) {
          if (
            row >= merge.s.r &&
            row <= merge.e.r &&
            col >= merge.s.c &&
            col <= merge.e.c
          ) {
            // Bu hücre merge alanında
            if (row === merge.s.r && col === merge.s.c) {
              // Merge'in sol üst hücresi
              rowspan = merge.e.r - merge.s.r + 1;
              colspan = merge.e.c - merge.s.c + 1;
              // Merge altındaki tüm hücreleri işaretle
              for (let r = merge.s.r; r <= merge.e.r; r++) {
                for (let c = merge.s.c; c <= merge.e.c; c++) {
                  rendered[XLSX.utils.encode_cell({ r, c })] = true;
                }
              }
            } else {
              // Merge içindeki ama sol üst olmayan hücre
              rendered[cellAddress] = true;
              skipCell = true;
            }
            break; // merges döngüsünden çık
          }
        }
        if (skipCell) continue;

        // Hücre değeri
        const cell = worksheet[cellAddress];
        let cellValue: any = cell ? cell.v : '';
        // Date ise string'e çevir
        if (cell && (cell.t === 'd' || cellValue instanceof Date)) {
          cellValue = new Date(cellValue).toLocaleString();
        }
        // Obje ise JSON'a çevir (opsiyonel)
        if (typeof cellValue === 'object' && cellValue !== null) {
          cellValue = JSON.stringify(cellValue);
        }

        // Boşlukları engellemek için string'e çevir
        cellValue = cellValue?.toString?.() ?? '';

        cells.push(
          <td
            key={cellAddress}
            rowSpan={rowspan}
            colSpan={colspan}
            style={{
              border: '1px solid #ccc',
              padding: '5px',
              whiteSpace: 'pre-wrap' // satır kaydırma isterseniz 'pre-wrap'
            }}
          >
            {cellValue}
          </td>
        );
      }
      // Tüm hücreler boş olsa bile bir <tr> eklenecek. İsterseniz boş satırı skip edebilirsiniz.
      tableRows.push(<tr key={row}>{cells}</tr>);
    }

    return (
      <table
        style={{
          borderCollapse: 'collapse',
          border: '1px solid #ccc',
          width: 'auto', // Genişliği içeriğe göre ayarla
          tableLayout: 'auto' // Otomatik sütun genişliği
        }}
      >
        <tbody>{tableRows}</tbody>
      </table>
    );
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '10%',
        left: '10%',
        width: '80%',
        height: '80%',
        backgroundColor: 'white',
        overflow: 'auto',
        zIndex: 1000,
        padding: '20px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
      }}
    >
      <button
        onClick={onClose}
        style={{ marginBottom: '10px', padding: '5px 10px', cursor: 'pointer' }}
      >
        Kapat
      </button>
      {tableData}
    </div>
  );
};

export default ExcelAdvancedViewer;
