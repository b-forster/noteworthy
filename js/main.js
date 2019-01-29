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

  addNoteHandler(noteTemplate, notes);
  removeNoteHandler(notes);
  updateTextHandler(notes);
});

const addNoteHandler = function(noteTemplate, notes){
  $("#color-picker").on("input", function(){
    let color = $(this)[0].value;
    let id = notes.length;

    let note = new noteObj(color, notes.length)
    notes.push(note)

    noteView = noteTemplate.replace('{id}', id).replace('{color}', color)
    $("#notes-container").append(noteView);
  })
}


const removeNoteHandler = function(notes){
  $("#notes-container").on("click", ".remove-note-div", function(){
    let $noteDiv = $(this).closest(".note-div")
    let noteId = $noteDiv.attr("id")

    $noteDiv.fadeOut(200);

    delete notes[noteId]
  });
}

const updateTextHandler = function(notes){
  $("#notes-container").on("change", ".note-textbox", function(){
    let noteId = $(this).closest(".note-div").attr("id")

    notes[noteId].text = $(this)[0].value
    notes[noteId].updated = Date.now()
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

