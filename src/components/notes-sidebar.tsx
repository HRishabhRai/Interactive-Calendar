import { useState } from "react";
import { format, isSameDay } from "date-fns";
import { Trash2, Plus, X, Calendar as CalendarIcon, AlignLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Note, useNotes } from "@/hooks/use-notes";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NotesSidebarProps {
  selectionStart: Date | null;
  selectionEnd: Date | null;
  onClearSelection: () => void;
}

export function NotesSidebar({ selectionStart, selectionEnd, onClearSelection }: NotesSidebarProps) {
  const { notes, addNote, deleteNote, getNotesForRange } = useNotes();
  const [isAdding, setIsAdding] = useState(false);
  const [newContent, setNewContent] = useState("");

  const hasSelection = selectionStart !== null;
  
  // Get start/end safely
  const effectiveStart = selectionStart;
  const effectiveEnd = selectionEnd || selectionStart;
  
  const relevantNotes = hasSelection && effectiveStart && effectiveEnd
    ? getNotesForRange(format(effectiveStart, "yyyy-MM-dd"), format(effectiveEnd, "yyyy-MM-dd"))
    : notes.slice().sort((a, b) => b.startDate.localeCompare(a.startDate)); // all notes sorted descending

  const handleAdd = () => {
    if (!newContent.trim() || !effectiveStart || !effectiveEnd) return;
    
    addNote({
      startDate: format(effectiveStart, "yyyy-MM-dd"),
      endDate: format(effectiveEnd, "yyyy-MM-dd"),
      content: newContent.trim(),
    });
    setNewContent("");
    setIsAdding(false);
  };

  const formatDateRange = (start: string, end: string) => {
    if (start === end) return format(new Date(start), "MMM d, yyyy");
    return `${format(new Date(start), "MMM d")} - ${format(new Date(end), "MMM d, yyyy")}`;
  };

  return (
    <div className="w-full h-full flex flex-col bg-sidebar/50 backdrop-blur-sm border-l border-sidebar-border relative">
      <div className="p-6 border-b border-sidebar-border">
        <h3 className="text-2xl font-serif text-sidebar-foreground">Notes & Events</h3>
        
        {hasSelection ? (
          <div className="mt-4 p-4 bg-background rounded-lg border border-border shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Selected Range</p>
                <p className="text-lg font-serif mt-1">
                  {effectiveStart && effectiveEnd ? formatDateRange(format(effectiveStart, "yyyy-MM-dd"), format(effectiveEnd, "yyyy-MM-dd")) : ""}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClearSelection} className="h-8 w-8 text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {!isAdding ? (
              <Button 
                className="w-full mt-4 font-serif italic text-base" 
                onClick={() => setIsAdding(true)}
                data-testid="button-start-add-note"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Entry
              </Button>
            ) : (
              <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-2">
                <Textarea 
                  autoFocus
                  placeholder="Jot down a note or event..." 
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="min-h-[100px] resize-none font-serif text-base bg-transparent"
                  data-testid="input-note-content"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAdd} disabled={!newContent.trim()} data-testid="button-save-note">Save</Button>
                  <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-4 p-4 border border-dashed border-border rounded-lg text-center opacity-70">
            <CalendarIcon className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm font-medium text-muted-foreground">Select a date or range to add notes</p>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1 p-6">
        <div className="space-y-6">
          {relevantNotes.length === 0 ? (
            <div className="text-center text-muted-foreground/50 py-12 flex flex-col items-center">
              <AlignLeft className="h-8 w-8 mb-3 opacity-20" />
              <p className="font-serif italic">No notes found for this selection.</p>
            </div>
          ) : (
            relevantNotes.map((note) => (
              <div key={note.id} className="group relative bg-background p-5 rounded-lg border border-border shadow-sm" data-testid={`note-${note.id}`}>
                <div className="text-xs font-medium text-primary/70 mb-2 uppercase tracking-wider">
                  {formatDateRange(note.startDate, note.endDate)}
                </div>
                <p className="font-serif text-base leading-relaxed whitespace-pre-wrap text-foreground">
                  {note.content}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteNote(note.id)}
                  className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  data-testid={`button-delete-note-${note.id}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
