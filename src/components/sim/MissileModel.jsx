// MissileModel.jsx
import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";

/**
 * props:
 *   url: string to .glb/.gltf
 *   length/width/height: optional — if you want to force a size to match physics box
 */
export default function MissileModel({ scaleToBox, color, ...rest }) {
  const { scene } = useGLTF("http://localhost:3003/visualizer-react-2/assets/missile.glb");

  // center + scale to target box (once)
  const { centered, scale } = useMemo(() => {
    const s = scene.clone(true);
    s.updateMatrixWorld(true);

    // compute bbox
    const box = new THREE.Box3().setFromObject(s);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    // recenter geometry around origin so physics/visual share the same pivot
    s.traverse((o) => {
      if (o.isMesh) {
        o.geometry = o.geometry.clone();
        o.geometry.translate(-center.x, -center.y, -center.z);
        // simple material override if you want a unified color
        if (color && o.material) {
o.material = o.material.clone()
 o.material.color.set(color);
        } 
      }
    });

    let scale = 1;
    if (scaleToBox) {
      const { x: X, y: Y, z: Z } = size;
      // scale uniformly to fit inside scaleToBox
      const k = Math.min(
        scaleToBox.x / (X || 1),
        scaleToBox.y / (Y || 1),
        scaleToBox.z / (Z || 1),
      );
      scale = k;
    }
    return { centered: s, scale };
  }, [scene, scaleToBox, color]);

  return <primitive object={centered} scale={scale} {...rest} />;
}