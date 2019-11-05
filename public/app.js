
console.log(`im working`);



$("#scrapeBtn").on("click", (event) => {
    event.preventDefault();
    $.ajax({
        method: "get",
        url: "/api/scrape"
    }).then(response => {
        console.log(response)
        location.reload()
    });

});

$("ul").on("click", ".notesBtn", (event => {
    const id = event.target.dataset.articleid
    location.href = `/notes/${id}`
}));

$("#noteSubmitBtn").on("click", event => {
    event.preventDefault()
    const articleId = event.target.dataset.articleid
    const newNote = $("#notePad").val().trim()
    if (newNote === "") {
        alert("Make sure your note has content!")
        return
    }
    fetch("/api/notes", {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            articleId: articleId,
            note: newNote
        })
    }).then(response=>response.json()).then(data=>{
        $("#notePad").val("")
        location.reload()
    })
})

$("ul").on("click","#deleteNoteBtn",event=>{
    event.preventDefault()
    const id = event.target.dataset.noteid
    fetch("/api/delete",{
        method: "delete",
        headers: {
            "Content-Type": "application/json"
        },
       body:  JSON.stringify({
            id: id
       })
        
    }).then(location.reload())
    console.log(event.target)
    console.log(id)
})