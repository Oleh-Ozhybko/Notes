async function GetNotes() {
    const response = await fetch("api/notes", {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    if (response.ok === true) {
        const notes = await response.json();
        let rows = document.querySelector("tbody");
        notes.forEach(note => {
            rows.append(row(note));
        });
    }
}
async function GetNote(id) {
    const response = await fetch("api/notes/" + id, {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    if (response === true) {
        const note = await response.json();
        const form = document.forms["noteForm"];
        form.elements["id"].value = note.id;
        form.elements["title"].value = note.title;
        form.elements["description"].value = note.description;
    }
}
async function CreateNote(noteTitle, noteDescription) {
    const response = await fetch("api/notes", {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            title: noteTitle,
            description: noteDescription
        })
    });
    if (response.ok === true) {
        const note = await response.json();
        reset();
        document.querySelector("tbody").append(row(note));
    }
}
async function EditNote(noteId, noteTitle, noteDescription) {
    const response = await fetch("api/notes", {
        method: "PUT",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            id: parseInt(noteId, 10),
            title: noteTitle,
            description: noteDescription
        })
    });
    if (response.ok === true) {
        const note = await response.json();
        reset();
        document.querySelector("tr[data-rowid='" + note.id + "']").replaceWith(row(note));
    }
}
async function DeleteNote(id) {
    const response = await fetch("api/notes/" + id, {
        method: "DELETE",
        headers: { "Accept": "application/json" }
    });
    if (response.ok === true) {
        const note = await response.json();
        document.querySelector("tr[data-rowid='" + note.id + "']").remove();
    }
}
function reset() {
    const form = document.forms["noteForm"];
    form.reset();
    form.elements["id"].value = 0;
}
function row(note) {
    const tr = document.createElement("tr");
    tr.setAttribute("data-rowid", note.id);

    const idTd = document.createElement("td");
    idTd.append(note.id);
    tr.append(idTd);

    const titleTd = document.createElement("td");
    titleTd.append(note.title);
    tr.append(titleTd);

    const descriptionTd = document.createElement("td");
    descriptionTd.append(note.description);
    tr.append(descriptionTd);

    const linksTd = document.createElement("td");

    const editLink = document.createElement("a");
    editLink.setAttribute("data-id", note.id);
    editLink.setAttribute("style", "cursor:pointer;padding:15px;");
    editLink.append("Edit");
    editLink.addEventListener("click", e => {
        e.preventDefault();
        GetNote(note.id);
    });
    linksTd.append(editLink);

    const removeLink = document.createElement("a");
    removeLink.setAttribute("data-id", note.id);
    removeLink.setAttribute("style", "cursor:pointer;padding:15px;");
    removeLink.append("Delete");
    removeLink.addEventListener("click", e => {
        e.preventDefault();
        DeleteNote(note.id);
    });

    linksTd.append(removeLink);
    tr.appendChild(linksTd);

    return tr;
}
document.getElementById("reset").click(function (e) {
    e.preventDefault();
    reset();
})
document.forms["noteForm"].addEventListener("submit", e => {
    e.preventDefault();
    const form = document.forms["noteForm"];
    const id = form.elements["id"].value;
    const title = form.elements["title"].value;
    const description = form.elements["description"].value;
    if (id == 0) {
        CreateNote(title, description);
    }
    else {
        EditNote(id, title, description);
    }
});
GetNotes();