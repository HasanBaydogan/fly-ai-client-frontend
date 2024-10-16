import PhoenixDocCard from 'components/base/PhoenixDocCard';
import PhoenixDroppable from 'components/base/PhoenixDroppable';
import DocPageHeader from 'components/docs/DocPageHeader';
import DocPagesLayout from 'layouts/DocPagesLayout';
import { useState } from 'react';
import { DragDropContext, Draggable, DropResult } from 'react-beautiful-dnd';
import { Card, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface ColumnDataType {
  id: string;
  tasks: {
    id: string;
    title: string;
  }[];
}

const data: ColumnDataType[] = [
  {
    id: '1',
    tasks: [
      {
        id: '1',
        title: 'Add a pdf file that describes all the symptoms of COVID-19'
      },
      {
        id: '2',
        title:
          'Make a Registration form that include Name, Email and a Password input field'
      },
      {
        id: '3',
        title:
          'Add a cookie notice which will be shown in the bottom of the page and have a link of "Privacy Policy"'
      },
      {
        id: '4',
        title:
          'Update profile page layout with cover image and user setting menu'
      }
    ]
  },
  {
    id: '2',
    tasks: [
      {
        id: '5',
        title:
          'Update all the npm packages and also remove the outdated plugins'
      },
      {
        id: '6',
        title:
          'Add a getting started page that allows users to see the starting process'
      },
      {
        id: '7',
        title: 'Review and test all the task and deploy to the server'
      },
      {
        id: '8',
        title:
          'Get all the data by API call and show them to the landing page by adding a new section'
      }
    ]
  }
];

const exampleCode = `
import { useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult
} from 'react-beautiful-dnd';
import PhoenixDroppable from 'components/base/PhoenixDroppable';

interface ColumnDataType {
  id: string;
  tasks: {
    id: string;
    title: string;
  }[];
}

const data: ColumnDataType[] = [
  {
    id: '1',
    tasks: [
      {
        id: '1',
        title: 'Add a pdf file that describes all the symptoms of COVID-19'
      },
      {
        id: '2',
        title:
          'Make a Registration form that include Name, Email and a Password input field'
      },
      {
        id: '3',
        title:
          'Add a cookie notice which will be shown in the bottom of the page and have a link of "Privacy Policy"'
      },
      {
        id: '4',
        title:
          'Update profile page layout with cover image and user setting menu'
      }
    ]
  },
  {
    id: '2',
    tasks: [
      {
        id: '5',
        title:
          'Update all the npm packages and also remove the outdated plugins'
      },
      {
        id: '6',
        title:
          'Add a getting started page that allows users to see the starting process'
      },
      {
        id: '7',
        title: 'Review and test all the task and deploy to the server'
      },
      {
        id: '8',
        title:
          'Get all the data by API call and show them to the landing page by adding a new section'
      }
    ]
  }
];

function Example() {
  const [columns, setColumns] = useState(data);

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (destination) {
      const updatedList = [...columns];
      const task = updatedList
        .find(list => list.id === source.droppableId)
        ?.tasks.splice(source.index, 1)[0];

      if (task && destination) {
        columns
          .find(list => list.id === destination.droppableId)
          ?.tasks.splice(destination.index, 0, task);
      }
      setColumns(updatedList);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Row>
        {columns.map(list => (
          <Col lg={6} key={list.id}>
            <PhoenixDroppable key={list.id} droppableId={list.id}>
              {provided => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {list.tasks.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id}
                      index={index}
                    >
                      {provided => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="mb-3"
                        >
                          <Card.Body>
                            <p className="mb-0 fw-medium">{task.title}</p>
                          </Card.Body>
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </PhoenixDroppable>
          </Col>
        ))}
      </Row>
    </DragDropContext>
  )
}
`;

const DraggableExample = () => {
  return (
    <div className="mb-9">
      <DocPageHeader
        title="Draggable"
        description={`${process.env.REACT_APP_TITLE}-React utilizes react-beautiful-dnd for its draggable component. React-beautiful-dnd is designed to create visually appealing drag-and-drop functionality for lists, making it accessible to all.`}
        link={{
          text: 'react-beautiful-dnd Documentation',
          url: 'https://github.com/atlassian/react-beautiful-dnd'
        }}
      />
      <DocPagesLayout>
        <PhoenixDocCard>
          <PhoenixDocCard.Header title="Example">
            <p className="mb-0">
              Here is the example of the Multiple Container Sortable feature of
              the <code>react-beautiful-dnd</code> library. We also design{' '}
              <Link to="/apps/kanban/kanban">Kanban</Link> using this{' '}
              <code>react-beautiful-dnd</code> Library.{' '}
              <b>You can drag any card in between the two columns below:</b>
            </p>
          </PhoenixDocCard.Header>
          <PhoenixDocCard.Body code={exampleCode} hidePreview>
            <Example />
          </PhoenixDocCard.Body>
        </PhoenixDocCard>
      </DocPagesLayout>
    </div>
  );
};

const Example = () => {
  const [columns, setColumns] = useState(data);

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (destination) {
      const updatedList = [...columns];
      const task = updatedList
        .find(list => list.id === source.droppableId)
        ?.tasks.splice(source.index, 1)[0];

      if (task && destination) {
        columns
          .find(list => list.id === destination.droppableId)
          ?.tasks.splice(destination.index, 0, task);
      }
      setColumns(updatedList);
    }
  };
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Row>
        {columns.map(list => (
          <Col lg={6} key={list.id}>
            <PhoenixDroppable key={list.id} droppableId={list.id}>
              {provided => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {list.tasks.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id}
                      index={index}
                    >
                      {provided => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="mb-3"
                        >
                          <Card.Body>
                            <p className="mb-0 fw-medium">{task.title}</p>
                          </Card.Body>
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </PhoenixDroppable>
          </Col>
        ))}
      </Row>
    </DragDropContext>
  );
};

export default DraggableExample;
