import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import AddIcon from "@mui/icons-material/Add";
import EditRounded from "@mui/icons-material/EditRounded";
import DeleteRounded from "@mui/icons-material/DeleteRounded";
import AddCircleOutlineRounded from "@mui/icons-material/AddCircleOutlineRounded";
import AddColumnDialog from "./AddColumnDialog";
import AddCardDialog from "./AddCardDialog";
import { useKanbanStore, useStore } from "../contexts/StoreContext";

////////////////////////////
// LAYOUT STYLE CONSTANTS //
////////////////////////////

const BOARD_STYLE = {
  display: "flex",
  flexDirection: "row",
  overflowX: "auto",
  gap: "16px", // Columns will have marginLeft except for first
  height: "100%",
  background: "grey",
  boxSizing: "border-box",
};

const COLUMN_STYLE = {
  width: "300px",
  flexShrink: 0,
  display: "flex",
  flexDirection: "column",
  height: "100%",
  marginLeft: 0, // We'll apply marginLeft on all except first column below
};

const COLUMN_INNER_STYLE = {
  display: "flex",
  flexDirection: "column",
  height: "100%",
  backgroundColor: "#f4f4f4",
  borderRadius: "4px",
  border: "1px solid #ccc",
};

const COLUMN_HEADER_STYLE = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "8px",
};

