import React, { useEffect, useMemo, useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, StatsGl } from "@react-three/drei";
import io from "socket.io-client";
import { create } from "zustand";
import { shallow } from "zustand/shallow";
import axios from "axios";
import MissileModel from "./MissileModel";

/************************************
 * Zustand store for UI + topology
 ************************************/
const useSimStore = create((set) => ({
  apiUrl: "http://localhost:3000/api/scenario",   // for REST
  wsUrl:  "http://localhost:3000",   // for Socket.IO (no /api)
  connected: false,
  connecting: false,
  lastError: null,
  params: {
    missile: { mass: 1, force: 5, radius: 0.2 },
    target: { mass: 1, radius: 0.3, vx: 0, vy: 0, vz: 0 },
    gravity: -9.82,
  },
  setApiUrl: (url) => set({ apiUrl: url }),
  setWsUrl:  (url) => set({ wsUrl: url }),
  updateParams: (path, value) =>
    set((s) => {
      const next = structuredClone(s.params);
      const keys = path.split(".");
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return { params: next };
    }),
  bodyIds: [],
  setBodyIds: (ids) => set({ bodyIds: ids }),
  setConnected: (v) => set({ connected: v, connecting: false, lastError: null }),
  setConnecting: (v) => set({ connecting: v }),
  setError: (e) => set({ lastError: e, connecting: false }),
}));

/************************************
 * Socket connector (authoritative server)
 ************************************/
function useSimSocket(latestFrameRef) {
  const wsUrl        = useSimStore((s) => s.wsUrl);
  const setConnected = useSimStore((s) => s.setConnected);
  const setConnecting= useSimStore((s) => s.setConnecting);
  const setError     = useSimStore((s) => s.setError);
  const setBodyIds   = useSimStore((s) => s.setBodyIds);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.STORYBOOK_ENV) return;
    setConnecting(true);
    const socket = io(wsUrl, { autoConnect: true });

    socket.on("connect",      () => setConnected(true));
    socket.on("disconnect",   () => setConnected(false));
    socket.on("connect_error",(err) => setError(err?.message || String(err)));

    socket.on("state", (frame) => {
      latestFrameRef.current = frame;
      const ids = frame.bodies?.map((b) => b.id) || [];
      const prev = useSimStore.getState().bodyIds;
      if (ids.length !== prev.length || ids.some((id, i) => id !== prev[i])) {
        setBodyIds(ids);
      }
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      setConnected(false);
    };
  }, [wsUrl, setConnected, setConnecting, setError, setBodyIds]);
// ...existing code...
}

/************************************
 * REST helpers (Express endpoints)
 ************************************/
async function postJSON(url, body) {
  console.log(body)
    const r = await axios.post(url, body);
    return r.data
}

