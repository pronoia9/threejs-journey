import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber'; // TODO check useThree to do the hovering for the Canvas
import { OrbitControls, useCursor, useGLTF, meshBounds, useBVH } from '@react-three/drei'; // TODO check useCursor helper instead of hover funcs + check BVH

export default function Experience() {
  const cube = useRef();
  const burger = useGLTF('./hamburger.glb');

  useFrame((state, delta) => {
    cube.current.rotation.y += delta * 0.2;
  });

  const handleHover = (e) => {
    e.stopPropagation();
    document.body.style.cursor = 'pointer';
  };

  const handleHoverLeave = (e) => {
    e.stopPropagation();
    document.body.style.cursor = 'default';
  };

  const handleClick = (e) => {
    e.stopPropagation(); // occlusion
    e.eventObject.material.color.set(`hsl(${Math.random() * 360}, 100%, 75%)`);
  };

  return (
    <>
      <OrbitControls makeDefault />

      <directionalLight position={[1, 2, 3]} intensity={1.5} />
      <ambientLight intensity={0.5} />

      <primitive
        object={burger.scene}
        scale={0.25}
        position={[0, 0.5, 0]}
        onClick={(e) => {
          e.stopPropagation();
          console.log(e.object);
          console.log(e.eventObject);
        }}
      />

      <mesh position-x={-2} onPointerEnter={handleHover} onPointerLeave={handleHoverLeave} onClick={handleClick}>
        <sphereGeometry />
        <meshStandardMaterial color='orange' />
      </mesh>

      <mesh
        ref={cube}
        raycast={meshBounds}
        position-x={2}
        scale={1.5}
        onPointerEnter={handleHover}
        onPointerLeave={handleHoverLeave}
        onClick={handleClick}
      >
        <boxGeometry />
        <meshStandardMaterial color='mediumpurple' />
      </mesh>

      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        <meshStandardMaterial color='greenyellow' />
      </mesh>
    </>
  );
}
