import { useState, useEffect } from "react";

export type Note = {
  id: string;
  startDate: string; // ISO string YYYY-MM-DD
  endDate: string;   // ISO string YYYY-MM-DD (same as startDate for single day)
  content: string;
  createdAt: string;
};

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const stored = localStorage.getItem("calendar-notes");
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error("Failed to load notes", e);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("calendar-notes", JSON.stringify(notes));
  }, [notes]);

  const addNote = (note: Omit<Note, "id" | "createdAt">) => {
    const newNote: Note = {
      ...note,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setNotes((prev) => [...prev, newNote]);
    return newNote;
  };

  const updateNote = (id: string, content: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, content } : n))
    );
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const getNotesForRange = (start: string, end: string) => {
    return notes.filter(
      (n) =>
        (n.startDate >= start && n.startDate <= end) ||
        (n.endDate >= start && n.endDate <= end) ||
        (n.startDate <= start && n.endDate >= end)
    );
  };

  return {
    notes,
    addNote,
    updateNote,
    deleteNote,
    getNotesForRange,
  };
}
