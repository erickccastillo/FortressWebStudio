import { Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-900 bg-[#03050a] py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Marca */}
          <div className="text-center md:text-left">
            <h3 className="text-white font-bold text-lg">
              Fortress Web Studio
            </h3>

            <p className="text-slate-500 text-sm mt-1">
              Modern Web Development & Digital Solutions
            </p>
          </div>

          {/* Redes */}
          <div className="flex items-center gap-5">

            <a
              href="https://github.com/erickccastillo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-cyan-400 transition-colors"
            >
              <Github size={22} />
            </a>

            <a
              href="https://www.linkedin.com/in/erick-alexander-castillo-chavez-987121426"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-cyan-400 transition-colors"
            >
              <Linkedin size={22} />
            </a>

            erick.castillodesign@example.com
              <Mail size={22} />
            </a>

          </div>
        </div>

        {/* Línea */}
        <div className="my-6 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />

        {/* Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-sm">

          <p className="text-slate-500 text-center md:text-left">
            © {new Date().getFullYear()} Fortress Web Studio. All rights reserved.
          </p>

          <p className="text-slate-600 text-center md:text-right">
            Designed & Developed by Erick Castillo
          </p>

        </div>
      </div>
    </footer>
  );
}
