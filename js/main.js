$(function() {
  const noteTemplate = `
  <div class="note-div" id="{id}">
    <div class="remove-note-div">
      <span class="remove-note-icon">X</span>
    </div>

    <textarea class="note-textbox" rows="7" style="background-color:{color};">
    </textarea>

    <div class="tags-container">
    </div>
  </div>
  `
  let notes = [];

  addNoteHandler(noteTemplate, notes.length);
  removeNoteHandler(notes);
});

const getNoteTemplate = function(url){
  return $.get(url);
}

const addNoteHandler = function(noteTemplate, id){
  $("#color-picker").on("input", function(){
    let color = $(this)[0].value;

    let note = new noteObj(color, id)
    noteView = noteTemplate.replace('{id}', id).replace('{color}', color)

    console.log(noteView)

    $("#notes-container").append(noteView);
  })
}


const removeNoteHandler = function(notes){
  $("#notes-container").on("click", ".remove-note-div", function(){
    let $note = $(this).closest(".note-div")
    $note.fadeOut(200);

    // delete note from notes list
  });
}

function noteObj(color, id){
  let self          = this;
  self.id           = id
  self.text         = ""
  self.tags         = []
  self.color        = color
  self.updated      = Date.now()                        
}