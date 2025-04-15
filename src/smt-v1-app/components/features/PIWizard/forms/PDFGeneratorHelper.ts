import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { QuotePartRow, QuoteWizardSetting } from '../PIWizard';

export const generatePDF = async (
  settings: QuoteWizardSetting,
  selectedDate: Date | null,
  quoteNumber: string,
  currency: string,
  quotePartRows: QuotePartRow[],
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
  selectedBank: any
): Promise<jsPDF | void> => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.width;

    // Logo
    pdf.addImage(settings.logo, 'JPEG', 10, 10, 60, 30);

    pdf.setFontSize(10);

    // Quote header and details
    pdf.setFontSize(25);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(51, 102, 204);
    pdf.text('QUOTE', pageWidth - 60, 20);

    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(10);
    pdf.text(`Date: ${selectedDate?.toLocaleDateString()}`, pageWidth - 60, 30);
    pdf.text(`Quote Number: ${quoteNumber}`, pageWidth - 60, 35);

    // Client info table
    autoTable(pdf, {
      startY: 40,
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
    const tableBody = quotePartRows.map(row => [
      row.no,
      row.partNumber,
      row.description,
      row.quantity,
      `${row.leadTime} Days`,
      row.unitPrice.toLocaleString('en-US', {
        style: 'currency',
        currency: currency.replace(/[^A-Z]/g, '')
      }),
      (row.quantity * row.unitPrice).toLocaleString('en-US', {
        style: 'currency',
        currency: currency.replace(/[^A-Z]/g, '')
      })
    ]);
    autoTable(pdf, {
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
      (acc, row) => acc + row.quantity * row.unitPrice,
      0
    );
    const total =
      quotePartRows.reduce(
        (acc, row) => acc + row.quantity * row.unitPrice,
        0
      ) +
      subTotalValues.reduce(
        (sum, val, index) => sum + (checkedStates[index] ? val : 0),
        0
      );

    // Use the Y position after the main product table
    const startYPosition = (pdf as any).lastAutoTable?.finalY + 5 || 40;

    // --- Revised Layout ---

    // 1. Sub-total section (occupies 40% of the page width, aligned to the right)
    const subTotalWidth = pageWidth * 0.4; // Sub-total table width (40% of the page)
    const leftMarginForSubTotal = pageWidth - subTotalWidth - 10; // 40% of page width
    autoTable(pdf, {
      startY: startYPosition,
      // Set the left margin so that the table occupies the right 40%
      margin: { left: leftMarginForSubTotal },
      body: [
        [
          'Sub-Total',
          'Include',
          {
            content: subTotal.toLocaleString('en-US', {
              style: 'currency',
              currency: currency.replace(/[^A-Z]/g, '')
            }),
            styles: { fontStyle: 'bold' }
          }
        ],
        [
          'Tax',
          checkedStates[0] ? 'Yes' : 'No',
          subTotalValues[0]?.toLocaleString('en-US', {
            style: 'currency',
            currency: currency.replace(/[^A-Z]/g, '')
          })
        ],
        [
          'Aircargo to X',
          checkedStates[1] ? 'Yes' : 'No',
          subTotalValues[1]?.toLocaleString('en-US', {
            style: 'currency',
            currency: currency.replace(/[^A-Z]/g, '')
          })
        ],
        [
          'Sealine to X',
          checkedStates[2] ? 'Yes' : 'No',
          subTotalValues[2]?.toLocaleString('en-US', {
            style: 'currency',
            currency: currency.replace(/[^A-Z]/g, '')
          })
        ],
        [
          'Truck Carriage to X',
          checkedStates[3] ? 'Yes' : 'No',
          subTotalValues[3]?.toLocaleString('en-US', {
            style: 'currency',
            currency: currency.replace(/[^A-Z]/g, '')
          })
        ],
        [
          'Total',
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
      // Adjust the column widths to fill the sub-total area
      columnStyles: {
        0: { cellWidth: subTotalWidth * 0.51 },
        1: { cellWidth: subTotalWidth * 0.17 },
        2: { cellWidth: subTotalWidth * 0.35 }
      }
    });

    // Add Bank Information
    if (selectedBank) {
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
            selectedBank.currency || '',
            selectedBank.bankName || '',
            selectedBank.branchName || '',
            selectedBank.branchCode || '',
            selectedBank.swiftCode || '',
            selectedBank.ibanNo || ''
          ]
        ]
      };

      autoTable(pdf, {
        startY: (pdf as any).lastAutoTable?.finalY + 10,
        head: bankTable.head,
        body: bankTable.body,
        theme: 'grid',
        headStyles: { fillColor: [51, 102, 204], textColor: 255 },
        styles: { halign: 'center', valign: 'middle' },
        margin: { left: 7, right: 7 }
      });

      // Add QR code if IBAN exists
      if (selectedBank.ibanNo) {
        try {
          // Generate QR code as data URL
          const qrCodeDataUrl = await QRCode.toDataURL(selectedBank.ibanNo, {
            width: 100,
            margin: 0,
            errorCorrectionLevel: 'H'
          });

          // Position QR code to the right of the bank table
          const qrX = pdf.internal.pageSize.getWidth() - 47;
          const qrY = (pdf as any).lastAutoTable.finalY + 7;
          pdf.addImage(qrCodeDataUrl, 'PNG', qrX, qrY, 30, 30);
        } catch (error) {
          console.error('QR code generation error:', error);
        }
      }

      // Add company address information
      // Örnek: Görseldeki adres bilgisine benzer formatta yazdırma
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);

      // Sayfa genişliğinin yarısı (orta nokta)
      const centerX = pdf.internal.pageSize.getWidth() / 2;

      // Sayfa yüksekliğini al ve alttan 30mm boşluk bırak
      const pageHeight = pdf.internal.pageSize.getHeight();
      const addressY = pageHeight - 25; // Sayfanın altından 30mm yukarıda başla

      // 1) Adres satırlarını ayırma
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

        // Satırları alttan yukarı doğru yerleştir (her satır için 6mm yukarı)
        const reversedIndex = addressLines.length - 1 - index; // Dizinin sonundan başla
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
        pdf.text(phoneText, phoneX, addressY + 6); // Adresin 6mm altına
      }
    }

    // Save the PDF
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
  quotePartRows: QuotePartRow[],
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
  selectedBank: any
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
      selectedBank
    );
    if (pdf) {
      pdf.save('quote-' + quoteNumber + '.pdf');
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
  quotePartRows: QuotePartRow[],
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
  selectedBank: any
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
      selectedBank
    );
    if (pdf) {
      const pdfBlob = pdf.output('blob');
      const base64String = await convertBlobToBase64(pdfBlob);
      return base64String as string;
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
