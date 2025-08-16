// Copyright (c) 2024 blog-writer authors
import {useEffect, useState} from 'react';
import {Create, Open, Recent} from '../../wailsjs/go/services/RepoService';
import PathPicker from '../components/PathPicker';

/**
 * RepoWizard presents options to open or create repositories and choose from recent ones.
 */
interface RepoWizardProps {
    /** Callback when a repository has been opened. */
    onOpen: (path: string) => void;
}

export default function RepoWizard({ onOpen }: RepoWizardProps) {
    const [existingPath, setExistingPath] = useState('');
    const [newPath, setNewPath] = useState('');
    const [remote, setRemote] = useState('');
    const [recent, setRecent] = useState<string[]>([]);

    useEffect(() => {
        Recent().then(setRecent);
    }, []);

    const openExisting = async () => {
        if (existingPath) {
            await Open(existingPath);
            onOpen(existingPath);
        }
    };

    const createNew = async () => {
        if (newPath) {
            await Create(remote, newPath);
            setRecent(await Recent());
            onOpen(newPath);
        }
    };

    const openRecent = async (p: string) => {
        await Open(p);
    };

    return (
        <div>
            <h1>Blog Repo Wizard</h1>
            <section>
                <h2>Open Existing Repo</h2>
                <PathPicker onChange={setExistingPath} />
                <button onClick={openExisting}>Open</button>
            </section>
            <section>
                <h2>Create Repo from Remote</h2>
                <input placeholder="SSH URL" value={remote} onChange={e => setRemote(e.target.value)}/>
                <PathPicker onChange={setNewPath} />
                <button onClick={createNew}>Create</button>
            </section>
            <section>
                <h2>Recent Repos</h2>
                <select onChange={e => openRecent(e.target.value)} value="">
                    <option value="" disabled>Select...</option>
                    {recent.map(r => (
                        <option key={r} value={r}>{r}</option>
                    ))}
                </select>
            </section>
        </div>
    );
}

