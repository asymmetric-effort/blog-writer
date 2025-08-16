// Copyright (c) 2024 blog-writer authors
import { useEffect, useState } from 'react';
import { Create, Open, Recent, type RecentRepo } from '../../wailsjs/go/services/RepoService';
import PathPicker from '../components/PathPicker';
import './RepoWizard.css';

/**
 * RepoWizard presents options to open or create repositories and choose from recent ones.
 */
interface RepoWizardProps {
  /** Callback when a repository has been opened. */
  onOpen: (path: string) => void;
}

export default function RepoWizard({ onOpen }: RepoWizardProps) {
  const [tab, setTab] = useState<'open' | 'create'>('open');
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

  return (
    <div className="repo-wizard">
      <div className="tabs">
        <button
          className={tab === 'open' ? 'active' : 'inactive'}
          onClick={() => setTab('open')}
        >
          Open
        </button>
        <button
          className={tab === 'create' ? 'active' : 'inactive'}
          onClick={() => setTab('create')}
        >
          Create
        </button>
      </div>
      {tab === 'open' && (
        <div className="open-tab">
          <PathPicker onChange={handleExisting} />
          <table>
            <thead>
              <tr>
                <th>Path</th>
                <th>Last Opened</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((r) => (
                <tr key={r.path} onDoubleClick={() => openRecent(r.path)}>
                  <td>{r.path}</td>
                  <td>{new Date(r.lastOpened).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {tab === 'create' && (
        <div className="create-tab">
          <PathPicker onChange={setParentDir} />
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
        </div>
      )}
    </div>
  );
}

