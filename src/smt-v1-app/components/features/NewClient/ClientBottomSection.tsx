// ClientBottomSection.tsx
import React from 'react';
import { Table, Row, Col, Button } from 'react-bootstrap';

interface Comment {
  comment: string;
  severity: string;
  isEditing: boolean;
}

interface ClientBottomSectionProps {
  // Fiyat marjlarını yerel tutmaya devam edebilirsiniz.
  userComments: Comment[];
  setUserComments: React.Dispatch<React.SetStateAction<Comment[]>>;
}

const ClientBottomSection = ({
  userComments,
  setUserComments
}: ClientBottomSectionProps) => {
  const initialPriceMargins = {
    below200: 0,
    btw200and500: 0,
    btw500and1_000: 0,
    btw1_000and5_000: 0,
    btw5_000and10_000: 0,
    btw10_000and50_000: 0,
    btw50_000and100_000: 0,
    btw100_000and150_000: 0,
    btw150_000and200_000: 0,
    btw200_000and400_000: 0,
    btw400_000and800_000: 0,
    btw800_000and1_000_000: 0,
    btw1_000_000and2_000_000: 0,
    btw2_000_000and4_000_000: 0,
    above4_000_000: 0
  };

  const keyDisplayMap = {
    below200: 'Below 200',
    btw200and500: 'Btw 200-500',
    btw500and1_000: 'Btw 500-1,000',
    btw1_000and5_000: 'Btw 1,000-5,000',
    btw5_000and10_000: 'Btw 5,000-10,000',
    btw10_000and50_000: 'Btw 10,000-50,000',
    btw50_000and100_000: 'Btw 50,000-100,000',
    btw100_000and150_000: 'Btw 100,000-150,000',
    btw150_000and200_000: 'Btw 150,000-200,000',
    btw200_000and400_000: 'Btw 200,000-400,000',
    btw400_000and800_000: 'Btw 400,000-800,000',
    btw800_000and1_000_000: 'Btw 800,000-1,000,000',
    btw1_000_000and2_000_000: 'Btw 1,000,000-2,000,000',
    btw2_000_000and4_000_000: 'Btw 2,000,000-4,000,000',
    above4_000_000: 'Above 4,000,000'
  };

  const [priceMargins, setPriceMargins] = React.useState(initialPriceMargins);

  const handlePriceChange = (key: string, inputValue: string) => {
    let value = inputValue.trim();
    value = value.replace('.', ',');

    const endsWithComma = value.endsWith(',');

    const parts = value.split(',');
    let integerPart = parts[0].replace(/\D/g, '');
    let decimalPart = parts[1] ? parts[1].replace(/\D/g, '') : '';

    if (integerPart.length > 2) {
      integerPart = integerPart.slice(0, 2);
    }

    let intNumber = parseInt(integerPart, 10);
    if (isNaN(intNumber)) intNumber = 0;
    if (intNumber > 99) {
      intNumber = 99;
      integerPart = '99';
    }

    if (decimalPart.length > 4) {
      decimalPart = decimalPart.slice(0, 4);
    }

    let formattedValue = integerPart;
    if (decimalPart.length > 0) {
      formattedValue += ',' + decimalPart;
    } else if (endsWithComma) {
      formattedValue += ',';
    }

    setPriceMargins(prev => ({ ...prev, [key]: formattedValue }));
  };

  const handleCommentChange = (
    index: number,
    field: 'comment' | 'severity',
    value: string
  ) => {
    const updatedComments = [...userComments];
    updatedComments[index][field] = value;
    setUserComments(updatedComments);
  };

  const addCommentRow = () => {
    setUserComments(prev => [
      ...prev,
      { comment: '', severity: '', isEditing: true }
    ]);
  };

  const saveCommentRow = (index: number) => {
    const updatedComments = [...userComments];
    updatedComments[index].isEditing = false;
    setUserComments(updatedComments);
  };

  const editCommentRow = (index: number) => {
    const updatedComments = [...userComments];
    updatedComments[index].isEditing = true;
    setUserComments(updatedComments);
  };

  const deleteCommentRow = (index: number) => {
    const updatedComments = userComments.filter((_, i) => i !== index);
    setUserComments(updatedComments);
  };

  // handleSubmit fonksiyonu (örnek payload oluşturma vs.) parent'ta da kullanılabilir.
  // Eğer ClientBottomSection içinden submit işlemi yapılmayacaksa bu fonksiyonu kaldırabilirsiniz.

  return (
    <>
      <Row className="mt-5 gap-4">
        {/* Margin Table */}
        <Col md={4}>
          <h5 className="mb-3 text-center ml-5">Margin Table</h5>
          <Table
            striped
            bordered
            hover
            size="sm"
            className="bg-white p-3 shadow-sm text-center"
          >
            <thead className="table-light">
              <tr>
                <th style={{ width: '75%' }}>Key</th>
                <th style={{ width: '25%' }}>Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(priceMargins).map(([key, value]) => (
                <tr key={key}>
                  <td className="align-middle">{keyDisplayMap[key] || key}</td>
                  <td className="align-middle">
                    <input
                      type="text"
                      className="form-control text-center p-0"
                      value={value}
                      onChange={e => handlePriceChange(key, e.target.value)}
                      style={{ width: '80px', height: '25px' }}
                      placeholder="Ör: 1,234"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>

        {/* User Comments Table */}
        <Col md={7}>
          <h5 className="mb-3 text-center">User Comments</h5>
          <Table
            striped
            bordered
            hover
            className="bg-white p-3 shadow-sm text-center"
          >
            <thead className="table-light">
              <tr>
                <th style={{ width: '60%' }}>Comment</th>
                <th style={{ width: '25%' }}>Severity</th>
                <th style={{ width: '15%' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {userComments.map((item, index) => (
                <tr key={index}>
                  <td className="align-middle p-3">
                    {item.isEditing ? (
                      <textarea
                        className="form-control"
                        value={item.comment}
                        onChange={e =>
                          handleCommentChange(index, 'comment', e.target.value)
                        }
                        placeholder="Enter comment"
                        style={{ width: '95%', resize: 'vertical' }}
                        rows={1} // Başlangıç yüksekliği 1 satır
                      />
                    ) : (
                      <span>{item.comment}</span>
                    )}
                  </td>
                  <td className="align-middle">
                    {item.isEditing ? (
                      <input
                        type="text"
                        className="form-control"
                        value={item.severity}
                        onChange={e =>
                          handleCommentChange(index, 'severity', e.target.value)
                        }
                        placeholder="Enter severity"
                        style={{ width: '95%' }}
                      />
                    ) : (
                      <span>{item.severity}</span>
                    )}
                  </td>
                  <td className="align-middle">
                    <div
                      style={{
                        display: 'flex',
                        gap: '5px',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      {item.isEditing ? (
                        <>
                          <Button
                            variant="success"
                            size="sm"
                            style={{
                              fontSize: '1rem',
                              padding: '0.25rem 0.5rem'
                            }}
                            onClick={() => saveCommentRow(index)}
                          >
                            ✓
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            style={{
                              fontSize: '1rem',
                              padding: '0.25rem 0.5rem'
                            }}
                            onClick={() => deleteCommentRow(index)}
                          >
                            X
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="secondary"
                            size="sm"
                            style={{
                              fontSize: '0.95rem',
                              padding: '0.25rem 0.5rem'
                            }}
                            onClick={() => editCommentRow(index)}
                          >
                            ✏️
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            style={{
                              fontSize: '1rem',
                              padding: '0.25rem 0.5rem'
                            }}
                            onClick={() => deleteCommentRow(index)}
                          >
                            X
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Button variant="secondary" onClick={addCommentRow}>
            Add Comment
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default ClientBottomSection;
