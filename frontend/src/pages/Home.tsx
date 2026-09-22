import { useEffect } from 'react';

export default function Home() {
  // Configuración del Intersection Observer para las animaciones de scroll
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const elementsToReveal = document.querySelectorAll('.reveal-on-scroll');

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      elementsToReveal.forEach(el => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    elementsToReveal.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Mapeo de tus valores originales con los iconos y descripciones del nuevo diseño
  const coreValues = [
    { name: 'Commitment', icon: 'loyalty', desc: 'Involved 100% with your success.' },
    { name: 'Transparency', icon: 'visibility', desc: 'Absolute clarity in progress.' },
    { name: 'Organization', icon: 'view_timeline', desc: 'Agile and punctual deliveries.' },
    { name: 'Communication', icon: 'forum', desc: 'Open and constant dialogue.' },
    { name: 'Innovation', icon: 'auto_awesome', desc: 'Modern digital solutions.' },
    { name: 'Reliability', icon: 'shield', desc: 'Robust systems that do not fail.' },
    { name: 'Quality', icon: 'verified', desc: 'Code craftsmanship.' },
    { name: 'Professionalism', icon: 'workspace_premium', desc: 'Absolute respect for your time.' },
    { name: 'Collaboration', icon: 'group_work', desc: 'We work as a single team.' },
    { name: 'Growth', icon: 'trending_up', desc: 'Driving your evolution.' },
  ];

  return (
    <div className="bg-background text-on-surface antialiased selection:bg-primary selection:text-on-primary min-h-screen flex flex-col justify-between overflow-x-hidden font-body-md">
      
      {/* Estilos globales inyectados para iconos y animaciones de tarjetas */}
      <style dangerouslySetInnerHTML={{__html: `
        .material-symbols-outlined {
          font-family: 'Material Symbols Outlined';
          font-weight: normal;
          font-style: normal;
          font-size: 24px;
          line-height: 1;
          letter-spacing: normal;
          text-transform: none;
          display: inline-block;
          white-space: nowrap;
          word-wrap: normal;
          direction: ltr;
          -webkit-font-smoothing: antialiased;
          vertical-align: middle;
        }
        
        .reveal-on-scroll {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 700ms cubic-bezier(0.16, 1, 0.3, 1), transform 700ms cubic-bezier(0.16, 1, 0.3, 1);
          will-change: opacity, transform;
        }

        .reveal-on-scroll.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        @media (prefers-reduced-motion: reduce) {
          .reveal-on-scroll {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
        }

        .craft-card {
          box-shadow: 0 4px 20px -2px rgba(28, 25, 23, 0.04);
          transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 300ms cubic-bezier(0.16, 1, 0.3, 1), border-color 300ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .craft-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px -4px rgba(28, 25, 23, 0.07);
        }
      `}} />

      <main className="w-full flex-grow">
        
        {/* --- SECCIÓN HERO --- */}
        <section className="relative pt-12 md:pt-20 pb-20 md:pb-28 px-6 lg:px-20 max-w-7xl mx-auto">
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-gradient-to-b from-surface-container-low/60 to-transparent blur-3xl -z-10 pointer-events-none rounded-full"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Columna de Texto */}
            <div className="lg:col-span-7 flex flex-col items-start reveal-on-scroll">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-surface-container-lowest border border-outline-variant/40 shadow-sm mb-6">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary"></span>
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                  Fortress Web Studio · Remote-first
                </span>
              </div>
              
              <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface tracking-tight mb-6">
                Modern Web Development <span className="text-primary relative inline-block underline decoration-secondary-container decoration-4 underline-offset-8">Built for Growing Businesses</span>.
              </h1>
              
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-8 leading-relaxed">
                Fortress Web Studio is a remote web development team focused on creating modern websites, custom digital solutions, and scalable online experiences that help businesses strengthen their presence.
              </p>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-12">
                <a href="#contact" className="inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md transition-all duration-300 hover:bg-primary hover:shadow-md hover:-translate-y-0.5">
                  <span>Start Your Project</span>
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </a>
                <a href="#how-we-work" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-surface-container-lowest border border-outline-variant/60 text-on-surface font-label-md text-label-md transition-all duration-300 hover:bg-surface-bright hover:border-outline hover:-translate-y-0.5">
                  <span>How We Work</span>
                  <span className="material-symbols-outlined text-[20px] text-outline">explore</span>
                </a>
              </div>
            </div>

            {/* Columna de Imagen */}
            <div className="lg:col-span-5 relative reveal-on-scroll">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute -top-4 -right-4 w-72 h-72 bg-secondary-fixed/30 rounded-3xl -z-10 blur-xl"></div>
                <div className="absolute -bottom-6 -left-6 w-64 h-64 bg-surface-container-high/60 rounded-3xl -z-10 blur-lg"></div>
                
                <div className="rounded-2xl overflow-hidden border border-outline-variant/40 bg-surface-container-lowest craft-card shadow-lg p-2.5">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuA00lPzJaijyxEUhcv82aW1FpXaILvk3xtN7Btp_-fIOy5QjzBQ-7wjhnq3ewVg3YF4ZTnqO22WSU57gekfC3pcj-_nmjzRpwMsbgDswSoUYoM5fkDo0bR6wFutiH8UQfIZ6dKtxR9xo6ZitEtQMBZwCMLXuBB0NaNVGq6OjwgmtOUYuvUDm85oMX_9GEUQOG4vpPCiYHGV6LDsuXYnMLaEtxCSFz01uFlFMIG97_iJsNd8A8jHiZ0" alt="Fortress Web Studio Team" className="w-full h-80 sm:h-96 object-cover rounded-xl" />
                </div>
                
                <div className="absolute -bottom-6 -left-4 sm:-left-8 bg-surface-container-lowest border border-outline-variant/50 p-4 rounded-xl shadow-xl flex items-center gap-3.5 max-w-xs craft-card">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary flex-shrink-0">
                    <span className="material-symbols-outlined text-[22px]">verified_user</span>
                  </div>
                  <div>
                    <p className="font-label-md text-label-md text-on-surface font-semibold">100% Satisfaction</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-tight">Clean code, scalable and on-time deliveries.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- SECCIÓN MISIÓN --- */}
        <section className="py-20 md:py-28 px-6 lg:px-20 bg-surface-container-low/50 border-y border-outline-variant/20 relative">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-3xl mb-16 reveal-on-scroll">
              <div className="inline-flex items-center gap-2 text-primary font-label-md text-label-md uppercase tracking-wider mb-3">
                <span className="material-symbols-outlined text-[18px]">lightbulb</span>
                <span>Our Mission</span>
              </div>
              <h2 className="font-headline-xl text-headline-xl text-on-surface mb-6">
                A website is more than an online presence. It should become a powerful tool.
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                At Fortress Web Studio, our mission is to empower businesses through innovative web solutions that combine exceptional design, modern technology, and strategic thinking. We deliver digital products designed to meet real business needs while maintaining reliability, performance, and scalability.
              </p>
            </div>
          </div>
        </section>

        {/* --- SECCIÓN SOBRE MÍ (Who We Are) --- */}
        <section className="py-20 md:py-28 px-6 lg:px-20 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 reveal-on-scroll">
              <div className="inline-flex items-center gap-2 text-primary font-label-md text-label-md uppercase tracking-wider mb-3">
                <span className="material-symbols-outlined text-[18px]">groups</span>
                <span>Who We Are</span>
              </div>
              <h2 className="font-headline-xl text-headline-xl text-on-surface mb-6">
                Remote-first company dedicated to establishing effective digital presence.
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-6 leading-relaxed">
                We specialize in designing and building modern websites that blend great user experience with strong technical foundations. Our team works collaboratively across projects, leveraging modern technologies to ensure quality in every solution.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 craft-card">
                  <div className="p-2 rounded-lg bg-surface-container-low text-primary flex-shrink-0">
                    <span className="material-symbols-outlined text-[20px]">handshake</span>
                  </div>
                  <div>
                    <h4 className="font-headline-sm text-headline-sm text-on-surface text-[17px] mb-1">Collaboration without barriers</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Streamlined workflows to ensure quality, efficiency, and consistency.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-6 reveal-on-scroll">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="rounded-2xl overflow-hidden border border-outline-variant/40 bg-surface-container-lowest craft-card shadow-lg p-3">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4v3QWGz8dPmPzP9tjcflASgFW-0sBKm8BKb4PUllYA7a6lrTMn6LdRoXcsJiwzYpSv5Um_GPc_4qKB4ZMcBVQBg1Z8telq2q7JrQOne1vnrNUNJ8rQWcnRZ1EXPBGn3dE5MZIRZ8xX5M_hwnDARjtvcTlOWF_60OkfpUYk3HcP4etzOrFK_FoR2xUSvEZhpBI9Bn1Ba34FrEI2FbJQ_4MixhaGBr4r6PYdHIt0YHXnXo-DEUp_w4" alt="Digital Architecture" className="w-full h-96 lg:h-[480px] object-cover rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- SECCIÓN EXPERIENCIA (How We Work) --- */}
        <section id="how-we-work" className="py-20 md:py-28 px-6 lg:px-20 bg-surface-container-low/40 border-y border-outline-variant/20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16 reveal-on-scroll">
              <div className="inline-flex items-center gap-2 text-primary font-label-md text-label-md uppercase tracking-wider mb-3">
                <span className="material-symbols-outlined text-[18px]">account_tree</span>
                <span>How We Work</span>
              </div>
              <h2 className="font-headline-xl text-headline-xl text-on-surface mb-4">
                A clear, predictable, and transparent process.
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/30 craft-card relative flex flex-col justify-between reveal-on-scroll">
                <span className="text-5xl font-black text-outline-variant/30 mb-6 block font-display-lg select-none">01</span>
                <div>
                  <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary mb-4">
                    <span className="material-symbols-outlined text-[26px]">public</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-3">Remote Collaboration</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    Operating remotely allows us to work with businesses from different locations while maintaining flexibility, responsiveness, and efficient communication.
                  </p>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/30 craft-card relative flex flex-col justify-between reveal-on-scroll">
                <span className="text-5xl font-black text-outline-variant/30 mb-6 block font-display-lg select-none">02</span>
                <div>
                  <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary mb-4">
                    <span className="material-symbols-outlined text-[26px]">checklist_rtl</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-3">Organized Process</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    Every project follows a structured workflow with clear milestones, transparent planning, regular updates, and defined objectives.
                  </p>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/30 craft-card relative flex flex-col justify-between reveal-on-scroll">
                <span className="text-5xl font-black text-outline-variant/30 mb-6 block font-display-lg select-none">03</span>
                <div>
                  <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary mb-4">
                    <span className="material-symbols-outlined text-[26px]">verified</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-3">Commitment to Excellence</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    We are committed to delivering dependable solutions, providing ongoing support, and maintaining high standards in every project.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- SECCIÓN VALORES --- */}
        <section className="py-20 md:py-28 px-6 lg:px-20 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 reveal-on-scroll">
            <div className="inline-flex items-center gap-2 text-primary font-label-md text-label-md uppercase tracking-wider mb-3">
              <span className="material-symbols-outlined text-[18px]">favorite</span>
              <span>Our Values</span>
            </div>
            <h2 className="font-headline-xl text-headline-xl text-on-surface mb-4">
              The foundation of Fortress Web Studio
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Built on principles that guide every decision, project, and client relationship.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 reveal-on-scroll">
            {coreValues.map((value, idx) => (
              <div key={idx} className="p-5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 craft-card flex flex-col items-center text-center group">
                <div className="w-10 h-10 rounded-full bg-surface-container-low text-primary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[20px]">{value.icon}</span>
                </div>
                <span className="font-label-md text-label-md text-on-surface mb-1">{value.name}</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant text-[13px] leading-tight">
                  {value.desc}
                </span>
              </div>
            ))}
          </div>
        </section>
        
      </main>
    </div>
  );
}