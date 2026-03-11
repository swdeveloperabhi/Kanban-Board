import { useState, useEffect } from 'react';
import Column from './Column';
import Card from './Card';
import CardModal from './CardModal';

const defaultTaskList = [
  { id: '1', column: 'Backlog', color: 'purple', type: 'lines', offsetX: '-10px', offsetY: '0px' },
  { id: '2', column: 'Backlog', color: 'green', type: 'lines', offsetX: '15px', offsetY: '-10px' },
  { id: '3', column: 'Backlog', color: 'yellow', type: 'lines', offsetX: '-15px', offsetY: '-20px' },
  { id: '4', column: 'Backlog', color: 'yellow', type: 'lines', offsetX: '20px', offsetY: '-15px' },

  { id: '5', column: 'Next', color: 'yellow', type: 'lines', offsetX: '20px', offsetY: '-10px' },
  { id: '6', column: 'Next', color: 'cyan', type: 'lines', offsetX: '-10px', offsetY: '-40px' },
  { id: '7', column: 'Next', color: 'purple', type: 'lines', offsetX: '15px', offsetY: '-15px' },
  { id: '8', column: 'Next', color: 'green', type: 'lines', offsetX: '-15px', offsetY: '-20px' },

  { id: '9', column: 'In Progress', color: 'purple', type: 'lines', offsetX: '0px', offsetY: '10px' },

  { id: '10', column: 'Testing', color: 'purple', type: 'lines', offsetX: '10px', offsetY: '20px' },
  { id: '11', column: 'Testing', color: 'cyan', type: 'lines', offsetX: '-10px', offsetY: '-30px' },
  { id: '12', column: 'Testing', color: 'yellow', type: 'lines', offsetX: '20px', offsetY: '40px' },

  { id: '13', column: 'Done', color: 'yellow', type: 'check', offsetX: '-15px', offsetY: '-10px' },
  { id: '14', column: 'Done', color: 'purple', type: 'check', offsetX: '15px', offsetY: '-20px' },
  { id: '15', column: 'Done', color: 'yellow', type: 'check', offsetX: '-10px', offsetY: '-10px' },
  { id: '16', column: 'Done', color: 'cyan', type: 'check', offsetX: '20px', offsetY: '-30px' },
];

const BOARD_COLUMNS = ['Backlog', 'Next', 'In Progress', 'Testing', 'Done'];

export default function KanbanBoard() {
  const [tasks, setTasks] = useState(() => {
    const localData = localStorage.getItem('kanban-cards');
    if (localData) {
      try { return JSON.parse(localData); } catch (err) { return defaultTaskList; }
    }
    return defaultTaskList;
  });

  const [displayMode, setDisplayMode] = useState(() => {
    return localStorage.getItem('kanban-theme') || 'dark';
  });

  const [filterText, setFilterText] = useState('');
  const [activeTask, setActiveTask] = useState(null);

  useEffect(() => {
    localStorage.setItem('kanban-cards', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('kanban-theme', displayMode);
    document.body.setAttribute('data-theme', displayMode);
  }, [displayMode]);

  function onDragStartHandler(evt, itemId) {
    evt.dataTransfer.setData('cardId', itemId);
  }

  function onColumnDrop(evt, destColumn) {
    const draggedId = evt.dataTransfer.getData('cardId');
    if (!draggedId) return;

    setTasks((currentTasks) =>
      currentTasks.map((t) =>
        t.id === draggedId ? { ...t, column: destColumn } : t
      )
    );
  }

  const selectTask = (t) => {
    setActiveTask(t);
  };

  const closeModal = () => {
    setActiveTask(null);
  };

  const updateTask = (modifiedTask) => {
    setTasks((prev) =>
      prev.map((c) => (c.id === modifiedTask.id ? modifiedTask : c))
    );
  };

  const removeTask = (taskId) => {
    setTasks((current) => current.filter((c) => c.id !== taskId));
    setActiveTask(null);
  };

  const createNewTask = () => {
    const freshTask = {
      id: Date.now().toString(),
      column: 'Backlog',
      color: 'yellow',
      type: 'text',
      title: 'New Task',
      description: '',
      offsetX: `${Math.floor(Math.random() * 20) - 10}px`,
      offsetY: `${Math.floor(Math.random() * 20) - 10}px`,
    };
    setTasks((prev) => [...prev, freshTask]);
    setActiveTask(freshTask);
  };

  const switchTheme = () => {
    setDisplayMode(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const visibleTasks = tasks.filter(t => {
    if (!filterText) return true;
    const lower = filterText.toLowerCase();
    const matchesTitle = t.title?.toLowerCase().includes(lower);
    const matchesDesc = t.description?.toLowerCase().includes(lower);
    return matchesTitle || matchesDesc;
  });

  return (
    <>
      <div className="app-header">
        <div className="header-top">
          <h1 className="app-title">Kanban board</h1>
          <div className="header-controls">
            <button className="btn-theme-toggle" onClick={switchTheme}>
              {displayMode === 'dark' ? '☀️ Light' : '🌙 Dark'}
            </button>
            <button className="btn-add-task" onClick={createNewTask}>+ Add Task</button>
          </div>
        </div>
        
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search tasks..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>
      </div>
      
      <div className="kanban-board-container">
        {BOARD_COLUMNS.map((colName) => (
          <Column key={colName} title={colName} onDrop={onColumnDrop}>
            {visibleTasks
              .filter((c) => c.column === colName)
              .map((tsk) => (
                <Card
                  key={tsk.id}
                  card={tsk}
                  onDragStart={onDragStartHandler}
                  onClick={selectTask}
                />
              ))}
          </Column>
        ))}
      </div>

      <CardModal
        card={activeTask}
        onClose={closeModal}
        onSave={updateTask}
        onDelete={removeTask}
      />
    </>
  );
}
