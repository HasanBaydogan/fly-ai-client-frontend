import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { partRow, QuoteWizardSetting } from '../POWizard';

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
  fob: string,
  shippingTerms: string,
  contractNo: string,
  isInternational: boolean,
  validityDay: number,
  selectedBank: any,
  taxAmount: number,
  percentageValue: number,
  currentVendor: any
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
    pdf.text('PURCHASE ORDER', pageWidth - 140, 50);

    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(10);
    pdf.text(`Date: ${selectedDate?.toLocaleDateString()}`, pageWidth - 50, 20);
    pdf.text(`${quoteNumber}`, pageWidth - 50, 25);

    // Client info table
    autoTable(pdf, {
      ...tableSettings,
      startY: 55,
      head: [['VENDOR', 'SHIP TO']],
      body: [[currentVendor.supplier, shipTo]],
      theme: 'grid',
      headStyles: { fillColor: [51, 102, 204], textColor: 255 },
      styles: { halign: 'center', valign: 'middle' },
      columnStyles: {
        0: { cellWidth: 53 },
        1: { cellWidth: 143 }
      },
      margin: { left: 7 }
    });

    // Add Requisitioner fields table
    autoTable(pdf, {
      ...tableSettings,
      startY: (pdf as any).lastAutoTable?.finalY + 5,
      head: [
        ['REQUISITIONER', 'SHIP VIA', 'TERMS OF PAYMENT', 'SHIPPING TERMS']
      ],
      body: [[requisitioner, shipVia, '%100 Advance by US', shippingTerms]],
      theme: 'grid',
      headStyles: { fillColor: [51, 102, 204], textColor: 255 },
      styles: { halign: 'center', valign: 'middle' },
      columnStyles: {
        0: { cellWidth: 49 },
        1: { cellWidth: 49 },
        2: { cellWidth: 49 },
        3: { cellWidth: 49 }
      },
      margin: { left: 7 }
    });

    // Main product table
    const tableBody = quotePartRows.map((row, index) => [
      (index + 1).toString(),
      row.partNumber,
      row.description,
      row.qty,
      row.leadTime >= 0 && row.leadTime <= 3 ? 'STOCK' : `${row.leadTime} Days`,
      row.price.toLocaleString('en-US', {
        style: 'currency',
        currency: currency.replace(/[^A-Z]/g, '')
      }),
      (row.qty * row.price).toLocaleString('en-US', {
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
      (acc, row) => acc + row.qty * row.price,
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
          (subTotalValues[1] || 0).toLocaleString('en-US', {
            style: 'currency',
            currency: currency.replace(/[^A-Z]/g, '')
          })
        ],
        [
          { content: 'Sealine to X', styles: { fontStyle: 'bold' } },
          checkedStates[2] ? 'Yes' : 'No',
          (subTotalValues[2] || 0).toLocaleString('en-US', {
            style: 'currency',
            currency: currency.replace(/[^A-Z]/g, '')
          })
        ],
        [
          { content: 'Truck Carriage to X', styles: { fontStyle: 'bold' } },
          checkedStates[3] ? 'Yes' : 'No',
          (subTotalValues[3] || 0).toLocaleString('en-US', {
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

    // Add company address information
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);

    const centerX = pageWidth / 2;
    const addressY = pageHeight - 25;

    // Adres satırlarını ayırma
    const addressLines: string[] = [];
    if (settings.companyName && settings.companyName.trim()) {
      addressLines.push(settings.companyName.trim());
    }
    if (settings.companyAddress) {
      const splittedAddress = settings.companyAddress.split('\n');
      splittedAddress.forEach(line => {
        const trimmed = line.trim();
        if (trimmed) {
          addressLines.push(trimmed);
        }
      });
    }

    // Add contact information text
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    const contactText = '';
    const contactTextWidth =
      (pdf.getStringUnitWidth(contactText) * pdf.internal.getFontSize()) /
      pdf.internal.scaleFactor;
    const contactTextX = centerX - contactTextWidth / 2;
    pdf.text(contactText, contactTextX, addressY - addressLines.length * 6 - 0);

    // Reset font for address
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');

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
  fob: string,
  shippingTerms: string,
  contractNo: string,
  isInternational: boolean,
  validityDay: number,
  selectedBank: any,
  taxAmount: number,
  percentageValue: number,
  currentVendor: any
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
      fob,
      shippingTerms,
      contractNo,
      isInternational,
      validityDay,
      selectedBank,
      taxAmount,
      percentageValue,
      currentVendor
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
  fob: string,
  shippingTerms: string,
  contractNo: string,
  isInternational: boolean,
  validityDay: number,
  selectedBank: any,
  taxAmount: number,
  percentageValue: number,
  currentVendor: any
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
      fob,
      shippingTerms,
      contractNo,
      isInternational,
      validityDay,
      selectedBank,
      taxAmount,
      percentageValue,
      currentVendor
    );

    if (pdf) {
      // Convert PDF to base64 string
      const pdfBlob = pdf.output('blob');
      const reader = new FileReader();

      return new Promise((resolve, reject) => {
        reader.onload = () => {
          const base64String = reader.result as string;
          resolve(base64String);
        };
        reader.onerror = error => {
          console.error('Error converting PDF to base64:', error);
          reject(error);
        };
        reader.readAsDataURL(pdfBlob);
      });
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error; // Re-throw the error to handle it in the component
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
