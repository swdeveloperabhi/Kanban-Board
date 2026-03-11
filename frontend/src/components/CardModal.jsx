import { useState, useEffect } from 'react';

export default function CardModal({ card, onClose, onSave, onDelete }) {
  const [taskTitle, setTaskTitle] = useState(card?.title || '');
  const [taskDesc, setTaskDesc] = useState(card?.description || '');
  const [taskColor, setTaskColor] = useState(card?.color || 'yellow');

  useEffect(() => {
    if (card) {
      setTaskTitle(card.title || '');
      setTaskDesc(card.description || '');
      setTaskColor(card.color || 'yellow');
    }
  }, [card]);

  if (!card) return null;

  function commitChanges() {
    onSave({ ...card, title: taskTitle, description: taskDesc, color: taskColor, type: 'text' });
    onClose();
  }

  function clickOutsideWrapper(evt) {
    if (evt.target === evt.currentTarget) {
      onClose();
    }
  }

  return (
    <div className="modal-backdrop" onClick={clickOutsideWrapper}>
      <div className={`modal-content modal-${taskColor}`}>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        
        <input
          className="modal-input-title"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          placeholder="Task Title"
          autoFocus
        />
        
        <textarea
          className="modal-input-desc"
          value={taskDesc}
          onChange={(e) => setTaskDesc(e.target.value)}
          placeholder="Task Description"
          rows={5}
        />

        <div className="modal-actions">
          <div className="color-picker">
            <button
              className={`color-btn yellow ${taskColor === 'yellow' ? 'selected' : ''}`}
              onClick={() => setTaskColor('yellow')}
            ></button>
            <button
              className={`color-btn cyan ${taskColor === 'cyan' ? 'selected' : ''}`}
              onClick={() => setTaskColor('cyan')}
            ></button>
            <button
              className={`color-btn green ${taskColor === 'green' ? 'selected' : ''}`}
              onClick={() => setTaskColor('green')}
            ></button>
            <button
              className={`color-btn purple ${taskColor === 'purple' ? 'selected' : ''}`}
              onClick={() => setTaskColor('purple')}
            ></button>
            <button
              className={`color-btn red ${taskColor === 'red' ? 'selected' : ''}`}
              onClick={() => setTaskColor('red')}
            ></button>
          </div>
          
          <div className="modal-buttons">
            <button className="btn-delete" onClick={() => onDelete(card.id)}>Delete</button>
            <button className="btn-save" onClick={commitChanges}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}
