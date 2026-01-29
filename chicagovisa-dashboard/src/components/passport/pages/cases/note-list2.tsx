import React from "react";
import NoteBox2 from "./note-card2";

const NotesList2: React.FC<{
  notes: {
    createdAt: string;
    host: string;
    autoNote: string;
    manualNote: string;
  }[];
}> = ({ notes }) => {
  return (
    <div>
      {notes
        // ?.filter(({ autoNote, manualNote }) => autoNote || manualNote)
        ?.map((note, index) => (
          <React.Fragment key={index}>
            {note?.autoNote ? (
              <NoteBox2
                content={{
                  note: note.autoNote,
                  createdAt: note.createdAt,
                  host: note.host,
                  isAutoNote: true,
                }}
              />
            ) : note.manualNote ? (
              <NoteBox2
                content={{
                  note: note.manualNote,
                  createdAt: note.createdAt,
                  host: note.host,
                  isAutoNote: false,
                }}
              />
            ) : (
              <></>
            )}
          </React.Fragment>
        ))}
    </div>
  );
};

export default NotesList2;
