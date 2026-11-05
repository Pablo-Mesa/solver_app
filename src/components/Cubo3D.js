import { useRef } from 'react';
import { useFrame } from '@react-three/fiber/native';
import { useTexture } from '@react-three/drei/native';

// Importa tu imagen de la raíz (usando la ruta correcta que arreglamos antes)
const logoImagen = require('../../assets/icono_solver_nobg.png');

export default function Cubo3D() {
  const meshRef = useRef(null);

  // 1. Cargamos la imagen como textura de Three.js
  const textura = useTexture(logoImagen);

  // 2. Animación infinita: aumentamos la rotación en cada frame
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01; // Velocidad en eje X
      meshRef.current.rotation.y += 0.015; // Velocidad en eje Y
    }
  });

  return (
    <mesh ref={meshRef}>
      {/* Definimos la forma del cubo: Ancho, Alto, Profundidad */}
      <boxGeometry args={[2.5, 2.5, 2.5]} />
      
      {/* Aplicamos la textura de la imagen a las 6 caras del cubo */}
      <meshStandardMaterial map={textura} transparent={true} />
    </mesh>
  );
}
