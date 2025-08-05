import React, { useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import Konva from "konva";

const KonvaView = forwardRef((props, ref) => {
  const containerRef = useRef();
  const stageRef = useRef();
  const layersRef = useRef([]);

  // Initialize stage only once
  useEffect(() => {
    if (!containerRef.current) return;
    stageRef.current = new Konva.Stage({
      container: containerRef.current,
      width: props.width || 600,
      height: props.height || 400,
    });
    stageRef.current.draggable(true);

    const layer = new Konva.Layer();
    stageRef.current.add(layer);

    // Add initial layers if needed
    return () => {
      stageRef.current.destroy();
    };
  }, [props.width, props.height]);

    // --- ZOOMING ---
  useEffect(() => {
    if (!containerRef.current) return;
    const stage = stageRef.current;
    const handleWheel = (e) => {
      e.evt.preventDefault();
      const scaleBy = 1.05;
      const oldScale = stage.scaleX();

      // Determine zoom direction
      const mousePointTo = {
        x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
        y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
      };

      // Wheel up = zoom in, Wheel down = zoom out
      let newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
      // Clamp zoom between 0.2 and 5 (optional)
      newScale = Math.max(0.2, Math.min(5, newScale));

      stage.scale({ x: newScale, y: newScale });

      // Optionally, keep the zoom centered on the mouse
      const newPos = {
        x: -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
        y: -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale,
      };
      stage.position(newPos);
      stage.batchDraw();
    };

    stage.on("wheel", handleWheel);

    const handleKeyDown = (e) => {
      if (e.key === "ArrowUp") props.onKeyDown("up");
      if (e.key === "ArrowDown") props.onKeyDown("down");
      if (e.key === "ArrowLeft") props.onKeyDown("left");
      if (e.key === "ArrowRight") props.onKeyDown("right");
    };

    // Listen on the container div
    const div = containerRef.current;
    div.addEventListener("keydown", handleKeyDown);

    return () => {
      div.removeEventListener("keydown", handleKeyDown);
      stage.off("wheel", handleWheel);
    };
  }, []);

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    addLayer: (layerOptions = {}) => {
      const layer = new Konva.Layer(layerOptions);
      stageRef.current.add(layer);
      layersRef.current.push(layer);
      return layer;
    },
    addText: (layer, text, props) => {
        const v = new Konva.Text({
            text,
            fontSize: 16,
            align: 'center',
            verticalAlign: 'middle', // this works only if you set height
            fill: 'black',
            ...props
        });
        layer.add(v);
        layer.draw()
        return v
    },
    addShape: (layer, shapeType, shapeProps) => {
      let shape;
      if (shapeType === "rect") shape = new Konva.Rect(shapeProps);
      else if (shapeType === "circle") shape = new Konva.Circle(shapeProps);
      else if (shapeType === "line") shape = new Konva.Line(shapeProps);
      else if (shapeType === "arc") shape = new Konva.Arc(shapeProps);
      // ...etc, add support for more shapes as needed
      if (layer && shape) {
        layer.add(shape);
        layer.draw();
      }
      return shape;
    },
    addLine(layer, components, options = {}) {
  if (!components || components.length < 2) return;

  // Start path string
  let path = `M ${components[0].x} ${components[0].y}`;
  for (let i = 1; i < components.length; i++) {
    const seg = components[i];
    if (seg.type === 'line') {
      path += ` L ${seg.x} ${seg.y}`;
    } else if (seg.type === 'curve') {
      // Requires cp1x, cp1y, cp2x, cp2y (control points)
      if (
        typeof seg.cp1x === "number" &&
        typeof seg.cp1y === "number" &&
        typeof seg.cp2x === "number" &&
        typeof seg.cp2y === "number"
      ) {
        path += ` C ${seg.cp1x} ${seg.cp1y}, ${seg.cp2x} ${seg.cp2y}, ${seg.x} ${seg.y}`;
      } else {
        console.warn("Curve segment missing control points:", seg);
      }
    }
  }

  // Create Konva.Path
  const konvaPath = new window.Konva.Path({
    data: path,
    ...options,
  });
  layer.add(konvaPath);
  layer.draw();
  return konvaPath;
},
    getStage: () => stageRef.current,
    getLayers: () => layersRef.current,
  }));

  return <div ref={containerRef} tabIndex={0} style={{ width: props.width || 600, height: props.height || 400 }} />;
});

export default KonvaView;
