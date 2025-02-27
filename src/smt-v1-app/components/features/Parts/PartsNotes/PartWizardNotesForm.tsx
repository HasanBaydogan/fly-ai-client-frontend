import { useState, useEffect, useCallback } from 'react';
import {
  Card,
  Button,
  Form,
  Dropdown,
  Pagination,
  Row,
  Col
} from 'react-bootstrap';
import redPin from 'assets/icons/redPin.svg';
import bluePin from 'assets/icons/bluePin.svg';
import burlywoodPin from 'assets/icons/burlywoodPin.svg';
import greenPin from 'assets/icons/greenPin.svg';
import skybluePin from 'assets/icons/skybluePin.svg';
import brownPin from 'assets/icons/brownPin.svg';
import violetPin from 'assets/icons/violetPin.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleLeft,
  faAngleRight,
  faAnglesLeft,
  faAnglesRight
} from '@fortawesome/free-solid-svg-icons';
import {
  searchByNoteList,
  postNewNotes,
  putUpdateNotes
} from 'smt-v1-app/services/PartServices';

const noteTypes = [
  { label: 'Import/Export Compliance Notes', icon: brownPin },
  { label: 'Important Notes', icon: redPin },
  { label: 'Logistic Notes', icon: violetPin },
  { label: 'Purchasing Notes', icon: burlywoodPin },
  { label: 'RMA/Warranty', icon: skybluePin },
  { label: 'Sales Notes', icon: greenPin },
  { label: 'Technical Notes', icon: bluePin }
];

interface Note {
  id: string;
  author: string;
  text: string;
  category: string;
}

export interface newNotePayload {
  partId: string;
  noteContent: string;
  partNoteType: string;
}

export interface updatePayload {
  noteId: string;
  noteContent: string;
  noteType: string;
}

const getNoteTypeCode = (category: string): string => {
  switch (category) {
    case 'Import/Export Compliance Notes':
      return 'IMP_EXP_COMP';
    case 'Sales Notes':
      return 'SALES';
    case 'Purchasing Notes':
      return 'PURCHASING';
    case 'Important Notes':
      return 'IMPORTANT';
    case 'Logistic Notes':
      return 'LOGISTIC';
    case 'RMA/Warranty':
      return 'RMA_WARRANTY';
    case 'Technical Notes':
      return 'TECHNICAL';
    default:
      return category;
  }
};

