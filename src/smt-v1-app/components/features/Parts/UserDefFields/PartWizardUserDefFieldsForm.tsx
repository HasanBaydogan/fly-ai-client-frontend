import Avatar from 'components/base/Avatar';
import { useEffect, useState } from 'react';
import { Col, Dropdown, Form, Row, Button } from 'react-bootstrap';
import avatarPlaceholder from 'assets/img/team/avatar.webp';
import AvatarDropzone from 'components/common/AvatarDropzone';
import DatePicker from 'components/base/DatePicker';
import { WizardFormData } from 'pages/modules/forms/WizardExample';
import SupplierList, { projectListTableColumns } from './SupplierListTable';
import {
  searchBySupplierList,
  SupplierData
} from 'smt-v1-app/services/SupplierServices';
import useAdvanceTable from 'hooks/useAdvanceTable';
import { ColumnDef } from '@tanstack/react-table';
import AdvanceTableProvider from 'providers/AdvanceTableProvider';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ProjectsTopSection from 'components/modules/project-management/ProjectsTopSection';

const PartWizardUserDefFieldsForm = () => {
  const [data] = useState<SupplierData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pageIndex] = useState<number>(1);

  // UDF formunun görünürlüğünü kontrol eden state
  const [showUDFForm, setShowUDFForm] = useState<boolean>(false);
  // Ortak alanlar
  const [selectedFieldType, setSelectedFieldType] = useState<string>('');
  const [fieldName, setFieldName] = useState<string>('');
  // Text Value
  const [textFieldDefault, setTextFieldDefault] = useState<string>('');
  // Number Value
  const [numberFieldDefault, setNumberFieldDefault] = useState<string>('');
  // Multiple Text Choice
  const [textChoices, setTextChoices] = useState<string[]>([]);
  const [textChoiceInput, setTextChoiceInput] = useState<string>('');
  const [selectedMultipleTextChoice, setSelectedMultipleTextChoice] =
    useState<string>('');
  // Multiple Number Choice
  const [numberChoices, setNumberChoices] = useState<string[]>([]);
  const [numberChoiceInput, setNumberChoiceInput] = useState<string>('');
  const [selectedMultipleNumberChoice, setSelectedMultipleNumberChoice] =
    useState<string>('');

  const addTextChoice = () => {
    const choice = textChoiceInput.trim();
    // Sadece boş değilse ve listede yoksa ekle
    if (choice !== '' && !textChoices.includes(choice)) {
      setTextChoices([...textChoices, choice]);
      setTextChoiceInput('');
    }
  };

  const addNumberChoice = () => {
    const choice = numberChoiceInput.trim();
    // Sadece boş değilse ve listede yoksa ekle
    if (choice !== '' && !numberChoices.includes(choice)) {
      setNumberChoices([...numberChoices, choice]);
      setNumberChoiceInput('');
    }
  };

  const removeTextChoice = (index: number) => {
    const updatedChoices = textChoices.filter((_, i) => i !== index);
    setTextChoices(updatedChoices);
    if (selectedMultipleTextChoice === textChoices[index]) {
      setSelectedMultipleTextChoice('');
    }
  };

  const removeNumberChoice = (index: number) => {
    const updatedChoices = numberChoices.filter((_, i) => i !== index);
    setNumberChoices(updatedChoices);
    if (selectedMultipleNumberChoice === numberChoices[index]) {
      setSelectedMultipleNumberChoice('');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await searchBySupplierList('', pageIndex);
        if (response && response.data && response.data.suppliers) {
          // Supplier datasını işleyebilirsiniz
        }
      } catch (error) {
        console.error('Error fetching supplier data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [pageIndex]);

  const table = useAdvanceTable({
    data: data,
    columns: projectListTableColumns as ColumnDef<SupplierData>[],
    pageSize: 6,
    pagination: true,
    sortable: true
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  const postFieldData = async (payload: any) => {
    console.log('Posting field data:', payload);
    // Gerçek API entegrasyonunu burada yapabilirsiniz.
  };

  const handleSave = async () => {
    let payload: any = {
      fieldType: selectedFieldType,
      fieldName: fieldName
    };

    if (selectedFieldType === 'Text Value') {
      payload.defaultValue = textFieldDefault;
    } else if (selectedFieldType === 'Number Value') {
      payload.defaultValue = numberFieldDefault;
    } else if (selectedFieldType === 'Multiple Text Choice Value') {
      payload.choices = textChoices;
      payload.defaultChoice = selectedMultipleTextChoice;
    } else if (selectedFieldType === 'Multiple Number Choice Value') {
      payload.choices = numberChoices;
      payload.defaultChoice = selectedMultipleNumberChoice;
    }
    try {
      await postFieldData(payload);
      alert('Field saved successfully!');
      // Kaydetme sonrası formu kapatıyoruz.
      setShowUDFForm(false);
      handleCancel();
    } catch (error) {
      console.error('Error saving field data:', error);
      alert('Error saving field data.');
    }
  };

  const handleCancel = () => {
    // Tüm alanları resetliyoruz
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
    // UDF formunu kapatıyoruz.
    setShowUDFForm(false);
  };

  return (
    <div>
      <AdvanceTableProvider {...table}>
        <div className="d-flex flex-wrap mb-2 gap-3 gap-sm-6 align-items-center">
          <Button
            className="btn btn-primary px-5"
            onClick={() => setShowUDFForm(true)}
            disabled={showUDFForm}
          >
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Add New UDF
          </Button>
        </div>
        <SupplierList activeView={''} />

        {/* UDF formunu sadece showUDFForm true ise göster */}
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

            {/* Sadece bir field type seçildiyse input alanlarını göster */}
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
                        onChange={e => {
                          if (
                            selectedFieldType === 'Multiple Text Choice Value'
                          ) {
                            setSelectedMultipleTextChoice(e.target.value);
                          } else {
                            setSelectedMultipleNumberChoice(e.target.value);
                          }
                        }}
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
                          onChange={e => {
                            if (
                              selectedFieldType === 'Multiple Text Choice Value'
                            ) {
                              setTextChoiceInput(e.target.value);
                            } else {
                              setNumberChoiceInput(e.target.value);
                            }
                          }}
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
                      {/* Sade listeleme */}
                      {selectedFieldType === 'Multiple Text Choice Value' && (
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
                      )}
                      {selectedFieldType === 'Multiple Number Choice Value' && (
                        <ul className="mt-2 list-unstyled">
                          {numberChoices.map((choice, index) => (
                            <li
                              key={index}
                              className="d-flex align-items-center px-3"
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
                // Text Value ve Number Value için iki sütunlu düzen
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

        {/* Sayfanın altında Cancel ve Save butonları */}
        {showUDFForm && (
          <Row className="mt-4">
            <Col className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
              <Button variant="success" onClick={handleSave}>
                Save
              </Button>
            </Col>
          </Row>
        )}
      </AdvanceTableProvider>
    </div>
  );
};

export default PartWizardUserDefFieldsForm;
