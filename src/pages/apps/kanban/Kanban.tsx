import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from 'components/base/Button';
import PhoenixDroppable from 'components/base/PhoenixDroppable';
import KanbanAddListModal from 'components/modals/KanbanAddListModal';
import KanbanBoardOffcanvas from 'components/modules/kanban/KanbanBoardOffcanvas';
import KanbanHeader from 'components/modules/kanban/KanbanHeader';
import KanbanList from 'components/modules/kanban/KanbanList';
import KanbanProvider, { useKanbanContext } from 'providers/KanbanProvider';
import { useMainLayoutContext } from 'providers/MainLayoutProvider';
import { useEffect } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { TOGGLE_ADD_LIST_MODAL } from 'reducers/KanbanReducer';

const Kanban = () => {
  const { setContentClass } = useMainLayoutContext();

  useEffect(() => {
    setContentClass('kanban-content');

    return () => {
      setContentClass('');
    };
  }, []);

  return (
    <KanbanProvider>
      <KanbanContent />
    </KanbanProvider>
  );
};

const KanbanContent = () => {
  const { boardLists, kanbanDispatch } = useKanbanContext();
  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (destination) {
      kanbanDispatch({
        type: 'MOVE_ITEMS',
        payload: { source, destination }
      });
    }
  };

  return (
    <div>
      <KanbanHeader />
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="kanban-container scrollbar">
          {boardLists.map(list => (
            <PhoenixDroppable key={list.id} droppableId={list.id}>
              {provided => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  <KanbanList list={list} key={list.id} />
                  {provided.placeholder}
                </div>
              )}
            </PhoenixDroppable>
          ))}

          <div className="kanban-column scrollbar position-relative bg-transparent d-flex flex-column h-100 flex-center bg-body-hover">
            <Button
              className="stretched-link btn-icon btn-icon bg-body-secondary rounded-circle mb-1"
              onClick={() => {
                kanbanDispatch({
                  type: TOGGLE_ADD_LIST_MODAL,
                  payload: true
                });
              }}
            >
              <FontAwesomeIcon
                icon={faPlus}
                className="text-body-secondary fs-8"
              />
            </Button>
            <h5 className="text-body-secondary">Add another list</h5>
          </div>
        </div>
      </DragDropContext>
      <KanbanBoardOffcanvas />
      <KanbanAddListModal />
    </div>
  );
};
export default Kanban;
