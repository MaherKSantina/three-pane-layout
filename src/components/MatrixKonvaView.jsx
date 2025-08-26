import React, { useEffect, useRef } from "react";
import KonvaView from "./KonvaView";

const CELL_WIDTH = 120;
const CELL_HEIGHT = 60;
const CELL_GAP = 8;
const ADD_BTN_SIZE = 22;

export default function MatrixKonvaView({
  matrix,
  width = 900,
  height = 700,
  onCellClick,
  onAddCol,
  onAddRow,
  onDeleteCell,
  onDeleteRow,
  onDeleteCol,
  onKeyDown,
  onAddEmptyCell
}) {
  const konvaRef = useRef();

  useEffect(() => {
    if (!konvaRef.current || !matrix) return;

    // Remove old layers
    const stage = konvaRef.current.getStage();
    stage.getLayers().forEach(l => l.destroy());
    const layer = konvaRef.current.addLayer();

    const maxCols = Math.max(...matrix.map(r => r.length));
    for (let x = 0; x < maxCols; x++) {
    const deleteColX = x * (CELL_WIDTH - ADD_BTN_SIZE / 2 + CELL_GAP + ADD_BTN_SIZE / 2) + CELL_GAP + ADD_BTN_SIZE / 2;
    konvaRef.current.addShape(layer, "rect", {
        x: deleteColX,
        y: -CELL_HEIGHT,
        width: CELL_WIDTH - ADD_BTN_SIZE,
        height: CELL_HEIGHT,
        fill: "#fde6e6",
        stroke: "#d32f2f",
        strokeWidth: 1,
        cornerRadius: 6,
    });
    let deleteColumnText = konvaRef.current.addText(layer, `Delete-${x}`, {
        x: deleteColX,
        y: -CELL_HEIGHT + (CELL_HEIGHT - 22) / 2,
        width: CELL_WIDTH - ADD_BTN_SIZE,
        height: 22,
        fontSize: 16,
        align: "center",
        fill: "#d32f2f",
    });
    deleteColumnText.on("click", (evt) => {
        evt.cancelBubble = true; // prevent triggering cell click
        onDeleteCol(x);
    });
const addColX = x * (CELL_WIDTH + CELL_GAP) - CELL_GAP / 2;
        konvaRef.current.addShape(layer, "rect", {
            x: addColX,
            y: -ADD_BTN_SIZE - 4,
            width: ADD_BTN_SIZE,
            height: ADD_BTN_SIZE,
            fill: "#e8f5e9",
            stroke: "#2e7d32",
            strokeWidth: 1,
            cornerRadius: ADD_BTN_SIZE / 2,
            shadowBlur: 2,
        });
        let addColText = konvaRef.current.addText(layer, "+", {
            x: addColX,
            y: -ADD_BTN_SIZE - 4,
            width: ADD_BTN_SIZE,
            height: ADD_BTN_SIZE,
            fontSize: 18,
            align: "center",
            verticalAlign: "middle",
            fill: "#2e7d32",
            fontStyle: "bold",
        });
        addColText.on("click", (evt) => {
            evt.cancelBubble = true;
            if (onAddCol) onAddCol(x);
        });
    }

    

    matrix.forEach((row, y) => {

         // --- New: Draw delete row button ---
  const rowY = y * (CELL_HEIGHT + CELL_GAP) + CELL_GAP + ADD_BTN_SIZE;
  const delRectX = 0 - CELL_WIDTH;
  konvaRef.current.addShape(layer, "rect", {
    x: delRectX,
    y: rowY,
    width: CELL_WIDTH,
    height: CELL_HEIGHT - ADD_BTN_SIZE * 2,
    fill: "#fde6e6",
    stroke: "#d32f2f",
    strokeWidth: 1,
    cornerRadius: 6,
  });
  let deleteRowText = konvaRef.current.addText(layer, `Delete-${y}`, {
    x: delRectX,
    y: rowY,
    width: CELL_WIDTH,
    height: CELL_HEIGHT - ADD_BTN_SIZE * 2,
    fontSize: 16,
    align: "center",
    fill: "#d32f2f",
  });

    deleteRowText.on("click", (evt) => {
        evt.cancelBubble = true; // prevent triggering cell click
        onDeleteRow(y);
    });

    const addRowY = y * (CELL_HEIGHT + CELL_GAP) - ADD_BTN_SIZE / 2;
  const addRowX = 0 - CELL_GAP - ADD_BTN_SIZE / 2;

        konvaRef.current.addShape(layer, "rect", {
            x: addRowX,
            y: addRowY,
            width: ADD_BTN_SIZE,
            height: ADD_BTN_SIZE,
            fill: "#e8f5e9",
            stroke: "#2e7d32",
            strokeWidth: 1,
            cornerRadius: ADD_BTN_SIZE / 2,
            shadowBlur: 2,
        });
        let addRowext = konvaRef.current.addText(layer, "+", {
            x: addRowX,
            y: addRowY,
            width: ADD_BTN_SIZE,
            height: ADD_BTN_SIZE,
            fontSize: 18,
            align: "center",
            verticalAlign: "middle",
            fill: "#2e7d32",
            fontStyle: "bold",
        });
        addRowext.on("click", (evt) => {
            evt.cancelBubble = true;
            if (onAddRow) onAddRow(y);
        });

      row.forEach((cell, x) => {
        const xpos = x * (CELL_WIDTH + CELL_GAP) + CELL_GAP;
        const ypos = y * (CELL_HEIGHT + CELL_GAP) + CELL_GAP;

        // Draw rect for cell
        const rect = konvaRef.current.addShape(layer, "rect", {
          x: xpos,
          y: ypos,
          width: CELL_WIDTH,
          height: CELL_HEIGHT,
          fill: cell && cell.text ? "#e3ecfd" : "#fafbfc",
          stroke: "#b0b4ba",
          strokeWidth: 1.5,
          cornerRadius: 8,
        });

        // Draw text if present
        if (cell && cell.text) {
          let text = konvaRef.current.addText(layer, cell.text, {
            x: xpos + 8,
            y: ypos + 12,
            width: CELL_WIDTH - 16,
            height: CELL_HEIGHT - 24,
            fontSize: 18,
            align: "center",
            verticalAlign: "middle"
          });
          if (typeof cell.agent === "string") {
            konvaRef.current.addText(layer, cell.agent, {
              x: xpos + 8,
              y: ypos + CELL_HEIGHT - 22,
              width: CELL_WIDTH - 16,
              height: 18,
              fontSize: 14,
              fill: "#7296d8",
              align: "right"
            });
          }
          text.on("pointerdown", () => onCellClick({ x, y, cell }));
        }

        // Always clickable
        rect.on("pointerdown", () => onCellClick({ x, y, cell }));

        // Add "x" icon for deleting this cell
        const xText = konvaRef.current.addText(layer, "×", {
          x: xpos + CELL_WIDTH - 20,
          y: ypos + 4,
          width: 16,
          height: 16,
          fontSize: 18,
          fill: "#d32f2f",
          align: "center",
          verticalAlign: "middle",
          fontStyle: "bold",
        });
        xText.on("pointerdown", (evt) => {
          evt.cancelBubble = true; // prevent triggering cell click
          onDeleteCell({ x, y });
        });
      });

      // --- Visually hide "Add Col" and "Delete Row" ---
      // (Do NOT render these elements)
      // -----
    });

    // --- Visually hide "Add Row" ---
    // (Do NOT render these elements)
    // -----

    layer.draw();
  }, [matrix]);

  return <KonvaView ref={konvaRef} width={width} height={height} onKeyDown={onKeyDown} />;
}
