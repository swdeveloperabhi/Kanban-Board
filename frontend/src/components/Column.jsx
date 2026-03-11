import { useState } from 'react';

export default function Column({ title, onDrop, children }) {
  const [isHovering, setIsHovering] = useState(false);

  function handleDragEnter(evt) {
    evt.preventDefault();
    setIsHovering(true);
  }

  function handleDragExit() {
    setIsHovering(false);
  }

  function handleItemDrop(evt) {
    evt.preventDefault();
    setIsHovering(false);
    onDrop(evt, title);
  }

  return (
    <div
      className={`column ${isHovering ? 'drag-over' : ''}`}
      onDragOver={handleDragEnter}
      onDragLeave={handleDragExit}
      onDrop={handleItemDrop}
    >
      <div className="column-title">{title}</div>
      <div className="card-list">
        {children}
      </div>
    </div>
  );
}
