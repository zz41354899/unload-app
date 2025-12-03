import React from 'react';
import { Mail, Github } from 'lucide-react';

export type FooterProps = {
  onNavigate: (page: string) => void;
};

export const Footer = ({ onNavigate }: FooterProps) => {
  return (
    <footer className="bg-secondary-light/30 text-primary py-20 border-t border-secondary-light/40">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-1">
          <button
            onClick={() => onNavigate('home')}
            className="text-2xl font-light tracking-widest text-primary lowercase hover:opacity-80 transition-opacity"
          >
            unload
          </button>
          <p className="mt-4 text-xs font-light tracking-wide text-primary-light opacity-80 leading-relaxed">
            為高敏族群打造的職場心理緩衝區。
            <br />
            重塑邊界，回歸本我。
          </p>
        </div>

        <div>
          <h4 className="text-primary text-xs font-bold tracking-[0.2em] uppercase mb-6 opacity-60">Explore</h4>
          <ul className="space-y-4 text-sm font-light text-primary-light/80">
            <li>
              <button onClick={() => onNavigate('about')} className="hover:text-primary transition-colors">
                關於我們
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('blog')} className="hover:text-primary transition-colors">
                洞察日誌
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('join')} className="hover:text-primary transition-colors">
                參與計畫
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-primary text-xs font-bold tracking-[0.2em] uppercase mb-6 opacity-60">Support</h4>
          <ul className="space-y-4 text-sm font-light text-primary-light/80">
            <li>
              <button onClick={() => onNavigate('join')} className="hover:text-primary transition-colors">
                申請協助
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('privacy')} className="hover:text-primary transition-colors text-left">
                隱私承諾
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('terms')} className="hover:text-primary transition-colors text-left">
                平台約定
              </button>
            </li>
          </ul>
        </div>

        <div>
          <a
            href="mailto:support@unloadjournal.site"
            className="flex items-center space-x-2 border border-secondary-accent/10 px-4 py-2 rounded-full w-fit mb-8 hover:border-secondary-accent/40 hover:bg-secondary-light transition-colors cursor-pointer group bg-white shadow-sm hover:shadow-md"
          >
            <Mail className="w-4 h-4 text-secondary-accent group-hover:text-primary transition-colors" />
            <span className="text-xs text-primary-light group-hover:text-primary transition-colors">support@unloadjournal.site</span>
          </a>
          <blockquote className="text-sm font-light italic text-primary-light/70 border-l border-secondary-accent/40 pl-4 leading-relaxed">
            "I am not what happened to me, I am what I choose to become."
            <footer className="mt-2 text-xs not-italic uppercase tracking-wider opacity-60">— Carl Jung</footer>
          </blockquote>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-16 pt-8 border-t border-secondary-light/40 flex flex-col md:flex-row justify-between items-center text-[10px] tracking-widest text-primary-light/60 gap-4">
        <p>© {new Date().getFullYear()} UNLOAD. ALL RIGHTS RESERVED.</p>
        <div className="flex items-center gap-4 mt-2 md:mt-0">
          <p>DESIGNED FOR HIGH SENSITIVITY</p>
          <a
            href="https://github.com/zz41354899/unload-app"
            target="_blank"
            rel="noreferrer"
            className="text-primary-light hover:text-primary transition-colors"
            aria-label="前往 Unload GitHub 專案頁面"
          >
            <Github className="w-4 h-4" strokeWidth={1.5} />
          </a>
        </div>
      </div>
    </footer>
  );
};