const CARDS_STYLE = {
  flex: 1,
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const CARD_STYLE = {
  width: "100%",
  boxSizing: "border-box",
  backgroundColor: "rgb(221, 152, 152)",
  border: "1px solid #ced7e0",
  borderRadius: "4px",
  fontFamily: "sans-serif",
  cursor: "grab",
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  marginBottom: "8px",
  marginLeft: 0, // If you want horizontal gap between cards, use marginTop or marginBottom here
  padding: "8px 8px", // Only inner padding for cards
};

const CARD_TITLE_STYLE = {
  fontWeight: "bold",
  fontSize: "16px",
  lineHeight: 1.4,
  wordWrap: "break-word",
};

const CARD_DESCRIPTION_STYLE = {
  fontSize: "14px",
  lineHeight: 1.4,
  color: "#555",
  wordWrap: "break-word",
};

const ADD_COLUMN_STYLE = {
  alignSelf: "flex-start",
  position: "sticky",
  right: 0,
  background: "white",
  zIndex: 2,
  marginLeft: "16px",
};

const ROOT_STYLE = {
  display: "flex",
  flexDirection: "column",
  height: "100%",
  overflow: "hidden",
};

////////////////////////
// LAYOUT COMPONENTS  //
////////////////////////

function KanbanCard({ card, onDoubleClick }) {
  return (
    <div
      style={CARD_STYLE}
      onDoubleClick={onDoubleClick}
    >
      <div style={CARD_TITLE_STYLE}>{card.title}</div>
      <div style={CARD_DESCRIPTION_STYLE}>{card.description}</div>
    </div>
  );
}

function KanbanColumn({
  col,
  onEditColumn,
  onAddCard,
  onDeleteColumn,
  onEditCard,
  provided,
  isFirst,
}) {
  return (
    <div
      style={{
        ...COLUMN_STYLE,
        marginLeft: isFirst ? 0 : "16px",
      }}
      ref={provided ? provided.innerRef : undefined}
      {...(provided ? provided.droppableProps : {})}
    >
      <div style={COLUMN_INNER_STYLE}>
        <div style={COLUMN_HEADER_STYLE}>
          <span style={{ fontWeight: "bold", fontSize: "18px" }}>{col.title}</span>
          <div>
            <button
              style={{ margin: "0 2px" }}
              onClick={() => onEditColumn(col)}
              aria-label="Edit Column"
            >
              <EditRounded fontSize="small" />
            </button>
            <button
              style={{ margin: "0 2px" }}
              onClick={() => onAddCard(col)}
              aria-label="Add Card"
            >
              <AddCircleOutlineRounded fontSize="small" />
            </button>
            <button
              style={{ margin: "0 2px" }}
              onClick={() => onDeleteColumn(col.id)}
              aria-label="Delete Column"
            >
              <DeleteRounded fontSize="small" />
            </button>
          </div>
        </div>
        <div style={CARDS_STYLE}>
          {col.cards.map((card, idx) => (
            <Draggable draggableId={card.id.toString()} index={idx} key={card.id}>
              {(prov) => (
                <div
                  ref={prov.innerRef}
                  {...prov.draggableProps}
                  {...prov.dragHandleProps}
                >
                  <KanbanCard
                    card={card}
                    onDoubleClick={() => onEditCard(col, card)}
                  />
                </div>
              )}
            </Draggable>
          ))}
          {provided && provided.placeholder}
        </div>
      </div>
    </div>
  );
}

function AddColumnButton({ onClick }) {
  return (
    <div style={ADD_COLUMN_STYLE}>
      <button
        style={{
          height: 40,
          padding: "8px 16px",
          border: "1px solid #ced7e0",
          background: "#fff",
          borderRadius: 4,
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
        }}
        onClick={onClick}
      >
        <AddIcon style={{ marginRight: 8 }} />
        Add Column
      </button>
    </div>
  );
}

function KanbanBoardInner() {
  const {
    columns,
    fetchData,
    addColumn,
    updateColumn,
    deleteColumn,
    addCard,
    updateCard,
    deleteCard,
    moveCard,
  } = useKanbanStore();

  const [colDialogOpen, setColDialogOpen] = useState(false);
  const [cardDialogOpen, setCardDialogOpen] = useState(false);
  const [currentColumn, setCurrentColumn] = useState(null);
  const [editColTitle, setEditColTitle] = useState("");
  const [editCardData, setEditCardData] = useState(null);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onDragEnd = (res) => {
    const { source, destination, draggableId } = res;
    if (!destination) return;

    const fromColId = parseInt(source.droppableId, 10);
    const toColId = parseInt(destination.droppableId, 10);
    const cardId = parseInt(draggableId, 10);

    moveCard(fromColId, toColId, cardId, destination.index);
  };

  return (
    <div style={ROOT_STYLE}>
      <DragDropContext onDragEnd={onDragEnd}>
        <div style={BOARD_STYLE}>
          {columns.map((col, i) => (
            <Droppable droppableId={col.id.toString()} key={col.id}>
              {(provided) => (
                <KanbanColumn
                  col={col}
                  provided={provided}
                  onEditColumn={(col) => {
                    setEditColTitle(col.title);
                    setCurrentColumn(col.id);
                    setColDialogOpen(true);
                  }}
                  onAddCard={(col) => {
                    setCurrentColumn(col.id);
                    setEditCardData(null);
                    setCardDialogOpen(true);
                  }}
                  onDeleteColumn={deleteColumn}
                  onEditCard={(col, card) => {
                    setCurrentColumn(col.id);
                    setEditCardData(card);
                    setCardDialogOpen(true);
                  }}
                  isFirst={i === 0}
                />
              )}
            </Droppable>
          ))}
          <AddColumnButton
            onClick={() => {
              setEditColTitle("");
              setCurrentColumn(null);
              setColDialogOpen(true);
            }}
          />
        </div>
      </DragDropContext>

      <AddColumnDialog
        open={colDialogOpen}
        initialTitle={editColTitle}
        onClose={() => setColDialogOpen(false)}
        onSave={(title) => {
          currentColumn
            ? updateColumn(currentColumn, { title })
            : addColumn(title);
        }}
      />
      <AddCardDialog
        open={cardDialogOpen}
        initialData={editCardData}
        onClose={() => setCardDialogOpen(false)}
        onSave={(card) => {
          editCardData
            ? updateCard(currentColumn, card.id, card)
            : addCard(currentColumn, card);
        }}
      />
    </div>
  );
}

////////////////////////
// MODES: FULL/FIXED  //
////////////////////////

function FullViewKanbanBoard() {
  const style = {
    display: "flex",
    flexWrap: "nowrap",
    backgroundColor: "grey",
    height: "100vh",
    width: "100vw",
    gap: "10px",
    boxSizing: "border-box",
  };
  return (
    <div style={style}>
      <KanbanBoardInner />
    </div>
  );
}

function FixedParentKanbanBoard({ height = "100%", width = "100%" }) {
  const scrollContainerStyle = {
    width,
    height,
    overflowX: "auto",
    overflowY: "hidden",
    backgroundColor: "grey",
    boxSizing: "border-box",
  };

  const kanbanContainerStyle = {
    display: "inline-flex",
    flexDirection: "row",
    gap: "10px",
    height: "100%",
  };

  return (
    <div style={scrollContainerStyle}>
      <div style={kanbanContainerStyle}>
        <KanbanBoardInner />
      </div>
    </div>
  );
}

// Main wrapper
export default function KanbanBoard({ mode = "full", height, width }) {
  if (mode === "full") {
    return <FullViewKanbanBoard />;
  } else if (mode === "fixed") {
    return <FixedParentKanbanBoard height={height} width={width} />;
  }
}
