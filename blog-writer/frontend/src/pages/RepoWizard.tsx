// Copyright (c) 2024 blog-writer authors
import {useEffect, useState} from 'react';
import {Create, Open, Recent} from '../../wailsjs/go/services/RepoService';

/**
 * RepoWizard presents options to open or create repositories and choose from recent ones.
 */
export default function RepoWizard() {
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
        }
    };

    const createNew = async () => {
        if (newPath) {
            await Create(remote, newPath);
            setRecent(await Recent());
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
                <input placeholder="Path" value={existingPath} onChange={e => setExistingPath(e.target.value)}/>
                <button onClick={openExisting}>Open</button>
            </section>
            <section>
                <h2>Create Repo from Remote</h2>
                <input placeholder="SSH URL" value={remote} onChange={e => setRemote(e.target.value)}/>
                <input placeholder="Path" value={newPath} onChange={e => setNewPath(e.target.value)}/>
                <button onClick={createNew}>Create</button>
            </section>
            <section>
                <h2>Recent Repos</h2>
                <ul>
                    {recent.map(r => (
                        <li key={r}>
                            <button onClick={() => openRecent(r)}>{r}</button>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}

