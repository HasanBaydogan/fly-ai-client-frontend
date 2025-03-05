import { useEffect, useState } from 'react';
import {
  Col,
  Dropdown,
  Form,
  Row,
  Button,
  Modal,
  Alert
} from 'react-bootstrap';
import PartUDFList, { udfTableColumns } from './PartUDFList';
import { UDFData, postUDFCreate } from 'smt-v1-app/services/PartServices';
// İhtiyaç varsa diğer servis ve hook importları (ör. searchBySupplierList) eklenebilir.
import useAdvanceTable from 'hooks/useAdvanceTable';
import { ColumnDef } from '@tanstack/react-table';
import AdvanceTableProvider from 'providers/AdvanceTableProvider';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const PartWizardUserDefFieldsForm = () => {
  // UDF verilerini tutmak için UDFData tipi kullanılıyor.
  const [data] = useState<UDFData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pageIndex] = useState<number>(1);

  // Form görünürlüğü ve modalleri
  const [showUDFForm, setShowUDFForm] = useState<boolean>(false);
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);

  // Form alanları
  const [selectedFieldType, setSelectedFieldType] = useState<string>('');
  const [fieldName, setFieldName] = useState<string>('');
  const [textFieldDefault, setTextFieldDefault] = useState<string>('');
  const [numberFieldDefault, setNumberFieldDefault] = useState<string>('');
  const [textChoices, setTextChoices] = useState<string[]>([]);
  const [textChoiceInput, setTextChoiceInput] = useState<string>('');
  const [selectedMultipleTextChoice, setSelectedMultipleTextChoice] =
    useState<string>('');
  const [numberChoices, setNumberChoices] = useState<string[]>([]);
  const [numberChoiceInput, setNumberChoiceInput] = useState<string>('');
  const [selectedMultipleNumberChoice, setSelectedMultipleNumberChoice] =
    useState<string>('');

  // Choice ekleme ve silme fonksiyonları
  const addTextChoice = () => {
    const choice = textChoiceInput.trim();
    if (choice && !textChoices.includes(choice)) {
      setTextChoices([...textChoices, choice]);
      setTextChoiceInput('');
    }
  };

  const addNumberChoice = () => {
    const choice = numberChoiceInput.trim();
    if (choice && !numberChoices.includes(choice)) {
      setNumberChoices([...numberChoices, choice]);
      setNumberChoiceInput('');
    }
  };

  const removeTextChoice = (index: number) => {
    setTextChoices(prev => prev.filter((_, i) => i !== index));
    if (selectedMultipleTextChoice === textChoices[index])
      setSelectedMultipleTextChoice('');
  };

  const removeNumberChoice = (index: number) => {
    setNumberChoices(prev => prev.filter((_, i) => i !== index));
    if (selectedMultipleNumberChoice === numberChoices[index])
      setSelectedMultipleNumberChoice('');
  };

  // Örnek veri çekimi (supplier verisi yerine burada sadece loading durumu)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Eğer başka bir veri çekimi gerekiyorsa ekleyin.
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [pageIndex]);

  const table = useAdvanceTable({
    data,
    columns: udfTableColumns as ColumnDef<UDFData>[],
    pageSize: 6,
    pagination: true,
    sortable: true
  });

  if (loading) return <div>Loading...</div>;

  // Yeni UDF oluşturma API çağrısı
  const handleSave = async () => {
    // partId burada mevcut değilse boş string olarak gönderiliyor. Gerekirse ilgili partId değerini ekleyin.
    let udfFieldType = '';
    let fieldStringValues: string[] = [];
    let fieldIntValues: number[] = [];

    if (selectedFieldType === 'Text Value') {
      udfFieldType = 'SINGLE_TEXT';
      fieldStringValues = [textFieldDefault];
    } else if (selectedFieldType === 'Number Value') {
      udfFieldType = 'SINGLE_NUMBER';
      fieldIntValues = [Number(numberFieldDefault)];
    } else if (selectedFieldType === 'Multiple Text Choice Value') {
      udfFieldType = 'MULTIPLE_TEXT';
      // Tüm seçenekleri gönderiyoruz; default seçenek de eklenebilir.
      fieldStringValues = textChoices;
    } else if (selectedFieldType === 'Multiple Number Choice Value') {
      udfFieldType = 'MULTIPLE_NUMBER';
      fieldIntValues = numberChoices.map(choice => Number(choice));
    }

    const payload = {
      partId: '', // Eğer mevcutsa ilgili partId'yi buraya ekleyin.
      fieldName,
      udfFieldType,
      fieldStringValues,
      fieldIntValues
    };

    try {
      console.log('Posting UDF data:', payload);
      await postUDFCreate(payload);
      alert('Field saved successfully!');
      resetForm();
    } catch (error) {
      console.error('Error saving field data:', error);
      alert('Error saving field data.');
    }
  };

  const resetForm = () => {
    setSelectedFieldType('');
    setFieldName('');
    setTextFieldDefault('');
    setNumberFieldDefault('');
    setTextChoices([]);
    setTextChoiceInput('');
    setSelectedMultipleTextChoice('');
    setNumberChoices([]);
    setNumberChoiceInput('');
    setSelectedMultipleNumberChoice('');
    setShowUDFForm(false);
  };

  return (
    <div>
      <AdvanceTableProvider {...table}>
        <div className="d-flex flex-wrap mb-2 gap-3 align-items-center">
          <Button
            className="btn btn-primary px-5"
            onClick={() => setShowUDFForm(true)}
            disabled={showUDFForm}
          >
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Add New UDF
          </Button>
        </div>
        <PartUDFList activeView={''} />

        {showUDFForm && (
          <>
            <Col sm={12} className="mt-5">
              <Dropdown className="d-inline mx-2">
                <Dropdown.Toggle
                  id="dropdown-autoclose-true"
                  variant="phoenix-primary"
                >
                  {selectedFieldType || 'Field Type'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() => setSelectedFieldType('Text Value')}
                  >
                    Text Value
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => setSelectedFieldType('Number Value')}
                  >
                    Number Value
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() =>
                      setSelectedFieldType('Multiple Text Choice Value')
                    }
                  >
                    Multiple Text Choice Value
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() =>
                      setSelectedFieldType('Multiple Number Choice Value')
                    }
                  >
                    Multiple Number Choice Value
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>

            {selectedFieldType &&
              (selectedFieldType === 'Multiple Text Choice Value' ||
              selectedFieldType === 'Multiple Number Choice Value' ? (
                <Row className="mt-3">
                  <Col md={4}>
                    <Form.Group controlId="fieldName">
                      <Form.Label>Field Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Field Name"
                        value={fieldName}
                        onChange={e => setFieldName(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group controlId="defaultChoice">
                      <Form.Label>Default Choice</Form.Label>
                      <Form.Select
                        value={
                          selectedFieldType === 'Multiple Text Choice Value'
                            ? selectedMultipleTextChoice
                            : selectedMultipleNumberChoice
                        }
                        onChange={e =>
                          selectedFieldType === 'Multiple Text Choice Value'
                            ? setSelectedMultipleTextChoice(e.target.value)
                            : setSelectedMultipleNumberChoice(e.target.value)
                        }
                      >
                        <option value="">Select Default Choice</option>
                        {(selectedFieldType === 'Multiple Text Choice Value'
                          ? textChoices
                          : numberChoices
                        ).map((choice, index) => (
                          <option key={index} value={choice}>
                            {choice}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group controlId="newChoice">
                      <Form.Label>New Option</Form.Label>
                      <div className="d-flex">
                        <Form.Control
                          type={
                            selectedFieldType === 'Multiple Number Choice Value'
                              ? 'number'
                              : 'text'
                          }
                          placeholder="Enter new option"
                          value={
                            selectedFieldType === 'Multiple Text Choice Value'
                              ? textChoiceInput
                              : numberChoiceInput
                          }
                          onChange={e =>
                            selectedFieldType === 'Multiple Text Choice Value'
                              ? setTextChoiceInput(e.target.value)
                              : setNumberChoiceInput(e.target.value)
                          }
                        />
                        <Button
                          className="btn btn-primary ms-2"
                          type="button"
                          onClick={
                            selectedFieldType === 'Multiple Text Choice Value'
                              ? addTextChoice
                              : addNumberChoice
                          }
                        >
                          Add
                        </Button>
                      </div>
                      {selectedFieldType === 'Multiple Text Choice Value' ? (
                        <ul className="mt-2 list-unstyled">
                          {textChoices.map((choice, index) => (
                            <li
                              key={index}
                              className="d-flex align-items-center"
                            >
                              <span>{choice}</span>
                              <Button
                                variant="link"
                                size="sm"
                                onClick={() => removeTextChoice(index)}
                                className="ms-2 p-0"
                              >
                                x
                              </Button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <ul className="mt-2 list-unstyled">
                          {numberChoices.map((choice, index) => (
                            <li
                              key={index}
                              className="d-flex align-items-center"
                            >
                              <span>{choice}</span>
                              <Button
                                variant="link"
                                size="sm"
                                onClick={() => removeNumberChoice(index)}
                                className="ms-2 p-0"
                              >
                                x
                              </Button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
              ) : (
                <Row className="mt-3">
                  <Col md={6}>
                    <Form.Group controlId="fieldName">
                      <Form.Label>Field Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Field Name"
                        value={fieldName}
                        onChange={e => setFieldName(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    {selectedFieldType === 'Text Value' && (
                      <Form.Group controlId="textValueFieldDefaultValue">
                        <Form.Label>Default Value (Text)</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter Default Value"
                          value={textFieldDefault}
                          onChange={e => setTextFieldDefault(e.target.value)}
                        />
                      </Form.Group>
                    )}
                    {selectedFieldType === 'Number Value' && (
                      <Form.Group controlId="numberValueFieldDefaultValue">
                        <Form.Label>Default Value (Number)</Form.Label>
                        <Form.Control
                          onWheel={e => (e.target as HTMLInputElement).blur()}
                          type="number"
                          placeholder="Enter Default Value"
                          min={0}
                          value={numberFieldDefault}
                          onChange={e => setNumberFieldDefault(e.target.value)}
                        />
                      </Form.Group>
                    )}
                  </Col>
                </Row>
              ))}
          </>
        )}

        {showUDFForm && (
          <Row className="mt-4">
            <Col className="d-flex justify-content-end gap-2">
              <Button
                variant="secondary"
                onClick={() => setShowCancelModal(true)}
              >
                Cancel
              </Button>
              <Button variant="success" onClick={() => setShowSaveModal(true)}>
                Save
              </Button>
            </Col>
          </Row>
        )}

        <Modal
          show={showCancelModal}
          onHide={() => setShowCancelModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirm Cancellation</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to discard all changes?</Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowCancelModal(false)}
            >
              No, Keep Changes
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setShowCancelModal(false);
                resetForm();
              }}
            >
              Yes, Discard
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={showSaveModal}
          onHide={() => setShowSaveModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirm Save</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to save the field data?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowSaveModal(false)}>
              No, Cancel
            </Button>
            <Button
              variant="success"
              onClick={() => {
                setShowSaveModal(false);
                handleSave();
              }}
            >
              Yes, Save
            </Button>
          </Modal.Footer>
        </Modal>
      </AdvanceTableProvider>
    </div>
  );
};

export default PartWizardUserDefFieldsForm;