const PartWizardNotesForm = () => {
  // Sabit/mock partId ve pageSize tanımları
  const mockPartId = '67beca31fe6dd91452462c77';
  const pageSize = 5;

  const [notes, setNotes] = useState<Note[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);

  // noteForm id'sini string | null olarak ayarladık
  const [noteForm, setNoteForm] = useState<{
    id: string | null;
    author: string;
    text: string;
    category: string;
  }>({
    id: null,
    author: 'New User',
    text: '',
    category: 'Sales Notes'
  });

  const [showForm, setShowForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');

  const mapNoteType = (noteType: string): string => {
    switch (noteType) {
      case 'IMP_EXP_COMP':
        return 'Import/Export Compliance Notes';
      case 'SALES':
        return 'Sales Notes';
      case 'PURCHASING':
        return 'Purchasing Notes';
      case 'IMPORTANT':
        return 'Important Notes';
      case 'LOGISTIC':
        return 'Logistic Notes';
      case 'RMA_WARRANTY':
        return 'RMA/Warranty';
      case 'TECHNICAL':
        return 'Technical Notes';
      default:
        return noteType;
    }
  };

  // API'den notları, güncel sayfa ve sabit partId kullanarak çekiyoruz.
  const fetchNotes = useCallback(
    async (page: number) => {
      try {
        const response = await searchByNoteList(pageSize, page, mockPartId);
        // console.log('API Response:', response);
        if (response && response.data) {
          const data = response.data;
          const mappedNotes: Note[] = data.allNotes.map((note: any) => ({
            id: note.id,
            author: note.author,
            text: note.noteContent,
            category: mapNoteType(note.noteType)
          }));
          setNotes(mappedNotes);
          setTotalPages(data.totalPages);
          setTotalItems(data.totalItems);
        }
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    },
    [mockPartId, pageSize]
  );

  useEffect(() => {
    fetchNotes(currentPage);
  }, [currentPage, fetchNotes]);

  const filteredNotes =
    filterCategory === 'all'
      ? notes
      : notes.filter(note => note.category === filterCategory);

  const handleSaveNote = async () => {
    if (noteForm.text.trim() === '') return;

    if (noteForm.id) {
      const updatePayload: updatePayload = {
        noteId: noteForm.id,
        noteContent: noteForm.text,
        noteType: getNoteTypeCode(noteForm.category)
      };
      try {
        const result = await putUpdateNotes(updatePayload);
        if (result && result.success) {
          fetchNotes(currentPage);
        } else {
          console.error('Error updating note:', result);
        }
      } catch (error) {
        console.error('Error updating note:', error);
      }
    } else {
      // Yeni not ekleme işlemi
      const newPayload: newNotePayload = {
        partId: mockPartId,
        noteContent: noteForm.text,
        partNoteType: getNoteTypeCode(noteForm.category)
      };
      try {
        const result = await postNewNotes(newPayload);
        if (!result) {
          console.error('No result returned from postNewNotes');
          return;
        }
        if (result.success) {
          fetchNotes(currentPage);
        } else {
          console.error('Error creating note:', result);
        }
      } catch (error) {
        console.error('Error creating note:', error);
      }
    }

    setShowForm(false);
    setNoteForm({
      id: null,
      author: 'New User',
      text: '',
      category: 'Sales Notes'
    });
  };

  const handleEdit = (note: Note) => {
    setNoteForm({
      id: note.id,
      author: note.author,
      text: note.text,
      category: note.category
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Dropdown>
          <Dropdown.Toggle variant="secondary">
            {filterCategory === 'all' ? 'All Notes' : filterCategory}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item
              onClick={() => setFilterCategory('all')}
              eventKey="all"
            >
              All Notes
            </Dropdown.Item>
            {noteTypes.map((type, index) => (
              <Dropdown.Item
                key={index}
                onClick={() => setFilterCategory(type.label)}
                eventKey={type.label}
              >
                <img
                  src={type.icon}
                  alt="note icon"
                  style={{ width: '16px', height: '16px', marginRight: '8px' }}
                />
                {type.label}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        {!showForm && (
          <Button variant="primary" onClick={() => setShowForm(true)}>
            Add New Note
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="mb-3">
          <Card.Body>
            <Card.Title>
              {noteForm.id ? 'Edit Note' : 'Add New Note'}
            </Card.Title>
            <Dropdown
              onSelect={eventKey =>
                setNoteForm({ ...noteForm, category: eventKey as string })
              }
            >
              <Dropdown.Toggle variant="phoenix-secondary">
                <img
                  src={
                    noteTypes.find(n => n.label === noteForm.category)?.icon ||
                    redPin
                  }
                  alt="note icon"
                  style={{ width: '16px', height: '16px' }}
                />{' '}
                {noteForm.category}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {noteTypes.map((type, index) => (
                  <Dropdown.Item key={index} eventKey={type.label}>
                    <img
                      src={type.icon}
                      alt="note icon"
                      style={{
                        width: '16px',
                        height: '16px',
                        marginRight: '8px'
                      }}
                    />
                    {type.label}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            <Form.Control
              as="textarea"
              rows={3}
              className="mt-2"
              value={noteForm.text}
              onChange={e => setNoteForm({ ...noteForm, text: e.target.value })}
            />
            <div className="mt-3">
              <Button variant="success" onClick={handleSaveNote}>
                {noteForm.id ? 'Save Changes' : 'Add Note'}
              </Button>
              <Button
                variant="secondary"
                className="ms-2"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </div>
          </Card.Body>
        </Card>
      )}

      {filteredNotes.length > 0 ? (
        filteredNotes.map(note => (
          <Card key={note.id} className="mb-3">
            <Card.Body>
              <Card.Title>
                <div className="d-flex justify-content-between align-items-center">
                  <span>{note.author}</span>
                  <div className="d-flex align-items-center">
                    <small className="text-muted">{note.category}</small>
                    <img
                      src={
                        noteTypes.find(n => n.label === note.category)?.icon ||
                        redPin
                      }
                      alt="note icon"
                      className="ms-2"
                      style={{ width: '26px', height: '26px' }}
                    />
                  </div>
                </div>
              </Card.Title>
              <Card.Text>{note.text}</Card.Text>
              <div className="mt-2">
                <Button
                  variant="success"
                  className="me-2"
                  onClick={() => handleEdit(note)}
                >
                  Edit
                </Button>
                <Button variant="danger" onClick={() => handleDelete(note.id)}>
                  Delete
                </Button>
              </div>
            </Card.Body>
          </Card>
        ))
      ) : (
        <p>No notes found.</p>
      )}

      {/* Pagination Bölümü */}
      <div className="mb-0">
        <Row className="align-items-center">
          <Col className="text-start">
            <p className="mt-3 mb-0">Total Notes: {totalItems}</p>
          </Col>
          <Col className="text-end">
            <Pagination className="d-flex align-items-center justify-content-end">
              <Pagination.Prev
                onClick={() =>
                  currentPage > 1 && setCurrentPage(currentPage - 1)
                }
                disabled={currentPage === 1}
              />
              {Array.from({ length: totalPages }, (_, i) => (
                <Pagination.Item
                  key={i + 1}
                  active={i + 1 === currentPage}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={() =>
                  currentPage < totalPages && setCurrentPage(currentPage + 1)
                }
                disabled={currentPage === totalPages}
              />
            </Pagination>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default PartWizardNotesForm;
