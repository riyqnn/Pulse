import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function AnimatedBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Clear any existing canvas
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);

    // Create animated particles with individual movement
    const particleCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 50;
      positions[i3 + 1] = (Math.random() - 0.5) * 50;
      positions[i3 + 2] = (Math.random() - 0.5) * 50;

      originalPositions[i3] = positions[i3];
      originalPositions[i3 + 1] = positions[i3 + 1];
      originalPositions[i3 + 2] = positions[i3 + 2];

      velocities[i3] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Custom shader material with pulsing effect
    const material = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(0x10b981) },
      },
      vertexShader: `
        attribute float size;
        uniform float time;
        varying float vOpacity;
        void main() {
          vec3 pos = position;
          pos.x += sin(time * 0.5 + position.y * 0.05) * 2.0;
          pos.y += cos(time * 0.5 + position.x * 0.05) * 2.0;
          pos.z += sin(time * 0.3 + position.x * 0.1) * 1.5;

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = 120.0 * (1.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;

          vOpacity = 0.5 + 0.5 * sin(time * 2.0 + position.x * 0.1);
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        varying float vOpacity;
        void main() {
          float strength = distance(gl_PointCoord, vec2(0.5));
          strength = 1.0 - strength;
          strength = pow(strength, 2.0);
          gl_FragColor = vec4(color, strength * vOpacity * 0.7);
        }
      `,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Floating geometric shapes
    const shapesGroup = new THREE.Group();
    const shapeGeometry = new THREE.IcosahedronGeometry(0.5, 0);
    const shapeMaterial = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.3,
      wireframe: true,
    });

    for (let i = 0; i < 15; i++) {
      const shape = new THREE.Mesh(shapeGeometry, shapeMaterial.clone());
      shape.position.set(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 30
      );
      shape.userData = {
        rotationSpeed: Math.random() * 0.02 + 0.01,
        floatSpeed: Math.random() * 0.5 + 0.5,
        floatOffset: Math.random() * Math.PI * 2,
      };
      shapesGroup.add(shape);
    }
    scene.add(shapesGroup);

    // Connecting lines
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.15,
    });

    const lineGeometry = new THREE.BufferGeometry();
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop - START IMMEDIATELY
    const clock = new THREE.Clock();
    let isAnimating = true;

    const animate = () => {
      if (!isAnimating) return;

      const elapsedTime = clock.getElapsedTime();

      // Update shader time IMMEDIATELY
      material.uniforms.time.value = elapsedTime;

      // Move particles
      const posAttribute = geometry.attributes.position;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        posAttribute.array[i3] += velocities[i3];
        posAttribute.array[i3 + 1] += velocities[i3 + 1];
        posAttribute.array[i3 + 2] += velocities[i3 + 2];

        // Boundary check
        if (Math.abs(posAttribute.array[i3]) > 25) velocities[i3] *= -1;
        if (Math.abs(posAttribute.array[i3 + 1]) > 25) velocities[i3 + 1] *= -1;
        if (Math.abs(posAttribute.array[i3 + 2]) > 25) velocities[i3 + 2] *= -1;

        // Wave motion
        posAttribute.array[i3] += Math.sin(elapsedTime + originalPositions[i3 + 1] * 0.1) * 0.01;
        posAttribute.array[i3 + 1] += Math.cos(elapsedTime + originalPositions[i3] * 0.1) * 0.01;
      }
      posAttribute.needsUpdate = true;

      // Rotate particle system
      particles.rotation.y = elapsedTime * 0.1;
      particles.rotation.x = Math.sin(elapsedTime * 0.15) * 0.1;

      // Animate shapes
      shapesGroup.children.forEach((shape) => {
        const mesh = shape as THREE.Mesh;
        mesh.rotation.x += mesh.userData.rotationSpeed;
        mesh.rotation.y += mesh.userData.rotationSpeed * 0.7;
        mesh.position.y += Math.sin(elapsedTime * mesh.userData.floatSpeed + mesh.userData.floatOffset) * 0.02;
      });
      shapesGroup.rotation.y = elapsedTime * 0.05;

      // Update connecting lines
      const currentPositions = posAttribute.array as Float32Array;
      const linePositions: number[] = [];

      for (let i = 0; i < particleCount; i++) {
        for (let j = i + 1; j < particleCount; j++) {
          const dx = currentPositions[i * 3] - currentPositions[j * 3];
          const dy = currentPositions[i * 3 + 1] - currentPositions[j * 3 + 1];
          const dz = currentPositions[i * 3 + 2] - currentPositions[j * 3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < 6) {
            linePositions.push(
              currentPositions[i * 3], currentPositions[i * 3 + 1], currentPositions[i * 3 + 2],
              currentPositions[j * 3], currentPositions[j * 3 + 1], currentPositions[j * 3 + 2]
            );
          }
        }
      }

      lines.geometry.dispose();
      lines.geometry = new THREE.BufferGeometry();
      lines.geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

      // Camera follows mouse
      camera.position.x += (mouseX * 8 - camera.position.x) * 0.03;
      camera.position.y += (mouseY * 8 - camera.position.y) * 0.03;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);

      // Continue animation
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // START ANIMATION IMMEDIATELY
    animationFrameRef.current = requestAnimationFrame(animate);

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      isAnimating = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      shapeGeometry.dispose();
      shapeMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
    };
  }, []); // Empty deps - run once on mount

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none" />;
}
