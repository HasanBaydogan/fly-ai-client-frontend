import { useState } from 'react';
import { Card, Button, Form, Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbtack } from '@fortawesome/free-solid-svg-icons'; // This is no longer needed
import '@fortawesome/fontawesome-svg-core';
import redPin from 'assets/icons/redPin.svg'; // Import your custom redPin SVG
import bluePin from 'assets/icons/bluePin.svg';
import burlywoodPin from 'assets/icons/burlywoodPin.svg';
import greenPin from 'assets/icons/greenPin.svg';
import skybluePin from 'assets/icons/skybluePin.svg';
import brownPin from 'assets/icons/brownPin.svg';
import violetPin from 'assets/icons/violetPin.svg';

const noteTypes = [
  { label: 'Import/Export Compliance Notes', icon: brownPin }, // Use the redPin icon here
  { label: 'Important Notes', icon: redPin },
  { label: 'Logistic Notes', icon: violetPin },
  { label: 'Purchasing Notes', icon: burlywoodPin },
  { label: 'RMA/Warranty', icon: skybluePin },
  { label: 'Sales Notes', icon: greenPin },
  { label: 'Technical Notes', icon: bluePin }
];

const initialNotes = [
  {
    id: 1,
    author: 'Ahmet Durmaz',
    text: 'These are lifed parts: shelf-life = 7 years. Make sure demand expiry dates are recorded.',
    category: 'Import/Export Compliance Notes'
  },
  {
    id: 2,
    author: 'Kadir Beşiri',
    text: 'Ensure logistic records are updated before shipping.',
    category: 'Logistic Notes'
  }
];

const PartWizardNotesForm = () => {
  const [notes, setNotes] = useState(initialNotes);
  const [noteForm, setNoteForm] = useState({
    id: null as number | null,
    author: 'New User', // Default author
    text: '',
    category: 'Sales Notes'
  });

  const [showForm, setShowForm] = useState(false);

  // Save or update note
  const handleSaveNote = () => {
    if (noteForm.text.trim() === '') return; // Prevent adding empty notes

    if (noteForm.id) {
      setNotes(
        notes.map(note =>
          note.id === noteForm.id
            ? { ...note, text: noteForm.text, category: noteForm.category }
            : note
        )
      );
    } else {
      setNotes([
        ...notes,
        { ...noteForm, id: notes.length + 1, author: 'New User' }
      ]);
    }

    setShowForm(false);
    setNoteForm({
      id: null,
      author: 'New User',
      text: '',
      category: 'Sales Notes'
    });
  };

  // Edit note
  const handleEdit = note => {
    setNoteForm(note);
    setShowForm(true);
  };

  // Delete note
  const handleDelete = id => {
    setNotes(notes.filter(note => note.id !== id));
  };

  return (
    <div className="container mt-4">
      {/* Add New Note Button */}
      {!showForm && (
        <Button
          variant="primary"
          className="mb-3"
          onClick={() => setShowForm(true)}
        >
          Add New Note
        </Button>
      )}

      {/* New Note / Edit Form */}
      {showForm && (
        <Card className="mb-3">
          <Card.Body>
            <Card.Title>
              {noteForm.id ? 'Edit Note' : 'Add New Note'}
            </Card.Title>
            <Dropdown
              onSelect={eventKey =>
                setNoteForm({ ...noteForm, category: eventKey })
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

      {/* Notes List */}
      {notes.map(note => (
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
                    style={{ width: '26px', height: '26px' }} // Optional: Adjust icon size
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
      ))}
    </div>
  );
};

export default PartWizardNotesForm;
