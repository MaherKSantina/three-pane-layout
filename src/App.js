import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate, useParams } from 'react-router-dom';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import IconMenu from './components/IconMenu';
import ProcessFlow from './components/ProcessFlow';
import { UIEditor } from './components/UIEditor';
import Calendar from './components/Calendar2';
import MatrixListWithDetails from './components/MatrixListWithDetails';
import MatricsCRUDDataTable from './components/MatricsCRUDDataTable';
import RequestsCRUDDataTable from './components/agents/RequestsCRUDView';
import { useNavigate } from "react-router-dom";
import MissileSimView from './components/sim/MissileSim';
import { APIChatMessage } from './components/chat/ChatWindow.stories';
import ChatListWithDetails from './components/chat/ChatListWithDetails';
import GanttChart from './components/GanttChart';
import { cloneElement, isValidElement, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import APIChattableComponent from './components/current/APIChattableComponent';

const RESIZE_IDLE_MS = 150;

export function SizeAware({ children }) {
  const containerRef = useRef(null);
  const [parentSize, setParentSize] = useState({ width: 0, height: 0 });

  // Measure parent size util (your logic)
  const measureParent = useMemo(
    () => () => {
      const el = containerRef.current;
      const parent = el?.parentElement;
      if (!parent) return;

      const rect = parent.getBoundingClientRect();
      setParentSize((prev) => {
        const w = Math.max(0, Math.floor(rect.width));
        const h = Math.max(0, Math.floor(rect.height));
        if (prev.width === w && prev.height === h) return prev;
        return { width: w, height: h };
      });
    },
    []
  );

  // Initial synchronous measure to avoid layout jump
  useLayoutEffect(() => {
    measureParent();
  }, [measureParent]);

  // Observe parent size and update only after user stops resizing/dragging
  useEffect(() => {
    const el = containerRef.current;
    const parent = el?.parentElement;
    if (!parent) return;

    let t;
    const debouncedMeasure = () => {
      clearTimeout(t);
      t = setTimeout(measureParent, RESIZE_IDLE_MS);
    };

    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(debouncedMeasure);
      ro.observe(parent);
    } else {
      const onWin = debouncedMeasure;
      window.addEventListener("resize", onWin);
      return () => window.removeEventListener("resize", onWin);
    }

    return () => {
      clearTimeout(t);
      ro?.disconnect();
    };
  }, [measureParent]);

  const { width, height } = parentSize;

  // Render helpers: support either render-prop or normal child
  const renderChild = () => {
    // 1) Render-prop: <SizeAwareParent>{({width,height}) => <.../>}</SizeAwareParent>
    if (typeof children === "function") {
      return children({ width, height });
    }

    // 2) Single React element: inject width/height as optional props
    if (isValidElement(children)) {
      return cloneElement(children, {
        width,
        height,
      });
    }

    // Fallback – just render as-is
    return children;
  };

  // This div only exists so we can get at its parentElement
  return (
    <div
      ref={containerRef}
      style={{
        // This element itself can be "invisible" in layout;
        // it just needs to exist so parentElement is measurable.
        width: 0,
        height: 0,
        position: "absolute",
        pointerEvents: "none",
        opacity: 0,
      }}
    >
      {renderChild()}
    </div>
  );
}

function RequestsPage() {
  const navigate = useNavigate();
  return (
    <RequestsCRUDDataTable
      onView={(row) => {
        // go to /requests/:id/matrix
        navigate(`/requests/${row}/matrix`);
      }}
    />
  );
}

function RequestMatrixPage() {
  const { id } = useParams();
  return (
    <MatrixListWithDetails
      identifier="requestsMatrices"
      matrixId={id} // pass the route param straight in
    />
  );
}

function ChatMessagePage() {
  const { id } = useParams();
  return (
    <APIChatMessage sourceAgentID={4} channelID={id}></APIChatMessage>
  );
}

function RequestsAsChatPage() {
  const { id } = useParams();
  return (
    <APIChatMessage isRequest={true} sourceAgentID={4} channelID={id}></APIChatMessage>
  );
}

function GanttPage() {
  const { id } = useParams();
  const [data, setData] = useState({tasks: [], links: []})

  useEffect(() => {
      reloadData()
    }, [])

  async function reloadData() {
      let response = await axios.get(`https://api-digitalsymphony.ngrok.pizza/data/${id}/gantt`)
      setData(response.data)
    }

  return (
    <GanttChart tasks={data.tasks} links={data.links} height={1000}></GanttChart>
  );
}

function CalendarPage() {
  const { id } = useParams();
  const [data, setData] = useState([])

  useEffect(() => {
      reloadData()
    }, [])

  async function reloadData() {
      let response = await axios.get(`https://api-digitalsymphony.ngrok.pizza/data/${id}/calendar`)
      setData(response.data)
    }

  return (
    <Calendar events={data} slotDuration={"00:10:00"}></Calendar>
  );
}

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Calendar itemID={11} slotDuration={"00:10:00"}></Calendar>} />
      <Route path="/requests" element={<RequestsPage />} />
      <Route path="/requests/:id/matrix" element={<RequestMatrixPage />} />
      <Route path="/requests/:id/chat" element={<RequestsAsChatPage />} />
      <Route path="/matricesDetails" element={<MatrixListWithDetails></MatrixListWithDetails>} />
      <Route path="/matrices" element={<MatricsCRUDDataTable></MatricsCRUDDataTable>} />
      <Route path="/sim" element={<MissileSimView></MissileSimView>} />
      <Route path="/chat/:id" element={<ChatMessagePage></ChatMessagePage>} />
      <Route path="/chats" element={<ChatListWithDetails agentID={4}></ChatListWithDetails>} ></Route>
      <Route path="/data/:id/gantt" element={
        <GanttPage></GanttPage>
    } ></Route>
    <Route path="/data/:id/calendar" element={
        <CalendarPage></CalendarPage>
    } ></Route>
    <Route path="/newChat" element={
        <APIChattableComponent></APIChattableComponent>
    } ></Route>
      
      </Routes>
      
    </Router>
  );
}

export default App;
