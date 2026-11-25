// SPDX-License-Identifier: Apache-2.0
import { Bike, Building2, Landmark, Scale } from 'lucide-react';
import { useEffect, useState } from 'react';

import { env } from './chain';
import { Board } from './screens/Board';
import { Console } from './screens/Console';
import { Rider } from './screens/Rider';

type Route = 'rider' | 'board' | 'console';

const parse = (): { route: Route; query: URLSearchParams } => {
  const [path, q = ''] = window.location.hash.replace(/^#\/?/, '').split('?');
  const route: Route = path === 'board' ? 'board' : path === 'console' ? 'console' : 'rider';
  return { route, query: new URLSearchParams(q) };
};

export const go = (route: Route, query?: Record<string, string>) => {
  window.location.hash = `/${route}${query ? `?${new URLSearchParams(query)}` : ''}`;
};

export function App() {
  const [loc, setLoc] = useState(parse);
  useEffect(() => {
    const on = () => setLoc(parse());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);

  const tabs: { route: Route; label: string; icon: typeof Bike; show: boolean }[] = [
    { route: 'rider', label: 'Check my pay', icon: Bike, show: true },
    { route: 'board', label: 'Public record', icon: Landmark, show: true },
    { route: 'console', label: 'Platform console', icon: Building2, show: Boolean(env.api) },
  ];

  return (
    <div className="shell">
      <header className="topbar">
        <a className="brand" href="#/rider">
          <span className="brand-mark" aria-hidden>
            <Scale size={20} />
          </span>
          <span>
            <span className="brand-name">Kanta</span>
            <br />
            <span className="brand-sub">One pay rule, proven on Midnight · {env.network}</span>
          </span>
        </a>
        <nav className="nav" aria-label="Sections">
          {tabs
            .filter((t) => t.show)
            .map((t) => (
              <a key={t.route} href={`#/${t.route}`} aria-current={loc.route === t.route ? 'page' : undefined}>
                <t.icon size={16} aria-hidden />
                {t.label}
              </a>
            ))}
        </nav>
      </header>
      {loc.route === 'rider' && <Rider initialCode={loc.query.get('r') ?? ''} />}
      {loc.route === 'board' && <Board address={loc.query.get('c') ?? env.contract} />}
      {loc.route === 'console' && <Console />}
    </div>
  );
}
