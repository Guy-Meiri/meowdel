import { type FormEvent, useEffect, useState } from 'react';
import { api, type ModelResult, type User } from './api';

export const App = () => {
  const [user, setUser] = useState<User>();
  const [results, setResults] = useState<ModelResult[]>([]);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    Promise.all([api.me(), api.results()])
      .then(([me, pastResults]) => {
        setUser(me);
        setResults(pastResults);
      })
      .catch(() => setError('Meowdel couldn’t load. Try refreshing.'));
  }, []);

  const generate = async (event: FormEvent) => {
    event.preventDefault();
    setIsGenerating(true);
    setError(undefined);
    try {
      const result = await api.execute(prompt);
      setResults((current) => [result, ...current]);
      setUser((current) => current && { ...current, credits: current.credits - 1 });
      setPrompt('');
    } catch {
      setError('The model couldn’t make that cat. Try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <header>
        <h1>Meowdel</h1>
        {user && (
          <p>
            {user.name} · {user.credits} {user.credits === 1 ? 'credit' : 'credits'}
          </p>
        )}
      </header>
      <main>
        <form onSubmit={generate}>
          <label htmlFor="prompt">Prompt</label>
          <input
            id="prompt"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="a cat in a tiny hat"
            required
          />
          <button disabled={!user || user.credits === 0 || isGenerating}>Generate</button>
        </form>
        {error && <p role="alert">{error}</p>}
        <ul aria-label="Your cats">
          {results.map((result) => (
            <li key={result.id}>
              <img src={result.imageUrl} alt={result.prompt} />
              <p>{result.prompt}</p>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
};
