import NoteContext from "./NoteContext";
import { useState } from "react";

const NoteState = (props)=>{
    const host ="http://localhost:5000"
    const notesInitial = []
    const [ notes, setNotes ] = useState(notesInitial)
    //GET ALL NOTES
    const getNotes = async()=>{
        //API CALL
        const response = await fetch(`${host}/api/notes/fetchallnotes`, {
            method: 'GET',
            headers: {"Content-Type": "application/json" , "auth-token": localStorage.getItem('auth-token')},
        });
        console.log("Fetching All notes.")
        const json = await response.json(); 
        console.log(json);
        setNotes(json); 
    }
    //ADD NOTE
    const addNote = async (title, description, tag) => {
    const response = await fetch("https://mernback-github.onrender.com/api/notes/addnote", {
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

    setNotes(notes.concat(json));
};

    //DELETE NOTE
    // Frontend call
const response = await fetch(`https://mernback-github.onrender.com/api/notes/delete/${note._id}`, {
    method: 'DELETE',
    headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('auth-token') // If authentication is required
    }
});
const json = await response.json();
if (json.success) {
    // Handle successful deletion
} else {
    // Handle failure
}

    //EDIT NOTE
    const editNote = async(id, title, description, tag) => {
    // API CALL to update the note
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem('auth-token') // Authentication token
        },
        body: JSON.stringify({ title, description, tag }) // Sending the updated data
    });
    
    const json = await response.json();
    console.log(json);  // Log the response for debugging
    
    if (json.success) {
        // If the update is successful, update the frontend state

        // Creating a copy of the notes array
        let newNotes = JSON.parse(JSON.stringify(notes)); 
        
        // Loop through the notes and find the one to update
        for (let index = 0; index < newNotes.length; index++) {
            const element = newNotes[index];
            if (element._id === id) {
                // Update the note in the copied array
                newNotes[index].title = title;
                newNotes[index].description = description;
                newNotes[index].tag = tag;
                break;
            }
        }
        
        // Set the updated notes array into the state
        setNotes(newNotes);
    } else {
        // Handle the failure case if the note wasn't updated
        console.log('Failed to update note');
        props.showAlert("Failed to update note", "danger");
    }
}

export default NoteState;
