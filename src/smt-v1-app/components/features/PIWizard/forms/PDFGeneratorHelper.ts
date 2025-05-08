import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { partRow, QuoteWizardSetting } from '../PIWizard';

export const generatePDF = async (
  settings: QuoteWizardSetting,
  selectedDate: Date | null,
  quoteNumber: string,
  currency: string,
  quotePartRows: partRow[],
  subTotalValues: number[],
  checkedStates: boolean[],
  clientLocation: string,
  shipTo: string,
  requisitioner: string,
  shipVia: string,
  CPT: string,
  shippingTerms: string,
  contractNo: string,
  isInternational: boolean,
  validityDay: number,
  selectedBank: any,
  taxAmount: number,
  percentageValue: number
): Promise<jsPDF | void> => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.width;
    const pageHeight = pdf.internal.pageSize.height;
    const footerHeight = 30; // Footer için ayrılan yükseklik

    // Her tablo için sayfa sonu kontrolü yapacak fonksiyon
    const tableSettings = {
      didDrawCell: function (data) {
        // Tablonun mevcut Y pozisyonu footer alanına yaklaşıyorsa
        if (data.cursor.y > pageHeight - footerHeight - data.row.height) {
          pdf.addPage();
          data.cursor.y = 10;
        }
      },
      willDrawCell: function (data) {
        // Yeni sayfada çizilecek hücrelerin Y pozisyonunu kontrol et
        if (data.cursor.y > pageHeight - footerHeight) {
          data.cursor.y = 10;
        }
      }
    };

    // Logo
    pdf.addImage(settings.logo, 'JPEG', 10, 10, 60, 30);

    pdf.setFontSize(10);

    // Quote header and details
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(51, 102, 204);
    pdf.text('PROFORMA INVOICE', pageWidth - 140, 45);

    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(10);
    pdf.text(`Date: ${selectedDate?.toLocaleDateString()}`, pageWidth - 50, 20);
    pdf.text(`PI: ${quoteNumber}`, pageWidth - 50, 25);

    // Client info table
    autoTable(pdf, {
      ...tableSettings,
      startY: 50,
      head: [['SHIP TO', 'CLIENT LOCATION']],
      body: [[shipTo, clientLocation]],
      theme: 'grid',
      headStyles: { fillColor: [51, 102, 204], textColor: 255 },
      styles: { halign: 'center', valign: 'middle' },
      columnStyles: {
        0: { cellWidth: 53 },
        1: { cellWidth: 143 }
      },
      margin: { left: 7 }
    });

    // Main product table
    const tableBody = quotePartRows.map((row, index) => [
      (index + 1).toString(),
      row.partNumber,
      row.description,
      row.qty,
      `${row.leadTime} Days`,
      row.unitPrice.toLocaleString('en-US', {
        style: 'currency',
        currency: currency.replace(/[^A-Z]/g, '')
      }),
      (row.qty * row.unitPrice).toLocaleString('en-US', {
        style: 'currency',
        currency: currency.replace(/[^A-Z]/g, '')
      })
    ]);
    autoTable(pdf, {
      ...tableSettings,
      startY: (pdf as any).lastAutoTable?.finalY + 5 || 40,
      head: [
        [
          'NO',
          'PN/MODEL',
          'DESCRIPTION',
          'QTY',
          'LEAD TIME',
          'UNIT PRICE',
          'TOTAL'
        ]
      ],
      body: tableBody,
      theme: 'grid',
      headStyles: { fillColor: [51, 102, 204], textColor: 255 },
      styles: { halign: 'center', valign: 'middle' },
      columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: 31 },
        2: { cellWidth: 50 },
        3: { cellWidth: 20 },
        4: { cellWidth: 20 },
        5: { cellWidth: 30 },
        6: { cellWidth: 30 }
      },
      margin: { left: 7 }
    });

    // Calculate totals
    const subTotal = quotePartRows.reduce(
      (acc, row) => acc + row.qty * row.unitPrice,
      0
    );
    const total =
      subTotal +
      (checkedStates[0] ? taxAmount : 0) +
      subTotalValues
        .slice(1)
        .reduce(
          (sum, val, index) => sum + (checkedStates[index + 1] ? val : 0),
          0
        );

    // Use the Y position after the main product table
    const startYPosition = (pdf as any).lastAutoTable?.finalY + 5 || 40;

    // ***********************
    // CONTRACT DETAILS TABLE
    // ***********************
    const contractTableDefaultWidth = 105; // mm cinsinden default genişlik
    autoTable(pdf, {
      ...tableSettings,
      startY: startYPosition,
      head: [],
      body: [
        [
          { content: 'Contract No :', styles: { fontStyle: 'bold' } },
          contractNo
          //+ (isInternational ? ' (International)' : '')
        ],
        [
          { content: 'Payment Term :', styles: { fontStyle: 'bold' } },
          shippingTerms
        ],
        [{ content: 'Delivery Term :', styles: { fontStyle: 'bold' } }, CPT],
        [
          { content: 'Validity Day :', styles: { fontStyle: 'bold' } },
          validityDay?.toString() || '0'
        ]
      ],
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: 2,
        halign: 'left'
      },
      columnStyles: {
        0: { cellWidth: contractTableDefaultWidth * 0.3 },
        1: { cellWidth: contractTableDefaultWidth * 0.7 }
      },
      margin: { left: 7, right: 7 }
    });

    // Bu noktada contract tablosunun çizimi tamamlandı
    const contractTableFinalY = (pdf as any).lastAutoTable.finalY;
    // **************************
    // SUB-TOTAL SECTION (Sağ taraf)
    // **************************
    const subTotalWidth = pageWidth * 0.4;
    const leftMarginForSubTotal = pageWidth - subTotalWidth - 10;
    autoTable(pdf, {
      ...tableSettings,
      startY: startYPosition,
      margin: { left: leftMarginForSubTotal },
      body: [
        [
          { content: 'Sub-Total', styles: { fontStyle: 'bold' } },
          { content: 'Include', styles: { fontStyle: 'bold' } },
          {
            content: subTotal.toLocaleString('en-US', {
              style: 'currency',
              currency: currency.replace(/[^A-Z]/g, '')
            }),
            styles: { fontStyle: 'bold' }
          }
        ],
        [
          {
            content: `Tax (${percentageValue}%)`,
            styles: { fontStyle: 'bold' }
          },
          {
            content: checkedStates[0] ? 'Yes' : 'No',
            styles: { halign: 'center' }
          },
          {
            content: checkedStates[0]
              ? `${taxAmount.toLocaleString('en-US', {
                  style: 'currency',
                  currency: currency.replace(/[^A-Z]/g, '')
                })}`
              : `${(0).toLocaleString('en-US', {
                  style: 'currency',
                  currency: currency.replace(/[^A-Z]/g, '')
                })}`
          }
        ],

        [
          { content: 'Aircargo to X', styles: { fontStyle: 'bold' } },
          checkedStates[1] ? 'Yes' : 'No',
          subTotalValues[1]?.toLocaleString('en-US', {
            style: 'currency',
            currency: currency.replace(/[^A-Z]/g, '')
          })
        ],
        [
          { content: 'Sealine to X', styles: { fontStyle: 'bold' } },
          checkedStates[2] ? 'Yes' : 'No',
          subTotalValues[2]?.toLocaleString('en-US', {
            style: 'currency',
            currency: currency.replace(/[^A-Z]/g, '')
          })
        ],
        [
          { content: 'Truck Carriage to X', styles: { fontStyle: 'bold' } },
          checkedStates[3] ? 'Yes' : 'No',
          subTotalValues[3]?.toLocaleString('en-US', {
            style: 'currency',
            currency: currency.replace(/[^A-Z]/g, '')
          })
        ],
        [
          { content: 'Total', styles: { fontStyle: 'bold' } },
          '',
          {
            content: total.toLocaleString('en-US', {
              style: 'currency',
              currency: currency.replace(/[^A-Z]/g, '')
            }),
            styles: { fontStyle: 'bold' }
          }
        ]
      ],
      theme: 'grid',
      styles: { halign: 'center', valign: 'middle', fontSize: 9 },
      columnStyles: {
        0: { cellWidth: subTotalWidth * 0.51 },
        1: { cellWidth: subTotalWidth * 0.17 },
        2: { cellWidth: subTotalWidth * 0.35 }
      }
    });

    // // Payment Balance Section - Subtotal'ın altında
    // const balanceY = (pdf as any).lastAutoTable?.finalY + 10;
    // const balanceValues = {
    //   before: 4634.71,
    //   payment: 4634.71,
    //   after: 4634.71
    // };

    // // Balance bilgilerini yazdır
    // autoTable(pdf, {
    //   startY: balanceY,
    //   margin: { left: leftMarginForSubTotal },
    //   body: [
    //     ['Balance Before Payment:', balanceValues.before.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    //     ['Payment Amount via Balance:', balanceValues.payment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    //     ['Balance After Payment:', balanceValues.after.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })]
    //   ],
    //   theme: 'plain',
    //   styles: {
    //     fontSize: 9,
    //     textColor: [40, 167, 69], // success color
    //     cellPadding: 2
    //   },
    //   columnStyles: {
    //     0: { cellWidth: subTotalWidth * 0.65 },
    //     1: { cellWidth: subTotalWidth * 0.35, halign: 'right' }
    //   }
    // });

    // // Banka tablosunu ekle
    // pdf.setFontSize(9);
    // pdf.setTextColor(0, 0, 0);

    // // Reset text color for bank table
    // pdf.setTextColor(0, 0, 0);

    // *****************************
    // BANK INFORMATION TABLE (Banka Tablosu)
    // *****************************
    if (selectedBank) {
      // QR kodu önce oluştur
      let qrCodeImage = '';
      if (selectedBank.ibanNo) {
        try {
          qrCodeImage = await QRCode.toDataURL(selectedBank.ibanNo, {
            width: 100,
            margin: 0,
            errorCorrectionLevel: 'H'
          });
        } catch (error) {
          console.error('QR code generation error:', error);
        }
      }

      const bankTable = {
        head: [
          [
            'Currency',
            'Bank Name',
            'Branch Name',
            'Branch Code',
            'Swift Code',
            'IBAN NO'
          ]
        ],
        body: [
          [
            {
              content: selectedBank.currency || '',
              styles: { valign: 'top' as const, cellPadding: 4, fontSize: 8 }
            },
            {
              content: selectedBank.bankName || '',
              styles: { valign: 'top' as const, cellPadding: 4, fontSize: 8 }
            },
            {
              content: selectedBank.branchName || '',
              styles: { valign: 'top' as const, cellPadding: 4, fontSize: 8 }
            },
            {
              content: selectedBank.branchCode || '',
              styles: { valign: 'top' as const, cellPadding: 4, fontSize: 8 }
            },
            {
              content: selectedBank.swiftCode || '',
              styles: { valign: 'top' as const, cellPadding: 4, fontSize: 8 }
            },
            {
              content: '',
              styles: {
                cellPadding: 4,
                minCellHeight: 35,
                fontSize: 8
              }
            }
          ]
        ]
      };

      // Banka tablosu için başlangıç Y pozisyonu
      let bankTableStartY = contractTableFinalY + 18;

      // Footer alanı için güvenli mesafe kontrolü
      const safeFooterDistance = footerHeight + 15;

      // Eğer footer alanına yakınsa yeni sayfada başlat
      if (bankTableStartY > pageHeight - safeFooterDistance - 40) {
        pdf.addPage();
        bankTableStartY = 10;
      }

      autoTable(pdf, {
        ...tableSettings,
        startY: bankTableStartY,
        head: bankTable.head,
        body: bankTable.body,
        theme: 'grid',
        headStyles: {
          fillColor: [51, 102, 204],
          textColor: 255,
          fontSize: 8,
          cellPadding: 4,
          fontStyle: 'bold' // Header hücreleri bold olacak
        },
        styles: {
          halign: 'center',
          fontSize: 8,
          overflow: 'linebreak',
          cellWidth: 'wrap'
        },
        columnStyles: {
          0: { cellWidth: 20 }, // Currency
          1: { cellWidth: 30 }, // Bank Name
          2: { cellWidth: 30 }, // Branch Name
          3: { cellWidth: 31 }, // Branch Code
          4: { cellWidth: 25 }, // Swift Code
          5: { cellWidth: 60 } // IBAN + QR
        },
        margin: { left: 7, right: 7 },
        pageBreak: 'avoid',
        didDrawCell: function (data) {
          // IBAN hücresine QR kodu ekle
          if (
            data.section === 'body' &&
            data.column.index === 5 && // IBAN sütunu
            data.row.index === 0 && // İlk satır
            qrCodeImage &&
            selectedBank?.ibanNo
          ) {
            const cell = data.cell;
            const qrSize = 20; // QR kod boyutunu küçülttük
            const padding = 2;

            // IBAN metnini hücrenin üst kısmına yerleştir
            pdf.setFontSize(8);
            pdf.text(
              selectedBank.ibanNo,
              cell.x + cell.width / 2,
              cell.y + padding + 4,
              { align: 'center' }
            );

            // QR kodu IBAN'ın altına ortala
            const qrX = cell.x + (cell.width - qrSize) / 2;
            const qrY = cell.y + padding + 10;

            pdf.addImage(qrCodeImage, 'PNG', qrX, qrY, qrSize, qrSize);
          }
        }
      });

      // Footer'ın başlangıç Y pozisyonunu kontrol et
      const currentY = (pdf as any).lastAutoTable.finalY;
      if (currentY > pageHeight - safeFooterDistance) {
        pdf.addPage();
      }
    }

    // Add company address information
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);

    const centerX = pageWidth / 2;
    const addressY = pageHeight - 25;

    // Adres satırlarını ayırma
    const addressLines: string[] = [];
    if (settings.companyAddress) {
      const splittedAddress = settings.companyAddress.split('\n');
      splittedAddress.forEach(line => {
        const trimmed = line.trim();
        if (trimmed) {
          addressLines.push(trimmed);
        }
      });
    }

    // Her satırı ortalayarak yazdırma (alttan yukarı doğru)
    addressLines.forEach((line, index) => {
      const fontSize = pdf.internal.getFontSize();
      const lineWidth =
        (pdf.getStringUnitWidth(line) * fontSize) / pdf.internal.scaleFactor;
      const lineX = centerX - lineWidth / 2;

      const reversedIndex = addressLines.length - 1 - index;
      pdf.text(line, lineX, addressY - reversedIndex * 6);
    });

    // Telefon numarasını adresin altına ekle
    if (settings.phone) {
      const fontSize = pdf.internal.getFontSize();
      const phoneText = `Tel: ${settings.phone}`;
      const phoneWidth =
        (pdf.getStringUnitWidth(phoneText) * fontSize) /
        pdf.internal.scaleFactor;
      const phoneX = centerX - phoneWidth / 2;
      pdf.text(phoneText, phoneX, addressY + 6);
    }

    return pdf;
  } catch (error) {
    console.error('PDF oluşturma sırasında bir hata oluştu:', error);
  }
};

