import NoteContext from "./NoteContext";
import { useState } from "react";

const NoteState = (props) => {
    const host = "https://mernback-github.onrender.com"; // Updated backend URL
    const notesInitial = [];
    const [notes, setNotes] = useState(notesInitial);

    // GET ALL NOTES
    const getNotes = async () => {
        try {
            const response = await fetch(`${host}/api/notes/fetchallnotes`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem('auth-token')
                },
            });
            const json = await response.json();
            console.log("Fetching all notes", json);
            setNotes(json);
        } catch (error) {
            console.error("Error fetching notes:", error);
            props.showAlert("Error fetching notes", "danger");
        }
    };

    // ADD NOTE
    const addNote = async (title, description, tag) => {
        try {
            const response = await fetch(`${host}/api/notes/addnote`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem("auth-token"),
                },
                body: JSON.stringify({ title, description, tag }),
            });

            const json = await response.json();
            if (!response.ok) {
                throw new Error(json.error || "Failed to add note");
            }

            setNotes([...notes, json]);  // Add the new note to the current notes state
            props.showAlert("Note added successfully", "success");
        } catch (error) {
            console.error("Error adding note:", error);
            props.showAlert("Error adding note", "danger");
        }
    };

    // DELETE NOTE
    const deleteNote = async (id) => {
        try {
            const response = await fetch(`${host}/api/notes/delete/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem("auth-token"),
                },
            });

            const json = await response.json();
            if (json.success) {
                // Filter out the deleted note from the state
                setNotes(notes.filter((note) => note._id !== id));
                props.showAlert("Note deleted successfully", "success");
            } else {
                props.showAlert("Failed to delete note", "danger");
            }
        } catch (error) {
            console.error("Error deleting note:", error);
            props.showAlert("Error deleting note", "danger");
        }
    };

    // EDIT NOTE
    const editNote = async (id, title, description, tag) => {
        try {
            const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem('auth-token'),
                },
                body: JSON.stringify({ title, description, tag }),
            });

            const json = await response.json();
            if (json.success) {
                // Update the note in the state after successful update
                const updatedNotes = notes.map((note) =>
                    note._id === id ? { ...note, title, description, tag } : note
                );
                setNotes(updatedNotes);
                props.showAlert("Note updated successfully", "success");
            } else {
                props.showAlert("Failed to update note", "danger");
            }
        } catch (error) {
            console.error("Error updating note:", error);
            props.showAlert("Error updating note", "danger");
        }
    };

    return (
        <NoteContext.Provider value={{ notes, getNotes, addNote, deleteNote, editNote }}>
            {props.children}
        </NoteContext.Provider>
    );
};

export default NoteState;
