// RFQAttachments.tsx
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import ReactDOMServer from 'react-dom/server';
import { openAttachment } from 'smt-v1-app/services/AttachmentService';
import { MailItemAttachment } from 'smt-v1-app/types/RfqContainerTypes';

import pdfIcon from '../../../../assets/img/icons/pdf_icon2.svg';
import excelIcon from '../../../../assets/img/icons/xls-icon.svg';
import imageIcon from '../../../../assets/img/icons/jpg-icon.svg';
import unknownIcon from '../../../../assets/img/icons/unknown-icon.svg';

import attachmentIcon from '../../../../assets/img/icons/attachment-icon.svg';

// getIcon fonksiyonu: Dosya uzantısına göre uygun ikonu döndürür.
const getIcon = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'pdf':
      return pdfIcon;
    case 'xls':
    case 'xlsx':
      return excelIcon;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return imageIcon;
    default:
      return unknownIcon;
  }
};

interface FileData {
  data: string; // Base64 içerik
  contentType: string; // Örn: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/pdf", "image/png", vb.
  fileName: string; // Örn: "dosya.xlsx", "dosya.pdf", "resim.png"
}

// Sadece tıklanabilir olmasını istediğimiz dosya uzantıları
const allowedExtensions = ['xls', 'xlsx', 'pdf', 'png', 'jpg', 'jpeg'];