export const downloadPDF = async (
  settings: QuoteWizardSetting,
  selectedDate: Date | null,
  quoteNumber: string,
  currency: string,
  quotePartRows: partRow[],
  subTotalValues: number[],
  checkedStates: boolean[],
  clientLocation: string,
  shipTo: string,
  requisitioner: string,
  shipVia: string,
  CPT: string,
  shippingTerms: string,
  contractNo: string,
  isInternational: boolean,
  validityDay: number,
  selectedBank: any,
  taxAmount: number,
  percentageValue: number
) => {
  try {
    const pdf = await generatePDF(
      settings,
      selectedDate,
      quoteNumber,
      currency,
      quotePartRows,
      subTotalValues,
      checkedStates,
      clientLocation,
      shipTo,
      requisitioner,
      shipVia,
      CPT,
      shippingTerms,
      contractNo,
      isInternational,
      validityDay,
      selectedBank,
      taxAmount,
      percentageValue
    );
    if (pdf) {
      pdf.save(`${quoteNumber}.pdf`);
    }
  } catch (error) {
    console.error('PDF oluşturma sırasında bir hata oluştu:', error);
  }
};

export const returnPdfAsBase64String = async (
  settings: QuoteWizardSetting,
  selectedDate: Date | null,
  quoteNumber: string,
  currency: string,
  quotePartRows: partRow[],
  subTotalValues: number[],
  checkedStates: boolean[],
  clientLocation: string,
  shipTo: string,
  requisitioner: string,
  shipVia: string,
  CPT: string,
  shippingTerms: string,
  contractNo: string,
  isInternational: boolean,
  validityDay: number,
  selectedBank: any,
  taxAmount: number,
  percentageValue: number
): Promise<string | undefined> => {
  try {
    const pdf = await generatePDF(
      settings,
      selectedDate,
      quoteNumber,
      currency,
      quotePartRows,
      subTotalValues,
      checkedStates,
      clientLocation,
      shipTo,
      requisitioner,
      shipVia,
      CPT,
      shippingTerms,
      contractNo,
      isInternational,
      validityDay,
      selectedBank,
      taxAmount,
      percentageValue
    );
    if (pdf) {
      const base64Data = pdf.output('datauristring');
      // Eğer base64 verisi data: ile başlamıyorsa, prefix ekle
      if (!base64Data.startsWith('data:')) {
        return `data:application/pdf;base64,${base64Data}`;
      }
      return base64Data;
    }
  } catch (e) {
    console.error(e);
  }
  return undefined;
};

const convertBlobToBase64 = blob =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // reader.result will be something like: "data:application/pdf;base64,JVBERi0xLjcKJYGBgYEK..."
      resolve(reader.result);
    };
    reader.onerror = error => reject(error);
    reader.readAsDataURL(blob); // This reads the blob and converts it to a base64 encoded string
  });
