import { WizardFormData } from 'pages/modules/forms/WizardExample';
import { useWizardFormContext } from 'providers/WizardFormProvider';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Dropdown, Form, Row, Table } from 'react-bootstrap';
import DatePicker from 'components/base/DatePicker';
import Reka_Static from 'assets/img/logos/Reka_Static.jpg';
import './WizardTabs.css';

interface TableRow {
  partNumber: string;
  alternativeTo: string;
  description: string;
  leadTime: string;
  qty: number;
  unitPrice: number;
  isNew?: boolean; // Yeni satırları ayırt etmek için
}

const WizardAccountForm = ({ id }: { id: string }) => {
  const methods = useWizardFormContext<WizardFormData>();
  const { formData, onChange, validation } = methods;

  const [quoteNumber] = useState('2785674'); // Sabit teklif numarası
  const [revisionNumber] = useState(0); // Sabit revizyon numarası
  const [reqQTY, setReqQTY] = useState(1);
  const [currency, setCurrency] = useState('USD'); // Varsayılan para birimi

  // Para birimi seçimine göre miktar ayarları
  const handleCurrencyChange = (selectedCurrency: string) => {
    setCurrency(selectedCurrency);

    // Fake Currency  Data
    const defaultQuantities: Record<string, number> = {
      USD: 35,
      EUR: 2,
      GBP: 3,
      TRY: 100
    };

    setReqQTY(defaultQuantities[selectedCurrency]);
  };

  const handleQtyChange = (index: number, value: number) => {
    const updatedData = [...data];
    updatedData[index].qty = value;
    setData(updatedData);
  };

  //fake data
  const [data, setData] = useState<TableRow[]>([
    {
      partNumber: '4122-006009',
      alternativeTo: '',
      description: 'PUMP-PROPELLER FEATHERING',
      leadTime: '18',
      qty: 1,
      unitPrice: 4634.71
    },
    {
      partNumber: '4122-006009',
      alternativeTo: '',
      description: 'SENSOR (CONDITION REQ. = NE FOUND = TST)',
      leadTime: '18',
      qty: 1,
      unitPrice: 4634.71
    },
    {
      partNumber: '3116499-04',
      alternativeTo: '4122-006009',
      description: 'SENSOR',
      leadTime: '18',
      qty: 3,
      unitPrice: 2795.0
    }
  ]);

  // Satır ekleme için fake data
  const addRow = (index: number) => {
    const newRow: TableRow = {
      partNumber: '',
      alternativeTo: '',
      description: '',
      leadTime: '',
      qty: 1,
      unitPrice: 0.0,
      isNew: true // Yeni satır olarak işaretle
    };

    const updatedData = [...data];
    updatedData.splice(index + 1, 0, newRow); // Yeni satırı belirtilen index'in altına ekle
    setData(updatedData);
  };

  // Satır silme
  const deleteRow = (index: number) => {
    const updatedData = data.filter((_, i) => i !== index);
    setData(updatedData);
  };
  // Hücre verisi güncelleme işlevi
  const handleCellChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const updatedData = [...data];
    updatedData[index][field] = value;
    setData(updatedData);
  };

  // Backend'den veri çekme
  useEffect(() => {
    // Backend API çağrısı için
    fetch('/api/table-data')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <>
      <div className="uppersection">
        <div className="upperleftsection">
          <Form.Group className="d-flex align-items-center gap-3 mb-5">
            {/* Miktar */}
            <Form.Control
              value={reqQTY}
              onWheel={e => (e.target as HTMLInputElement).blur()}
              type="number"
              onChange={e => {
                setReqQTY(parseInt(e.target.value, 10) || 1); // Kullanıcı elle değiştirebilir
              }}
              required
              style={{ width: '80px', paddingRight: '8px' }}
              min={1}
            />

            {/* Para Birimi Seçici */}
            <Dropdown>
              <Dropdown.Toggle variant="phoenix-secondary">
                {currency}
              </Dropdown.Toggle>
              <Dropdown.Menu className="py-2">
                <Dropdown.Item onClick={() => handleCurrencyChange('USD$')}>
                  USD$
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleCurrencyChange('EUR€')}>
                  EUR€
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleCurrencyChange('GBP£')}>
                  GBP£
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={() => handleCurrencyChange('TRY₺')}>
                  TRY₺
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Form.Group>

          <Card style={{ width: '12rem' }} className="border-0 mb-5">
            <Card.Img variant="top" src={Reka_Static} />
            <Card.Body className="p-0 px-1 fs-9">
              <Card.Text className="mb-1">
                Bahcelievler Mah. 274/1. Sokak No:1 Ofis:16 06830 Golbasi /
                Ankara TURKEY
              </Card.Text>
              <Card.Text className="mb-1">
                Phone: 0090 (312) 809 66 90
              </Card.Text>
              <Card.Text>Mobile: 0090 (507) 900 90 77</Card.Text>
            </Card.Body>
          </Card>
        </div>

        <div className="upperrightsection">
          <div className="quote-section mb-4 mt-6">
            {/* Başlık */}
            <h2 className="text-primary">QUOTE</h2>

            {/* Tarih Seçici */}
            <Form.Group className="date-picker d-inline-block mt-3">
              <DatePicker placeholder="Date" />
            </Form.Group>

            {/* Teklif Numarası */}
            <p className="mt-2 small mt-3">
              <strong>Quote Number:</strong> {quoteNumber}
            </p>

            {/* Revizyon Numarası */}
            <p className="small text-primary">REVISION {revisionNumber}</p>
          </div>
        </div>
      </div>
      <Table bordered hover size="sm" id="client-info-form1">
        <thead>
          <tr className="bg-primary text-white text-center align-middle">
            <td colSpan={3} className="text-white">
              CLIENT LOCATION
            </td>
            <td className="text-white">SHIP TO</td>
          </tr>
        </thead>
        <tbody>
          <tr className="text-center align-middle">
            <td colSpan={3}>Destination</td>
            <td></td>
          </tr>
          <tr className="bg-primary text-white text-center align-middle">
            <td className="text-white" style={{ width: '25%' }}>
              REQUISITIONER
            </td>
            <td className="text-white" style={{ width: '25%' }}>
              SHIP VIA
            </td>
            <td className="text-white" style={{ width: '25%' }}>
              CPT
            </td>
            <td className="text-white" style={{ width: '25%' }}>
              SHIPPING TERMS
            </td>
          </tr>
          <tr className="text-center align-middle">
            <td style={{ width: '25%' }}></td>
            <td style={{ width: '25%' }}></td>
            <td style={{ width: '25%' }}></td>
            <td style={{ width: '25%' }}>EXW IST</td>
          </tr>
        </tbody>
      </Table>

      <div>
        <Table bordered hover size="sm" responsive>
          <thead>
            <tr className="bg-primary text-white text-center">
              <td className="text-white align-middle">PART NUMBER (PN)</td>
              <td className="text-white align-middle">ALTERNATIVE TO</td>
              <td className="text-white align-middle">DESCRIPTION</td>
              <td className="text-white align-middle">LEAD TIME (DAYS)</td>
              <td className="text-white align-middle">QTY</td>
              <td className="text-white align-middle">UNIT PRICE</td>
              <td className="text-white align-middle">TOTAL</td>
              <td className="text-white align-middle">ACTIONS</td>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="text-center align-middle">
                <td>
                  {row.isNew ? (
                    <Form.Control
                      type="text"
                      value={row.partNumber}
                      onChange={e =>
                        handleCellChange(index, 'partNumber', e.target.value)
                      }
                    />
                  ) : (
                    row.partNumber
                  )}
                </td>
                <td>
                  {row.isNew ? (
                    <Form.Control
                      type="text"
                      value={row.alternativeTo}
                      onChange={e =>
                        handleCellChange(index, 'alternativeTo', e.target.value)
                      }
                    />
                  ) : (
                    row.alternativeTo || '-'
                  )}
                </td>
                <td>
                  {row.isNew ? (
                    <Form.Control
                      type="text"
                      value={row.description}
                      onChange={e =>
                        handleCellChange(index, 'description', e.target.value)
                      }
                    />
                  ) : (
                    row.description
                  )}
                </td>
                <td>
                  {row.isNew ? (
                    <div className="d-flex align-items-center">
                      <Form.Control
                        type="number"
                        value={row.leadTime}
                        onChange={e =>
                          handleCellChange(index, 'leadTime', e.target.value)
                        }
                        style={{ width: '60px' }}
                        min={1}
                      />
                      <span className="ms-2">Days</span>
                    </div>
                  ) : (
                    `${row.leadTime} Days`
                  )}
                </td>
                <td>
                  <Form.Control
                    type="number"
                    value={row.qty}
                    onChange={e =>
                      handleCellChange(
                        index,
                        'qty',
                        parseInt(e.target.value, 10)
                      )
                    }
                    min={1}
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    value={row.unitPrice}
                    onChange={e =>
                      handleCellChange(
                        index,
                        'unitPrice',
                        parseFloat(e.target.value)
                      )
                    }
                    step="0.01"
                    disabled={!row.isNew}
                  />
                </td>
                <td>
                  {(row.qty * row.unitPrice).toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  })}
                </td>

                {/* Butonlar için boş sütun */}
                <td className="button-cell">
                  <div className="action-buttons">
                    <Button
                      variant="success"
                      size="sm"
                      className="me-2"
                      onClick={() => addRow(index)}
                    >
                      +
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => deleteRow(index)}
                    >
                      -
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <div className="footer-section mt-5">
        <Row className="g-3">
          {/* İlk Bölüm: Comments or Special Instructions */}
          <Col md={8}>
            <Table striped bordered hover className="mb-3">
              <thead>
                <tr>
                  <th className="text-center">
                    Comments or Special Instructions
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2">
                    All parts are FACTORY NEW (FN), unless indicated.
                    <br />
                    Our Manufacturer's Certificate of Conformance is included
                    with our Packing List / Invoice. Valid for 10 Days
                    <br />
                    TBD (To Be Determined): The costs indicated as TBD will be
                    calculated when the quantities and items of quote is
                    approved by the customer.
                    <br />
                    LT (Lead Time): Lead times start on the day the invoice of
                    this quote is paid.
                  </td>
                </tr>
              </tbody>
            </Table>
          </Col>

          {/* İkinci Bölüm: Sub-Total ve Total */}
          <Col md={4}>
            <div className="d-flex flex-column text-center">
              <Table bordered size="sm" className="sub-total-table mb-3">
                <thead>
                  <tr>
                    <th>Sub-Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="text-sm-md">Customs in Turkey</td>
                    <td>
                      <Form.Check type="checkbox" defaultChecked />
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        defaultValue={0}
                        min={0}
                        className="py-1"
                        style={{ width: '80px' }} // Genişlik azaltıldı
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="text-sm-md">Aircargo to TURKEY</td>
                    <td>
                      <Form.Check type="checkbox" defaultChecked />
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        defaultValue={0}
                        min={0}
                        className="py-1"
                        style={{ width: '80px' }} // Genişlik azaltıldı
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="text-sm-md">Aircargo to Destination</td>
                    <td>
                      <Form.Check type="checkbox" />
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        defaultValue={0}
                        min={0}
                        className="py-1"
                        style={{ width: '80px' }} // Genişlik azaltıldı
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="text-sm-md">Aircargo to Destination</td>
                    <td>
                      <Form.Check type="checkbox" />
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        defaultValue={0}
                        min={0}
                        className="py-1"
                        style={{ width: '80px' }} // Genişlik azaltıldı
                      />
                    </td>
                  </tr>
                </tbody>
                <thead>
                  <tr>
                    <th className="text-sm-md">Total</th>
                    <td></td>
                    <td className="text-center"></td>
                  </tr>
                </thead>
              </Table>
            </div>
          </Col>
          <Table striped bordered hover className="mb-3 text-center">
            <thead>
              <tr>
                <th className="text-center">
                  Comments or Special Instructions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2">
                  Delivery: Destination Custom and related TAX and costs shall
                  be paid by Client.
                </td>
              </tr>
            </tbody>
          </Table>
          <Table striped bordered hover className="mb-3 text-center">
            <tbody>
              <tr>
                <td className="p-2">
                  If you have any questions about this quote, please contact:
                  <br />
                  info@rekaglobal.com | Tel: +90 312 809 66 90 | Mobile: +90 507
                  900 90 77
                  <br />
                </td>
              </tr>
            </tbody>
          </Table>
        </Row>
      </div>
    </>
  );
};

export default WizardAccountForm;