const PiAttachments = ({
  attachments
}: {
  attachments: MailItemAttachment[];
}) => {
  const openAttachmentFromDB = async (attachmentId: string) => {
    const resp = await openAttachment(attachmentId);
    openFile(resp.data);
  };

  const openFile = (file: FileData) => {
    const extension = file.fileName.split('.').pop()?.toLowerCase() || '';
    // Eğer dosya uzantısı allowedExtensions içinde değilse hiçbir işlem yapma.
    if (!allowedExtensions.includes(extension)) {
      return;
    }
    if (['xls', 'xlsx'].includes(extension)) {
      const blob = base64ToBlob(file.data, file.contentType);
      readExcelAndOpenInNewTab(blob, file.fileName);
    } else if (['png', 'jpg', 'jpeg'].includes(extension)) {
      const blob = base64ToBlob(file.data, file.contentType);
      openImageInNewTab(blob, file.fileName);
    } else if (extension === 'pdf') {
      const blob = base64ToBlob(file.data, file.contentType);
      openPdfInNewTab(blob, file.fileName);
    }
  };

  const base64ToBlob = (base64Data: string, contentType: string) => {
    const binaryString = atob(base64Data);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return new Blob([bytes], { type: contentType });
  };

  const readExcelAndOpenInNewTab = (blob: Blob, fileName: string) => {
    const reader = new FileReader();
    reader.onload = e => {
      const binaryStr = e.target?.result;
      if (typeof binaryStr === 'string') {
        const workbook = XLSX.read(binaryStr, {
          type: 'binary',
          cellStyles: true
        });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const tableElement = generateHtmlTable(worksheet);
        const tableHtml = ReactDOMServer.renderToStaticMarkup(tableElement);
        const blobUrl = URL.createObjectURL(blob);
        const newWindow = window.open('', '_blank', 'width=1200,height=800');
        if (newWindow) {
          newWindow.document.write(`
            <html>
              <head>
                <title>Excel Preview</title>
                <meta charset="UTF-8" />
                <style>
                  body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                  }
                  .download-button {
                    display: inline-block;
                    margin-bottom: 20px;
                    padding: 10px 15px;
                    background-color: #007bff;
                    color: #fff;
                    text-decoration: none;
                    border-radius: 4px;
                  }
                  table {
                    border-collapse: collapse;
                    border: 1px solid #ccc;
                    width: auto;
                    table-layout: auto;
                  }
                  td {
                    border: 1px solid #ccc;
                    padding: 5px;
                    white-space: pre-wrap;
                  }
                </style>
              </head>
              <body>
                <a href="${blobUrl}" download="${fileName}" class="download-button">Download</a>
                ${tableHtml}
              </body>
            </html>
          `);
          newWindow.document.close();
        }
      }
    };
    reader.readAsBinaryString(blob);
  };

  const openImageInNewTab = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const newWindow = window.open('', '_blank', 'width=1200,height=800');
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>Image Preview</title>
            <meta charset="UTF-8" />
            <style>
              body {
                margin: 0;
                padding: 20px;
                display: flex;
                flex-direction: column;
                align-items: center;
                background-color: #f0f0f0;
                font-family: Arial, sans-serif;
              }
              .download-button {
                margin-bottom: 20px;
                padding: 10px 15px;
                background-color: #007bff;
                color: #fff;
                text-decoration: none;
                border-radius: 4px;
              }
              img {
                max-width: 100%;
                max-height: 80vh;
              }
            </style>
          </head>
          <body>
            <a href="${url}" download="${fileName}" class="download-button">Download</a>
            <img src="${url}" alt="Image Preview" />
          </body>
        </html>
      `);
      newWindow.document.close();
    }
  };

  const openPdfInNewTab = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const newWindow = window.open('', '_blank', 'width=1200,height=800');
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>PDF Preview</title>
            <meta charset="UTF-8" />
            <style>
              body {
                margin: 0;
                padding: 20px;
                font-family: Arial, sans-serif;
                background-color: #f0f0f0;
              }
              .download-button {
                display: inline-block;
                margin-bottom: 20px;
                padding: 10px 15px;
                background-color: #007bff;
                color: #fff;
                text-decoration: none;
                border-radius: 4px;
              }
              iframe {
                width: 100%;
                height: 80vh;
                border: none;
              }
            </style>
          </head>
          <body>
            <a href="${url}" download="${fileName}" class="download-button">Download</a>
            <iframe src="${url}"></iframe>
          </body>
        </html>
      `);
      newWindow.document.close();
    }
  };

  const generateHtmlTable = (worksheet: XLSX.WorkSheet): JSX.Element => {
    const getUsedRange = (ws: XLSX.WorkSheet) => {
      let minRow = Infinity,
        maxRow = -Infinity;
      let minCol = Infinity,
        maxCol = -Infinity;
      Object.keys(ws).forEach(key => {
        if (key[0] === '!') return;
        const cellRef = XLSX.utils.decode_cell(key);
        if (cellRef.r < minRow) minRow = cellRef.r;
        if (cellRef.r > maxRow) maxRow = cellRef.r;
        if (cellRef.c < minCol) minCol = cellRef.c;
        if (cellRef.c > maxCol) maxCol = cellRef.c;
      });
      const merges = ws['!merges'] || [];
      merges.forEach((merge: XLSX.Range) => {
        if (merge.s.r < minRow) minRow = merge.s.r;
        if (merge.s.c < minCol) minCol = merge.s.c;
        if (merge.e.r > maxRow) maxRow = merge.e.r;
        if (merge.e.c > maxCol) maxCol = merge.e.c;
      });
      if (minRow === Infinity) {
        return { minR: 0, maxR: -1, minC: 0, maxC: -1 };
      }
      return { minR: minRow, maxR: maxRow, minC: minCol, maxC: maxCol };
    };

    const { minR, maxR, minC, maxC } = getUsedRange(worksheet);
    if (maxR < minR || maxC < minC) {
      return <div>No data found on this page.</div>;
    }
    const merges: XLSX.Range[] = worksheet['!merges'] || [];
    const rendered: Record<string, boolean> = {};
    const tableRows: JSX.Element[] = [];
    for (let row = minR; row <= maxR; row++) {
      const cells: JSX.Element[] = [];
      for (let col = minC; col <= maxC; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        if (rendered[cellAddress]) continue;
        let rowspan = 1,
          colspan = 1,
          skipCell = false;
        for (const merge of merges) {
          if (
            row >= merge.s.r &&
            row <= merge.e.r &&
            col >= merge.s.c &&
            col <= merge.e.c
          ) {
            if (row === merge.s.r && col === merge.s.c) {
              rowspan = merge.e.r - merge.s.r + 1;
              colspan = merge.e.c - merge.s.c + 1;
              for (let r = merge.s.r; r <= merge.e.r; r++) {
                for (let c = merge.s.c; c <= merge.e.c; c++) {
                  rendered[XLSX.utils.encode_cell({ r, c })] = true;
                }
              }
            } else {
              rendered[cellAddress] = true;
              skipCell = true;
            }
            break;
          }
        }
        if (skipCell) continue;
        const cell = worksheet[cellAddress];
        let cellValue: any = cell ? cell.v : '';
        if (cell && (cell.t === 'd' || cellValue instanceof Date)) {
          cellValue = new Date(cellValue).toLocaleString();
        }
        if (typeof cellValue === 'object' && cellValue !== null) {
          cellValue = JSON.stringify(cellValue);
        }
        cellValue = cellValue?.toString?.() ?? '';
        cells.push(
          <td
            key={cellAddress}
            rowSpan={rowspan}
            colSpan={colspan}
            style={{
              border: '1px solid #ccc',
              padding: '5px',
              whiteSpace: 'pre-wrap'
            }}
          >
            {cellValue}
          </td>
        );
      }
      tableRows.push(<tr key={row}>{cells}</tr>);
    }
    return (
      <table
        style={{
          borderCollapse: 'collapse',
          border: '1px solid #ccc',
          width: 'auto',
          tableLayout: 'auto'
        }}
      >
        <tbody>{tableRows}</tbody>
      </table>
    );
  };

  return (
    <>
      <div className="d-flex align-items-center my-2 mt-4">
        <img
          src={attachmentIcon}
          alt="attachment"
          className="rfq-mail-attachment-icon2 mb-1"
        />
        <h4 className="rfq-mail-attachment-header ms-2">Attachments</h4>
      </div>
      {/* <hr className="custom-line w-100 m-0" /> */}
      <div className="d-flex justify-content-start rfq-mail-attachments-container mt-3">
        {attachments?.map((mailAttach, index) => {
          const ext = mailAttach.fileName.split('.').pop()?.toLowerCase() || '';
          const isAllowed = allowedExtensions.includes(ext);
          return (
            <a
              key={`${mailAttach.attachmentId}-${index}`}
              rel="noopener noreferrer"
              className="d-flex flex-column justify-content-center align-items-center mx-3"
              onClick={
                isAllowed
                  ? () => openAttachmentFromDB(mailAttach.attachmentId)
                  : undefined
              }
              style={{
                cursor: isAllowed ? 'pointer' : 'default',
                opacity: isAllowed ? 1 : 0.5
              }}
            >
              <img
                src={getIcon(mailAttach.fileName)}
                alt=""
                className="rfq-product-mail-detail-file-icon"
              />
              <span className="rfq-product-mail-detail-file-name text-center mt-2">
                {mailAttach.fileName}
              </span>
            </a>
          );
        })}
      </div>
    </>
  );
};

export default PiAttachments;