function ControlsPanel() {
  const apiUrl      = useSimStore(s => s.apiUrl);
  const setApiUrl   = useSimStore(s => s.setApiUrl);
  const wsUrl       = useSimStore(s => s.wsUrl);
  const setWsUrl    = useSimStore(s => s.setWsUrl);
  const params      = useSimStore(s => s.params);
  const updateParams= useSimStore(s => s.updateParams);
  const connected   = useSimStore(s => s.connected);
  const lastError   = useSimStore(s => s.lastError);

  const busyRef = useRef(false);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  })
  const handleKeyDown = async (event) => {
    if (event.key === 'r') {
      // Handle down arrow key press
      await onReset()
      await onStart()
    } else {
      await onFunction("push", {pos: event.key})
    }
  }

  const onScenario = async () => {
    try {
      busyRef.current = true;
      await postJSON(`${apiUrl}/`, params);
    } catch (e) {
      console.error(e);
      alert(`Scenario error: ${e.message}`);
    } finally {
      busyRef.current = false;
    }
  };

  const onStart = async () => {
    try {
      await postJSON(`${apiUrl}/start`);
    } catch (e) {
      alert(`Start error: ${e.message}`);
    }
  };

  const onPause = async () => {
    try {
      await postJSON(`${apiUrl}/pause`);
    } catch (e) {
      alert(`Pause error: ${e.message}`);
    }
  };

  const onReset = async () => {
    try {
      await postJSON(`${apiUrl}/reset`);
    } catch (e) {
      alert(`Reset error: ${e.message}`);
    }
  };

  const onFunction = async (op, body) => {
    try {
      await postJSON(`${apiUrl}/${op}`, body);
    } catch (e) {
      alert(`Push error: ${e.message}`);
    }
  };

  const Field = ({ label, value, onChange, step = 0.1 }) => (
    <label className="flex items-center gap-2 text-sm">
      <span className="w-36 text-gray-600">{label}</span>
      <input
        className="border rounded px-2 py-1 w-28"
        type="number"
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </label>
  );

  return (
    <div className="flex flex-col gap-3 p-4 bg-white/80 backdrop-blur rounded-2xl shadow max-w-[920px]">
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${connected ? "bg-green-500" : "bg-gray-400"}`} />
        <input
          className="border rounded px-2 py-1 text-sm flex-1"
          value={apiUrl}
          onChange={(e) => setApiUrl(e.target.value)}
          placeholder="http://localhost:3000"
        />
        <input
          className="border rounded px-2 py-1 text-sm flex-1"
          value={wsUrl}
          onChange={(e) => setWsUrl(e.target.value)}
          placeholder="http://localhost:3000"
        />
        <button className="px-3 py-1.5 rounded bg-blue-600 text-white text-sm" onClick={onScenario}>
          Create/Update Scenario
        </button>
        <button className="px-3 py-1.5 rounded bg-emerald-600 text-white text-sm" onClick={onStart}>
          Start
        </button>
        <button className="px-3 py-1.5 rounded bg-amber-600 text-white text-sm" onClick={onPause}>
          Pause
        </button>
        <button className="px-3 py-1.5 rounded bg-slate-700 text-white text-sm" onClick={onReset}>
          Reset
        </button>
        <button className="px-3 py-1.5 rounded bg-slate-700 text-white text-sm" onClick={() => onFunction("push", {pos: 1})}>
          Bottom
        </button>
        <button className="px-3 py-1.5 rounded bg-slate-700 text-white text-sm" onClick={() => onFunction("push", {pos: 2})}>
          Right
        </button>
        <button className="px-3 py-1.5 rounded bg-slate-700 text-white text-sm" onClick={() => onFunction("push", {pos: 3})}>
          Left
        </button>
      </div>

      {lastError && (
        <div className="text-xs text-red-600">{String(lastError)}</div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <Field
          label="Missile mass"
          value={params.missile.mass}
          onChange={(v) => updateParams("missile.mass", v)}
        />
        <Field
          label="Missile force"
          value={params.missile.force}
          onChange={(v) => updateParams("missile.force", v)}
        />
        <Field
          label="Missile radius"
          value={params.missile.radius}
          step={0.05}
          onChange={(v) => updateParams("missile.radius", v)}
        />

        <Field
          label="Target mass"
          value={params.target.mass}
          onChange={(v) => updateParams("target.mass", v)}
        />
        <Field
          label="Target radius"
          value={params.target.radius}
          step={0.05}
          onChange={(v) => updateParams("target.radius", v)}
        />
        <Field
          label="Target vx"
          value={params.target.vx}
          onChange={(v) => updateParams("target.vx", v)}
        />
        <Field
          label="Target vy"
          value={params.target.vy}
          onChange={(v) => updateParams("target.vy", v)}
        />
        <Field
          label="Target vz"
          value={params.target.vz}
          onChange={(v) => updateParams("target.vz", v)}
        />

        <Field
          label="Gravity"
          value={params.gravity}
          onChange={(v) => updateParams("gravity", v)}
        />
      </div>

      <p className="text-xs text-gray-500">
        Tip: parameters are posted to <code>/scenario</code>. The server should emit <code>state</code> frames via Socket.IO.
      </p>
    </div>
  );
}

/************************************
 * Scene graph (stable topology) + imperative updates
 ************************************/
function Bodies() {
  const bodyIds = useSimStore((s) => s.bodyIds);
  const meshRefs = useRef(new Map()); // id -> mesh ref

  // Ensure refs exist for each body id
  useEffect(() => {
    const map = meshRefs.current;
    // Cleanup removed ids
    for (const key of Array.from(map.keys())) {
      if (!bodyIds.includes(key)) map.delete(key);
    }
    // Ensure all needed ids are present (refs created lazily in JSX)
  }, [bodyIds]);

  // Per-frame mutation from latest snapshot
  const latestRef = useLatestFrame();
  useFrame(() => {
    const frame = latestRef.current;
    if (!frame?.bodies) return;
    const byId = Object.create(null);
    for (const b of frame.bodies) byId[b.id] = b;
    for (const id of bodyIds) {
      const b = byId[id];
      const ref = meshRefs.current.get(id);
      if (b && ref?.current) {
        ref.current.position.set(b.p.x, b.p.y, b.p.z);
        if (b.q) ref.current.quaternion.set(b.q.x, b.q.y, b.q.z, b.q.w);
      }
    }
  });

  return (
    <group>
      {bodyIds.map((id, i) => (
        <mesh
          key={id}
          ref={(el) => {
            if (el) meshRefs.current.set(id, { current: el });
            else meshRefs.current.delete(id);
          }}
          castShadow
          receiveShadow
        >
          {/* Simple heuristic: smaller radius for missile vs target can be handled in material color by server-sent meta if available */}
          <MissileModel scaleToBox={{ x: 1, y: 1, z: 1 }} />
          <meshStandardMaterial />
        </mesh>
      ))}
    </group>
  );
}

/************************************
 * Shared latest frame ref (no rerenders)
 ************************************/
const LatestFrameContext = React.createContext(null);
function useLatestFrame() {
  return React.useContext(LatestFrameContext);
}

function SceneRoot() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={0.9} castShadow />
      {/* visual ground at y=0 to match the physics plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[200, 200, 1, 1]} />
        <meshStandardMaterial />
      </mesh>
      <gridHelper args={[50, 50]} />
      <axesHelper args={[2]} />
      <Bodies />
      <OrbitControls enableDamping />
      <StatsGl />
    </>
  );
}

// Debug: log every store update with callsite
useSimStore.subscribe((state, prev) => {
  // keep it short so the console is readable
  const diff = Object.keys(state).filter(k => state[k] !== prev[k]);
  // show a stack to see WHO called set()
  // eslint-disable-next-line no-console
  console.log('[zustand change]', diff, new Error().stack.split('\n').slice(0,6).join('\n'));
});

/************************************
 * Main exported component
 ************************************/
export default function MissileSimView() {
  const latestFrameRef = useRef(null);
  useSimSocket(latestFrameRef);

  return (
    <div className="w-full h-screen bg-slate-100" style={{height: "100%", overflow: "hidden"}}>
      <div className="absolute z-10 left-4 top-4">
        <ControlsPanel />
      </div>
      <LatestFrameContext.Provider value={latestFrameRef}>
        <Canvas shadows camera={{ position: [6, 4, 8], fov: 50 }}>
          <Suspense fallback={null}>
            <SceneRoot />
          </Suspense>
        </Canvas>
      </LatestFrameContext.Provider>
    </div>
  );
}
