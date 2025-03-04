import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader";
import CanvasLoader from "../Loader";

const ComputerModel = ({ isMobile }) => {
  const { scene } = useGLTF(
    "./gaming_pc_with_curved_monitor/scene.gltf",
    undefined,
    (loader) => {
      const dracoLoader = new DRACOLoader();
      loader.setDRACOLoader(dracoLoader);
    }
  );

  return (
    <mesh>
      {/* Increased lighting for better visibility */}
      <hemisphereLight intensity={3} groundColor="gray" />
      <spotLight
        position={[-10, 10, 5]}
        angle={0.3}
        penumbra={1}
        intensity={3}
        castShadow
        shadow-mapSize={1024}
      />
      <pointLight intensity={5} position={[0, 20, 0]} />
      <primitive
        object={scene}
        scale={isMobile ? 0.8 : 1.3} // Made the model significantly larger
        position={isMobile ? [0, -1, -1] : [0, -1.5, -1.5]} // Centered it for both views
        rotation={[-0.02, 0, 0]} // Kept slight rotation for a natural view
      />
    </mesh>
  );
};

const MemoizedComputerModel = React.memo(ComputerModel);

const ComputersCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 500px)");

    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    <Canvas
      frameloop="demand"
      shadows
      dpr={[1, 2]}
      camera={{
        position: [5, 2, 7], // Bring the camera closer for a more prominent view
        fov: 30, // Focus more tightly on the model
      }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          autoRotate
          enableZoom={false} // Allow zoom for more control
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <MemoizedComputerModel isMobile={isMobile} />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default ComputersCanvas;
