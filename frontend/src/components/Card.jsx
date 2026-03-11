export default function Card({ card, onDragStart, onClick }) {
  const dynamicStyles = {
    marginLeft: card.offsetX || '0px',
    marginTop: card.offsetY || '10px',
  };

  function dragInitiated(event) {
    onDragStart(event, card.id);
  }

  function handleInteraction() {
    onClick(card);
  }

  return (
    <div
      className={`card card-${card.color} ${card.isDragging ? 'dragging' : ''}`}
      draggable
      onDragStart={dragInitiated}
      onClick={handleInteraction}
      style={dynamicStyles}
    >
      {card.type === 'lines' && (
        <div className="card-lines">
          <div className="card-line"></div>
          <div className="card-line"></div>
          <div className="card-line"></div>
        </div>
      )}
      {card.type === 'check' && (
        <div className="card-check"></div>
      )}
      {card.type === 'text' && (
        <div className="card-text">
          <h4 className="card-title">{card.title || 'Untitled'}</h4>
        </div>
      )}
    </div>
  );
}
