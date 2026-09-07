import { Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-cyan-900/20 bg-[#050810]">
      <div className="max-w-[1400px] mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="text-center md:text-left">
          <h3 className="text-white font-semibold">
            Fortress Web Studio
          </h3>

          <p className="text-slate-500 text-sm">
            Web Development • Automation • Digital Solutions
          </p>
        </div>

        <div className="flex items-center gap-5">
          <a
            href="https://github.com/erickccastillo"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-cyan-400 transition-colors"
          >
            <Github size={20} />
          </a>

          <a
            href="https://www.linkedin.com/in/erick-alexander-castillo-chavez-987121426"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-cyan-400 transition-colors"
          >
            <Linkedin size={20} />
          </a>

          erick.castillo@example.com
            <Mail size={20} />
          </a>
        </div>
      </div>

      <div className="border-t border-slate-900">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Fortress Web Studio. All rights reserved.
          </p>

          <p className="text-slate-600 text-sm">
            Designed & Developed by Erick Castillo
          </p>
        </div>
      </div>
    </footer>
  );
}
