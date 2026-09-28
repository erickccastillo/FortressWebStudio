import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

const FadeInSection = ({ children, delay = 'delay-0', className = '' }) => {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef(null);
  
// ... rest of your component remains the same
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      });
    }, { 
      threshold: 0.15 
    });

    const currentRef = domRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 ease-out will-change-[opacity,transform] ${delay} ${
        isVisible 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-12 scale-95'
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default function App() {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const mount = mountRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.z = 25;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(10, 20, 15);
    scene.add(dirLight);

    const PARTICLE_COUNT = 150;
    const INNER_RADIUS = 5.0;
    const OUTER_RADIUS = 25.0;
    const MAX_DISTANCE = 4.5;

    // Increased size and reduced segments to make the "net" grid distinctly visible
    const geometry = new THREE.SphereGeometry(0.25, 12, 12);
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xeaeaea,
      metalness: 0.9,
      roughness: 0.1,
      transparent: true,
      opacity: 0.6,
      wireframe: true, // This creates the net/hologram look
    });

    const mesh = new THREE.InstancedMesh(geometry, material, PARTICLE_COUNT);
    const dummy = new THREE.Object3D();
    
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);
    const colorPlatinum = new THREE.Color('#eaeaea');
    const colorGold = new THREE.Color('#D4C3A3');

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const radius = INNER_RADIUS + Math.random() * (OUTER_RADIUS - INNER_RADIUS);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;

      const mixedColor = colorPlatinum.clone().lerp(colorGold, Math.random() * 0.6);
      mesh.setColorAt(i, mixedColor);
    }
    
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(mesh);

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xD4C3A3,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending
    });
    
    const maxLines = (PARTICLE_COUNT * (PARTICLE_COUNT - 1)) / 2;
    const linePositions = new Float32Array(maxLines * 6);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lineSegments);

    let animationFrameId;

    const animate = () => {
      const time = performance.now() * 0.0005;
      scene.rotation.y = time * 0.1;
      scene.rotation.x = Math.sin(time * 0.2) * 0.05;

      let lineIndex = 0;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const ix = i * 3;
        const iy = i * 3 + 1;
        const iz = i * 3 + 2;

        positions[ix] += velocities[ix];
        positions[iy] += velocities[iy];
        positions[iz] += velocities[iz];

        const distFromCenter = Math.sqrt(positions[ix] ** 2 + positions[iy] ** 2 + positions[iz] ** 2);
        
        if (distFromCenter < INNER_RADIUS || distFromCenter > OUTER_RADIUS) {
          velocities[ix] *= -1.05;
          velocities[iy] *= -1.05;
          velocities[iz] *= -1.05;

          const speed = Math.sqrt(velocities[ix]**2 + velocities[iy]**2 + velocities[iz]**2);
          if (speed > 0.05) {
              velocities[ix] = (velocities[ix]/speed) * 0.02;
              velocities[iy] = (velocities[iy]/speed) * 0.02;
              velocities[iz] = (velocities[iz]/speed) * 0.02;
          }
        }

        dummy.position.set(positions[ix], positions[iy], positions[iz]);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);

        for (let j = i + 1; j < PARTICLE_COUNT; j++) {
          const jx = j * 3;
          const jy = j * 3 + 1;
          const jz = j * 3 + 2;

          const dx = positions[ix] - positions[jx];
          const dy = positions[iy] - positions[jy];
          const dz = positions[iz] - positions[jz];
          const distSq = dx * dx + dy * dy + dz * dz;

          if (distSq < MAX_DISTANCE * MAX_DISTANCE) {
            linePositions[lineIndex++] = positions[ix];
            linePositions[lineIndex++] = positions[iy];
            linePositions[lineIndex++] = positions[iz];
            linePositions[lineIndex++] = positions[jx];
            linePositions[lineIndex++] = positions[jy];
            linePositions[lineIndex++] = positions[jz];
          }
        }
      }

      mesh.instanceMatrix.needsUpdate = true;
      lineGeometry.setDrawRange(0, lineIndex / 3);
      lineGeometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0f1011] text-[#eaeaea] font-sans selection:bg-[#D4C3A3]/30 selection:text-white relative flex flex-col w-full overflow-x-hidden">
      
      <style dangerouslySetInnerHTML={{__html: `
        html { scroll-behavior: smooth !important; overflow-x: hidden !important; }
        body { background-color: #0f1011 !important; overflow-x: hidden !important; margin: 0; padding: 0; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}} />

      <main className="relative w-full flex flex-col items-center">
        
        {/* --- 1. HERO SECTION --- */}
        <section className="relative flex flex-col items-center justify-center min-h-[100dvh] w-full overflow-hidden pt-24 lg:pt-0">
          
          {/* ThreeJS Background Canvas */}
          <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none" />
          
          {/* Gradient Overlays */}
          <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-[#0f1011] via-[#0f1011]/70 to-transparent lg:via-[#0f1011]/50" />
          <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-[#0f1011] via-transparent to-transparent" />

          {/* Hero Content */}
          <div className="w-full max-w-[100rem] mx-auto px-6 sm:px-12 flex flex-col justify-center flex-grow relative z-20">
            
            <div className="w-full max-w-5xl text-left flex flex-col items-start animate-[fade-in_1s_ease-out]">
              <h1 className="text-[10vw] sm:text-[8vw] lg:text-[6rem] xl:text-[7rem] font-medium tracking-tighter text-[#eaeaea] mb-4 leading-[0.95]">
                Modern Web Development
                <span className="block text-[#D4C3A3] mt-2">Built for Growing Businesses.</span>
              </h1>

              <p className="text-[#a3a3a3] text-lg sm:text-xl lg:text-2xl leading-relaxed max-w-2xl mb-12 tracking-wide font-light">
                Fortress Web Studio is a remote web development team focused on creating modern websites, custom digital solutions, and scalable online experiences that help businesses strengthen their presence, attract new customers, and achieve long-term growth.
              </p>

              <div className="flex flex-wrap gap-6 items-center">
                <a href="#who-we-are" className="px-8 py-4 bg-[#eaeaea] text-[#0f1011] text-sm font-bold tracking-widest uppercase hover:bg-[#D4C3A3] transition-colors duration-300">
                  Who We Are
                </a>
                <a href="#mission-values" className="px-8 py-4 border border-[#333] text-[#eaeaea] text-sm font-bold tracking-widest uppercase hover:border-[#D4C3A3] hover:text-[#D4C3A3] transition-all duration-300">
                  Mission & Values
                </a>
                <a href="#how-we-work" className="px-8 py-4 border border-[#333] text-[#eaeaea] text-sm font-bold tracking-widest uppercase hover:border-[#D4C3A3] hover:text-[#D4C3A3] transition-all duration-300">
                  How We Work
                </a>
              </div>
            </div>

          </div>
        </section>

        {/* Section Divider */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#333] to-transparent relative z-20" />

        {/* --- 2. WHO WE ARE --- */}
        <section id="who-we-are" className="w-full bg-[#141516] py-32 md:py-48 px-6 sm:px-12 relative z-10">
          <div className="max-w-4xl mx-auto">
            <FadeInSection>
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-medium text-[#eaeaea] mb-12 tracking-tighter">
                Who We Are
              </h3>
            </FadeInSection>
            
            <div className="space-y-12 text-[#a3a3a3] text-xl md:text-2xl leading-relaxed font-light">
              <FadeInSection delay="delay-100">
                <p>
                  Fortress Web Studio is a remote-first web development team dedicated to helping businesses establish a professional and effective digital presence. We specialize in designing and building modern websites that blend great user experience with strong technical foundations.
                </p>
              </FadeInSection>
              <FadeInSection delay="delay-200">
                <p>
                  Our team works collaboratively across projects, leveraging modern technologies and streamlined workflows to ensure quality, efficiency, and consistency in every solution we deliver.
                </p>
              </FadeInSection>
              <FadeInSection delay="delay-300">
                <p>
                  Whether developing a company website, a custom platform, or a complete digital experience, our goal remains the same: creating reliable solutions that support business success.
                </p>
              </FadeInSection>
            </div>
          </div>
        </section>

        {/* Section Divider */}
        <div className="w-full h-[1px] bg-[#222]" />

        {/* --- 3. MISSION & VALUES --- */}
        <section id="mission-values" className="w-full bg-[#0f1011] py-32 md:py-48 px-6 sm:px-12">
          <div className="max-w-[100rem] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
            
            {/* Left Column: Mission */}
            <div className="flex flex-col">
              <FadeInSection>
                <h3 className="text-4xl md:text-5xl lg:text-6xl font-medium text-[#eaeaea] mb-12 tracking-tighter">
                  Our Mission
                </h3>
                <div className="text-[#a3a3a3] text-xl md:text-2xl leading-relaxed font-light space-y-8">
                  <p>
                    At Fortress Web Studio, our mission is to empower businesses through innovative web solutions that combine exceptional design, modern technology, and strategic thinking. We believe a website should be more than an online presence. It should become a powerful tool that supports business growth, improves customer engagement, and creates lasting value.
                  </p>
                  <p>
                    By combining technical expertise with a client-focused approach, we deliver digital products designed to meet real business needs while maintaining reliability, performance, and scalability.
                  </p>
                </div>
              </FadeInSection>
            </div>

            {/* Right Column: Values */}
            <div className="flex flex-col pt-4 lg:pt-0">
              <FadeInSection delay="delay-100">
                <h3 className="text-4xl md:text-5xl lg:text-6xl font-medium text-[#eaeaea] mb-12 tracking-tighter">
                  Our Values
                </h3>
                <p className="text-[#a3a3a3] text-xl leading-relaxed font-light mb-12">
                  The foundation of Fortress Web Studio is built on principles that guide every decision, project, and client relationship.
                </p>
                <div className="flex flex-wrap gap-4">
                  {['Commitment', 'Transparency', 'Organization', 'Communication', 'Innovation', 'Reliability', 'Quality', 'Professionalism', 'Collaboration', 'Growth'].map((value, i) => (
                    <span key={value} className="px-6 py-3 border border-[#333] text-[#eaeaea] text-sm uppercase tracking-widest hover:border-[#D4C3A3] hover:text-[#D4C3A3] transition-colors cursor-default">
                      {value}
                    </span>
                  ))}
                </div>
              </FadeInSection>
            </div>

          </div>
        </section>

        {/* Section Divider */}
        <div className="w-full h-[1px] bg-[#222]" />

        {/* --- 4. HOW WE WORK --- */}
        <section id="how-we-work" className="w-full bg-[#141516] py-32 md:py-48 px-6 sm:px-12">
          <div className="max-w-[100rem] mx-auto">
            <FadeInSection>
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-medium text-[#eaeaea] mb-16 tracking-tighter text-center md:text-left">
                How We Work
              </h3>
            </FadeInSection>
          
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              <FadeInSection delay="delay-100">
                <div className="p-10 md:p-12 border border-[#2a2a2a] bg-[#0f1011] hover:border-[#D4C3A3]/50 transition-colors duration-500 h-full group">
                  <h4 className="text-[#eaeaea] text-2xl font-medium mb-6 group-hover:text-[#D4C3A3] transition-colors">Remote Collaboration</h4>
                  <p className="text-[#a3a3a3] leading-relaxed text-lg font-light">
                    Operating remotely allows us to work with businesses from different locations while maintaining flexibility, responsiveness, and efficient communication throughout every stage of a project.
                  </p>
                </div>
              </FadeInSection>
          
              <FadeInSection delay="delay-200">
                <div className="p-10 md:p-12 border border-[#2a2a2a] bg-[#0f1011] hover:border-[#D4C3A3]/50 transition-colors duration-500 h-full group">
                  <h4 className="text-[#eaeaea] text-2xl font-medium mb-6 group-hover:text-[#D4C3A3] transition-colors">Organized Process</h4>
                  <p className="text-[#a3a3a3] leading-relaxed text-lg font-light">
                    Every project follows a structured workflow with clear milestones, transparent planning, regular updates, and defined objectives that keep progress measurable and predictable.
                  </p>
                </div>
              </FadeInSection>
          
              <FadeInSection delay="delay-300">
                <div className="p-10 md:p-12 border border-[#2a2a2a] bg-[#0f1011] hover:border-[#D4C3A3]/50 transition-colors duration-500 h-full group">
                  <h4 className="text-[#eaeaea] text-2xl font-medium mb-6 group-hover:text-[#D4C3A3] transition-colors">Commitment to Excellence</h4>
                  <p className="text-[#a3a3a3] leading-relaxed text-lg font-light">
                    We are committed to delivering dependable solutions, providing ongoing support, and maintaining high standards of quality, performance, and professionalism in every project.
                  </p>
                </div>
              </FadeInSection>
          
            </div>
          </div>
        </section>
        
      </main>
    </div>
  );
}