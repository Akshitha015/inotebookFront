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
    const addNote = async(title,description,tag)=>{
        //API CALL
        const response = await fetch(`${host}/api/notes/addnote`, {
            method: 'POST',
            headers: {"Content-Type": "application/json" , "auth-token": localStorage.getItem('auth-token')},
            body: JSON.stringify({title, description, tag})
        });
        // const json = await response.json(); 
        // console.log(json);
        console.log("Adding a New note.")
        const note = await response.json();
        setNotes(notes.concat(note)); //.concat returns the array , .push just updates an array
        //setNotes([...notes, note]); // Update the state immediately
    }
    //DELETE NOTE
    const deleteNote = async(id)=>{
        //API CALL
        const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
            method: 'DELETE',
            headers: {"Content-Type": "application/json" , "auth-token": localStorage.getItem('auth-token')},
        });
        if (!response.ok) {
            const errorMessage = await response.text(); // Get error message
            throw new Error(errorMessage);
        }
        const json = await response.json(); 
        console.log(json);

        console.log("Deleting a note with id: " + id);
        const newNotes = notes.filter((note) => note._id !== id);
        setNotes(newNotes); // Update the state immediately
    }
    //EDIT NOTE
    const editNote = async(id, title, description, tag)=>{
        //API CALL
        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
            method: 'PUT',
            headers: {"Content-Type": "application/json" , "auth-token": localStorage.getItem('auth-token')},
            body: JSON.stringify({title, description, tag}) 
        });
        const json = await response.json();
        console.log(json);
        //Change in frontend 
        let newNotes = JSON.parse(JSON.stringify(notes));
        for (let index = 0; index < newNotes.length; index++) {
            const element = newNotes[index];
            if(element._id === id){
                newNotes[index].title = title;
                newNotes[index].description = description
                newNotes[index].tag = tag;
                break;
            }
        }
        setNotes(newNotes);
    }
    return (
        // <NoteContext.Provider value={{state : state, update: update}}> 
        <NoteContext.Provider value ={{notes, getNotes, addNote, deleteNote, editNote }}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;