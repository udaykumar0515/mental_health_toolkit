import React, { useState } from 'react';
import { JournalEntry, Page } from '../types';
import { BookOpen, ArrowLeft } from 'lucide-react';

interface JournalProps {
  entries: JournalEntry[];
  onSave: (entry: { id?: string; content: string }) => void;
  onNavigate: (page: Page) => void;
}

const Journal: React.FC<JournalProps> = ({ entries, onSave, onNavigate }) => {
  const [currentContent, setCurrentContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSave = () => {
    if (!currentContent.trim()) return;
    onSave({ id: editingId ?? undefined, content: currentContent });
    setCurrentContent('');
    setEditingId(null);
  };

  const handleSelectEntry = (entry: JournalEntry) => {
    setEditingId(entry.id);
    setCurrentContent(entry.content);
  };

  const handleNewEntry = () => {
    setEditingId(null);
    setCurrentContent('');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={() => onNavigate('dashboard')} className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-semibold mb-4 transition-colors">
        <ArrowLeft size={20} />
        Back to Dashboard
      </button>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar for entries */}
        <div className="md:col-span-1 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-4">Your Entries</h3>
          <button
            onClick={handleNewEntry}
            className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-600 transition mb-4"
          >
            + New Entry
          </button>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {entries.map(entry => (
              <div
                key={entry.id}
                onClick={() => handleSelectEntry(entry)}
                className={`p-3 rounded-lg cursor-pointer transition ${editingId === entry.id ? 'bg-blue-100 dark:bg-blue-900/50' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
              >
                <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
                  {new Date(entry.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm truncate">
                  {entry.content}
                </p>
              </div>
            ))}
            {entries.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 text-sm py-4">No entries yet. Start writing!</p>
            )}
          </div>
        </div>

        {/* Main editor */}
        <div className="md:col-span-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4 text-gray-800 dark:text-white">
            <BookOpen size={32} />
            <h2 className="text-3xl font-bold">
              {editingId ? 'Edit Your Entry' : 'What\'s on your mind?'}
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Journaling can help you understand your thoughts and feelings more clearly.
          </p>
          <textarea
            value={currentContent}
            onChange={(e) => setCurrentContent(e.target.value)}
            placeholder="Start writing here..."
            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg h-64 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          />
          <div className="mt-6 text-right">
            <button
              onClick={handleSave}
              className="bg-green-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-green-600 transition-all disabled:bg-gray-400 dark:disabled:bg-gray-600"
              disabled={!currentContent.trim()}
            >
              {editingId ? 'Update Entry' : 'Save Entry'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Journal;