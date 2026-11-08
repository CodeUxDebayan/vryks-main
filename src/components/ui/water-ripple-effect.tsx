"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";

interface WaterRippleEffectProps {
  imageSrc: string;
  waveIntensity?: number;
  rippleIntensity?: number;
  animationSpeed?: number;
  hoverRippleMultiplier?: number;
  transitionSpeed?: number;
  className?: string;
  containerClassName?: string;
  scale?: number;
  waveFrequency?: number;
  rippleFrequency?: number;
  distortionAmount?: number;
  onHover?: () => void;
  onLeave?: () => void;
}

export default function WaterRippleEffect({
  imageSrc,
  waveIntensity = 0.006,
  rippleIntensity = 0.012,
  animationSpeed = 1.0,
  hoverRippleMultiplier = 4.0,
  transitionSpeed = 0.08,
  className = "",
  containerClassName = "",
  scale = 1.0,
  waveFrequency = 10.0,
  rippleFrequency = 20.0,
  distortionAmount = 0.008,
  onHover,
  onLeave,
  ...props
}: WaterRippleEffectProps & React.HTMLAttributes<HTMLDivElement>) {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const timeRef = useRef(0);
  const isHoveredRef = useRef(false);

  useEffect(() => {
    const mountElement = mountRef.current;
    if (!mountElement) return;

    // Get current container dimensions
    let width = mountElement.clientWidth || window.innerWidth;
    let height = mountElement.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    
    // Use flat Orthographic Camera to map clip space directly for fullscreen shader
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
      precision: "highp",
    });

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    
    // Ensure the canvas stretches to fill the container
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.top = "0";
    renderer.domElement.style.left = "0";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    
    mountElement.appendChild(renderer.domElement);

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(imageSrc, (loadedTexture: THREE.Texture) => {
      loadedTexture.magFilter = THREE.LinearFilter;
      loadedTexture.minFilter = THREE.LinearMipmapLinearFilter;
      loadedTexture.wrapS = THREE.ClampToEdgeWrapping;
      loadedTexture.wrapT = THREE.ClampToEdgeWrapping;
      loadedTexture.generateMipmaps = true;
      loadedTexture.needsUpdate = true;

      const img = loadedTexture.image as HTMLImageElement;
      if (img && materialRef.current) {
        materialRef.current.uniforms.uImageResolution.value.set(
          img.width,
          img.height
        );
      }
    });

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform sampler2D texture1;
      uniform float time;
      uniform vec2 mouse;
      uniform float hoverIntensity;
      uniform float waveIntensity;
      uniform float rippleIntensity;
      uniform float animationSpeed;
      uniform float waveFrequency;
      uniform float rippleFrequency;
      uniform float distortionAmount;
      uniform vec2 uResolution;
      uniform vec2 uImageResolution;
      varying vec2 vUv;

      void main() {
        vec2 uv = vUv;
        
        // Global wavy distortion
        float waveScale = waveIntensity * 0.5;
        float wave1 = sin(uv.x * waveFrequency + time * animationSpeed * 2.0) * waveScale;
        float wave2 = sin(uv.y * (waveFrequency * 0.8) + time * animationSpeed * 1.5) * (waveScale * 0.8);
        float wave3 = sin((uv.x + uv.y) * (waveFrequency * 1.2) + time * animationSpeed * 2.5) * (waveScale * 0.3);
        
        // Mouse-based ripples with exponential falloff
        float dist = distance(uv, mouse);
        float rippleScale = rippleIntensity * 0.7;
        float falloff = exp(-dist * 4.0);
        
        float mouseWave1 = sin(dist * rippleFrequency - time * animationSpeed * 4.0) * 
                          falloff * hoverIntensity * rippleScale;
        float mouseWave2 = sin(dist * (rippleFrequency * 0.75) - time * animationSpeed * 3.0) * 
                          falloff * hoverIntensity * (rippleScale * 0.6);
        
        float ripple1 = sin(dist * (rippleFrequency * 1.25) - time * animationSpeed * 5.0) * 
                       exp(-dist * 5.0) * hoverIntensity * (rippleScale * 0.8);
        float ripple2 = sin(dist * (rippleFrequency * 0.9) - time * animationSpeed * 3.5) * 
                       exp(-dist * 4.0) * hoverIntensity * (rippleScale * 0.6);
        
        float totalWave = (wave1 + wave2 + wave3 + mouseWave1 + mouseWave2 + ripple1 + ripple2) * 0.5;
        
        // Subtle texture coordinate distortion
        float distortScale = distortionAmount * 0.6;
        vec2 distortion = vec2(
          sin(uv.x * (waveFrequency * 0.8) + time * animationSpeed * 1.8) * distortScale * 0.4 + 
          sin(uv.y * (waveFrequency * 0.6) + time * animationSpeed * 2.2) * distortScale * 0.3,
          sin(uv.y * (waveFrequency * 0.7) + time * animationSpeed * 1.6) * distortScale * 0.4 + 
          sin(uv.x * (waveFrequency * 0.9) + time * animationSpeed * 2.0) * distortScale * 0.3
        );
        
        vec2 mouseDir = uv - mouse;
        float mouseDist = length(mouseDir);
        vec2 mouseDistortion = vec2(0.0);
        if (mouseDist > 0.0) {
          mouseDistortion = normalize(mouseDir) * sin(mouseDist * rippleFrequency - time * animationSpeed * 4.0) * 
                                exp(-mouseDist * 4.0) * hoverIntensity * distortScale * 0.5;
        }
        
        vec2 finalDistortion = (distortion + mouseDistortion) * 0.7 + vec2(totalWave * 0.2, totalWave * 0.2);
        vec2 distortedUv = uv + finalDistortion;
        
        // Apply object-fit: cover mapping
        float screenAspect = uResolution.x / uResolution.y;
        float imageAspect = uImageResolution.x / uImageResolution.y;
        vec2 ratio = vec2(
          min(screenAspect / imageAspect, 1.0),
          min(imageAspect / screenAspect, 1.0)
        );
        vec2 texUv = distortedUv * ratio + (1.0 - ratio) * 0.5;
        texUv = clamp(texUv, 0.0, 1.0);
        
        gl_FragColor = texture2D(texture1, texUv);
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms: {
        texture1: { value: texture },
        time: { value: 0 },
        mouse: { value: new THREE.Vector2(0.5, 0.5) },
        hoverIntensity: { value: 0.3 },
        waveIntensity: { value: waveIntensity },
        rippleIntensity: { value: rippleIntensity },
        animationSpeed: { value: animationSpeed },
        waveFrequency: { value: waveFrequency },
        rippleFrequency: { value: rippleFrequency },
        distortionAmount: { value: distortionAmount },
        uResolution: { value: new THREE.Vector2(width, height) },
        uImageResolution: { value: new THREE.Vector2(width, height) },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    rendererRef.current = renderer;
    materialRef.current = material;

    // Window level mouse move to track coordinate shifts correctly over overlays
    const handleMouseMove = (event: MouseEvent) => {
      const el = renderer.domElement;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = 1 - (event.clientY - rect.top) / rect.height;
      mouseRef.current = { x, y };

      if (x >= 0 && x <= 1 && y >= 0 && y <= 1) {
        if (!isHoveredRef.current) {
          isHoveredRef.current = true;
          onHover?.();
        }
      } else {
        if (isHoveredRef.current) {
          isHoveredRef.current = false;
          onLeave?.();
        }
      }
    };

    // Smooth resize handler
    const handleResize = () => {
      if (!mountElement || !rendererRef.current || !materialRef.current) return;
      const w = mountElement.clientWidth || window.innerWidth;
      const h = mountElement.clientHeight || window.innerHeight;
      
      rendererRef.current.setSize(w, h);
      materialRef.current.uniforms.uResolution.value.set(w, h);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    const animate = () => {
      timeRef.current += 0.016;

      if (materialRef.current) {
        materialRef.current.uniforms.time.value = timeRef.current;
        materialRef.current.uniforms.mouse.value.set(
          mouseRef.current.x,
          mouseRef.current.y
        );
        const targetIntensity = isHoveredRef.current
          ? hoverRippleMultiplier
          : 0.3;
        const currentIntensity =
          materialRef.current.uniforms.hoverIntensity.value;
        materialRef.current.uniforms.hoverIntensity.value +=
          (targetIntensity - currentIntensity) * transitionSpeed;
      }

      if (rendererRef.current) {
        rendererRef.current.render(scene, camera);
      }
      requestAnimationFrame(animate);
    };
    animate();

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);

      if (
        mountElement &&
        renderer.domElement &&
        mountElement.contains(renderer.domElement)
      ) {
        mountElement.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      texture.dispose();
    };
  }, [
    imageSrc,
    waveIntensity,
    rippleIntensity,
    animationSpeed,
    hoverRippleMultiplier,
    transitionSpeed,
    waveFrequency,
    rippleFrequency,
    distortionAmount,
    onHover,
    onLeave,
  ]);

  return (
    <div
      className={`w-full h-full relative overflow-hidden ${containerClassName}`}
      {...props}
    >
      <div
        ref={mountRef}
        className={`w-full h-full transition-transform duration-300 ${className}`}
        style={{ transform: `scale(${scale})` }}
      />
    </div>
  );
}
