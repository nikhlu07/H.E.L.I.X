import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  const heroCanvasRef = useRef<HTMLDivElement>(null);
  const main = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
        const header = document.getElementById('header');
        const handleScroll = () => {
          if (window.scrollY > 50) {
            header?.classList.add('bg-white/80', 'backdrop-blur-sm', 'border-b', 'border-gray-200', 'shadow-sm');
          } else {
            header?.classList.remove('bg-white/80', 'backdrop-blur-sm', 'border-b', 'border-gray-200', 'shadow-sm');
          }
        };
        window.addEventListener('scroll', handleScroll);

        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
          const titleText = heroTitle.textContent?.trim() ?? '';
          heroTitle.innerHTML = '';
          titleText.split('').forEach(char => {
            const span = document.createElement('span');
            span.className = 'hero-title-char';
            span.style.whiteSpace = char === ' ' ? 'pre' : 'normal';
            span.textContent = char;
            heroTitle.appendChild(span);
          });

          gsap.from(".hero-title-char", {
            opacity: 0, y: 50, rotateX: -90, stagger: 0.03, duration: 1, ease: "power3.out", delay: 0.5
          });
        }
        gsap.from(".hero-subtitle", { opacity: 0, y: 20, duration: 1, ease: "power3.out", delay: 1.2 });
        gsap.from(".hero-buttons", { opacity: 0, y: 20, duration: 1, ease: "power3.out", delay: 1.5 });

        let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, particles: THREE.Points, lines: THREE.LineSegments, group: THREE.Group;
        const container = heroCanvasRef.current;
        if (!container) return;

        const mouse = new THREE.Vector2();
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };

        function init() {
          scene = new THREE.Scene();
          group = new THREE.Group();
          scene.add(group);

          camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
          camera.position.z = 50;

          renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
          renderer.setSize(window.innerWidth, window.innerHeight);
          renderer.setClearColor(0x000000, 0);
          container.appendChild(renderer.domElement);

          const particleCount = 200;
          const positions = new Float32Array(particleCount * 3);
          const particleVelocities: THREE.Vector3[] = [];

          for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
            particleVelocities.push(new THREE.Vector3((Math.random() - 0.5) * 0.1, (Math.random() - 0.5) * 0.1, (Math.random() - 0.5) * 0.1));
          }

          const particleGeometry = new THREE.BufferGeometry();
          particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

          const particleMaterial = new THREE.PointsMaterial({ color: 0xFFCC00, size: 0.5, blending: THREE.AdditiveBlending, transparent: true, sizeAttenuation: true });

          particles = new THREE.Points(particleGeometry, particleMaterial);
          (particles as any).velocities = particleVelocities;
          group.add(particles);

          const lineMaterial = new THREE.LineBasicMaterial({ color: 0xFFF0B3, linewidth: 1, transparent: true, opacity: 0.15 });
          const lineGeometry = new THREE.BufferGeometry();
          lineGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(particleCount * particleCount * 6), 3));
          lines = new THREE.LineSegments(lineGeometry, lineMaterial);
          group.add(lines);

          window.addEventListener('resize', onWindowResize, false);
          container.addEventListener('mousemove', onMouseMove, false);
          container.addEventListener('mousedown', onMouseDown, false);
          container.addEventListener('mouseup', onMouseUp, false);
          container.addEventListener('mouseleave', onMouseUp, false);
        }

        function onWindowResize() {
          if (!camera || !renderer) return;
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
        }

        function onMouseDown(event: MouseEvent) {
          isDragging = true;
          previousMousePosition = { x: event.clientX, y: event.clientY };
        }

        function onMouseUp() {
          isDragging = false;
        }

        function onMouseMove(event: MouseEvent) {
          mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
          mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

          if (isDragging) {
            const deltaMove = {
              x: event.clientX - previousMousePosition.x,
              y: event.clientY - previousMousePosition.y
            };
            group.rotation.y += deltaMove.x * 0.005;
            group.rotation.x += deltaMove.y * 0.005;
            previousMousePosition = { x: event.clientX, y: event.clientY };
          }
        }

        function animate() {
          if (!particles || !lines) return;
          requestAnimationFrame(animate);

          const positions = particles.geometry.attributes.position.array as Float32Array;
          const linePositions = lines.geometry.attributes.position.array as Float32Array;
          const velocities = (particles as any).velocities as THREE.Vector3[];

          for (let i = 0; i < particles.geometry.attributes.position.count; i++) {
            positions[i * 3] += velocities[i].x;
            positions[i * 3 + 1] += velocities[i].y;
            positions[i * 3 + 2] += velocities[i].z;
            if (positions[i * 3 + 1] < -50 || positions[i * 3 + 1] > 50) velocities[i].y = -velocities[i].y;
            if (positions[i * 3] < -50 || positions[i * 3] > 50) velocities[i].x = -velocities[i].x;
            if (positions[i * 3 + 2] < -50 || positions[i * 3 + 2] > 50) velocities[i].z = -velocities[i].z;
          }

          const connectDistance = 10;
          let lineCount = 0;
          for (let i = 0; i < particles.geometry.attributes.position.count; i++) {
            for (let j = i + 1; j < particles.geometry.attributes.position.count; j++) {
              const dx = positions[i * 3] - positions[j * 3];
              const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
              const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
              const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
              if (dist < connectDistance) {
                linePositions[lineCount++] = positions[i * 3];
                linePositions[lineCount++] = positions[i * 3 + 1];
                linePositions[lineCount++] = positions[i * 3 + 2];
                linePositions[lineCount++] = positions[j * 3];
                linePositions[lineCount++] = positions[j * 3 + 1];
                linePositions[lineCount++] = positions[j * 3 + 2];
              }
            }
          }
          for (let i = lineCount; i < linePositions.length; i++) linePositions[i] = 0;

          lines.geometry.attributes.position.needsUpdate = true;
          particles.geometry.attributes.position.needsUpdate = true;

          const raycaster = new THREE.Raycaster();
          raycaster.setFromCamera(mouse, camera);

          group.updateMatrixWorld();
          const worldMatrix = group.matrixWorld;

          const target = new THREE.Vector3();
          raycaster.ray.at(100, target);

          for (let i = 0; i < particles.geometry.attributes.position.count; i++) {
            const particlePos = new THREE.Vector3(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
            particlePos.applyMatrix4(worldMatrix);

            const distanceToMouse = target.distanceTo(particlePos);

            if (distanceToMouse < 20) {
              const direction = new THREE.Vector3().subVectors(particlePos, target).normalize();
              const localDirection = direction.transformDirection(new THREE.Matrix4().copy(worldMatrix).invert());
              velocities[i].add(localDirection.multiplyScalar(0.1));
            }
            velocities[i].multiplyScalar(0.98);
          }

          if (!isDragging) {
            group.rotation.y += 0.0002;
          }

          camera.position.x += (mouse.x * 5 - camera.position.x) * 0.03;
          camera.position.y += (-mouse.y * 5 - camera.position.y) * 0.03;
          camera.lookAt(scene.position);

          renderer.render(scene, camera);
        }

        init();
        animate();
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', onWindowResize);
            if (container) {
                container.removeEventListener('mousemove', onMouseMove);
                container.removeEventListener('mousedown', onMouseDown);
                container.removeEventListener('mouseup', onMouseUp);
                container.removeEventListener('mouseleave', onMouseUp);
            }
        }
    }, main);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={main}>
      <style>{`
        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(white, white);
            color: #1A202C;
            overflow-x: hidden;
        }
        #hero-canvas {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
        }
        .hero-content {
            position: relative;
            z-index: 2;
        }
        .cta-gradient {
            background-color: #FFCC00;
        }
        .glow {
            box-shadow: 0 0 20px rgba(255, 204, 0, 0.4);
        }
        ::selection {
            background-color: #FFCC00;
            color: black;
        }
        .hero-title-char {
            display: inline-block;
        }
      `}</style>
      <div className="antialiased">
        <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300" id="header">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center">
                <img src="logo.svg" alt="Helix Logo" className="h-8 w-auto" />
                <span className="ml-3 text-2xl font-bold tracking-tighter text-gray-800">Helix</span>
              </div>
              <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
                <a href="#problem" className="text-gray-600 hover:text-yellow-600 transition-colors duration-300">The Problem</a>
                <a href="#solution" className="text-gray-600 hover:text-yellow-600 transition-colors duration-300">Our Solution</a>
                <a href="#howitworks" className="text-gray-600 hover:text-yellow-600 transition-colors duration-300">How It Works</a>
                <a href="#features" className="text-gray-600 hover:text-yellow-600 transition-colors duration-300">Features</a>
              </nav>
              <div>
                <button onClick={onGetStarted} className="hidden sm:inline-block cta-gradient text-black font-semibold px-5 py-2.5 rounded-lg text-sm hover:opacity-90 transition-all duration-300">Get Started</button>
              </div>
            </div>
          </div>
        </header>

        <main>
          <section className="relative h-screen flex items-center justify-center overflow-hidden bg-white">
            <div id="hero-canvas" ref={heroCanvasRef}></div>
            <div className="hero-content container mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-gray-900 mb-6 hero-title">
                Humanitarian Xchange Built on Integrity
              </h1>
              <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-600 mb-10 hero-subtitle">
                A revolutionary ICP-powered blockchain system that ensures transparent and efficient delivery of humanitarian aid. Deploy instantly with immutable transparency and real-time fraud detection.
              </p>
              <div className="flex justify-center items-center gap-4 hero-buttons">
                <button onClick={onGetStarted} className="cta-gradient text-black font-semibold px-8 py-3.5 rounded-lg text-base hover:opacity-90 transition-all duration-300 glow flex items-center space-x-2">
                  <span>Try ICP Demo</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <a href="https://github.com/nikhlu07/H.E.L.I.X." target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 rounded-lg border-2 border-yellow-400/80 bg-yellow-400/10 px-6 py-3 text-sm font-semibold text-yellow-500 shadow-sm backdrop-blur-sm transition-all hover:border-yellow-400 hover:bg-yellow-400/20 hover:shadow-md">
                   <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                     <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.168 6.839 9.492.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.03-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.338 4.695-4.566 4.943.359.308.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                   </svg>
                    <span>View Source Code</span>
                </a>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
