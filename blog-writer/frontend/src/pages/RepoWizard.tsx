// Copyright (c) 2024 blog-writer authors
import { useEffect, useState } from 'react';
import { Create, Open, Recent } from '../../wailsjs/go/services/RepoService';
import PathPicker from '../components/PathPicker';
import './RepoWizard.css';

interface RecentRepo {
  path: string;
  lastOpened: string;
}

/**
 * RepoWizard presents options to open or create repositories and choose from recent ones.
 */
interface RepoWizardProps {
  /** Callback when a repository has been opened. */
  onOpen: (path: string) => void;
}

/**
 * Render table cell text, using a non-breaking space to maintain row height
 * when the value is blank.
 *
 * @param value - Text content for a table cell.
 * @returns The provided value or a non-breaking space if empty.
 */
function cellText(value: string): string {
  return value || '\u00A0';
}

export default function RepoWizard({ onOpen }: RepoWizardProps) {
  const [tab, setTab] = useState<'open' | 'create'>('open');
  const [hover, setHover] = useState<'open' | 'create' | null>(null);
  const [recent, setRecent] = useState<RecentRepo[]>([]);
  const [parentDir, setParentDir] = useState('');
  const [repoName, setRepoName] = useState('');
  const [remote, setRemote] = useState('');

  useEffect(() => {
    Recent().then(setRecent);
  }, []);

  const handleExisting = async (p: string) => {
    try {
      await Open(p);
      onOpen(p);
    } catch (err) {
      if (String(err).includes('not a git repository')) {
        if (window.confirm('Initialize directory as blog content repository?')) {
          await Create('', p);
          onOpen(p);
        }
      } else {
        window.alert('Failed to open repository');
      }
    }
  };

  const handleCreate = async () => {
    if (parentDir && repoName) {
      const full = `${parentDir}/${repoName}`;
      await Create(remote, full);
      setRecent(await Recent());
      onOpen(full);
    }
  };

  const openRecent = async (p: string) => {
    try {
      await Open(p);
      onOpen(p);
    } catch {
      window.alert('Failed to open repository');
    }
  };

  const tabStyle: React.CSSProperties = {
    flex: 1,
    padding: '0.5rem',
    border: 'none',
    borderTopLeftRadius: '5px',
    borderTopRightRadius: '5px',
    cursor: 'pointer',
    margin: 0,
  };
  const rows: RecentRepo[] = [...recent];
  while (rows.length < 5) rows.push({ path: '', lastOpened: '' } as RecentRepo);

  return (
    <div className="repo-wizard" data-testid="repo-wizard" style={{ width: '400px', height: '300px' }}>
      <div className="tabs" style={{ display: 'flex', width: '100%' }}>
        <button
          style={{ ...tabStyle, borderBottom: tab === 'open' ? 'none' : '1px solid black' }}
          className={`${tab === 'open' ? 'active' : 'inactive'} ${hover === 'open' ? 'hovered' : ''}`}
          onClick={() => setTab('open')}
          onMouseEnter={() => setHover('open')}
          onMouseLeave={() => setHover(null)}
        >
          Open
        </button>
        <button
          style={{ ...tabStyle, borderBottom: tab === 'create' ? 'none' : '1px solid black' }}
          className={`${tab === 'create' ? 'active' : 'inactive'} ${hover === 'create' ? 'hovered' : ''}`}
          onClick={() => setTab('create')}
          onMouseEnter={() => setHover('create')}
          onMouseLeave={() => setHover(null)}
        >
          Create
        </button>
      </div>
      {tab === 'open' && (
        <div className="open-tab" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <PathPicker
            onChange={handleExisting}
            data-testid="path-picker"
            style={{ height: '25px', marginTop: '20px' }}
          />
          <table>
            <thead>
              <tr>
                <th>Path</th>
                <th>Last Opened</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr
                  key={i}
                  data-testid="recent-row"
                  onDoubleClick={r.path ? () => openRecent(r.path) : undefined}
                >
                  <td>{cellText(r.path)}</td>
                  <td>
                    {cellText(
                      r.lastOpened ? new Date(r.lastOpened).toLocaleString() : ''
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="hint" style={{ marginTop: 'auto' }}>
            Select or create a repository to begin.
          </p>
        </div>
      )}
      {tab === 'create' && (
        <div className="create-tab" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <PathPicker
            onChange={setParentDir}
            data-testid="path-picker"
            style={{ height: '25px', marginTop: '20px' }}
          />
          <input
            placeholder="Repository Name"
            value={repoName}
            onChange={(e) => setRepoName(e.target.value)}
          />
          <input
            placeholder="SSH URL (optional)"
            value={remote}
            onChange={(e) => setRemote(e.target.value)}
          />
          <button onClick={handleCreate}>Create</button>
          <p className="hint" style={{ marginTop: 'auto' }}>
            Choose a parent folder and repository name.
          </p>
        </div>
      )}
    </div>
  );
}

