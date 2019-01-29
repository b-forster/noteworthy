$(function() {
  let notes = [];
  let tags = new Set();

  const noteTemplate = `
  <div class="note-div" id="{id}">
    <div class="remove-note-div">
      <span class="remove-note-icon">X</span>
    </div>

    <textarea class="note-textbox" rows="7" style="background-color:{color};">
    </textarea>

    <div class="tags-container"></div>
    <form class="add-tag-form">
      <label for="add-tag-input" class="add-tag-label">Add a tag:</label>
      <input type="input" class="add-tag-input" name="add-tag-input" list="tag-options">
      <datalist id="tag-options">{tagOptions}</datalist>
    </form>
  </div>
  `

  addNoteHandler(noteTemplate, notes);
  removeNoteHandler(notes);
  updateTextHandler(notes);
  addTagHandler(tags, notes);
  addSearchFieldHandler(tags);
  filterByTagsHandler(tags, notes);
});

const addNoteHandler = function(noteTemplate, notes){
  $("#color-picker").on("input", function(){
    let color = $(this)[0].value;
    let id = notes.length;

    let note = new noteObj(color, notes.length)
    notes.push(note);

    noteView = noteTemplate.replace('{id}', id)
                           .replace('{color}', color);

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

    notes[noteId].text = $(this)[0].value;
    notes[noteId].updated = Date.now();
  });
}

const addTagHandler = function(tags, notes){
  $("#notes-container").on("change", ".add-tag-input", function(){
    let noteId = $(this).closest(".note-div").attr("id");
    let newTag = $(this)[0].value
    let originalNumOfTags = notes[noteId].tags.size;

    notes[noteId].tags.add(newTag);
    tags.add(newTag);

    // Append tag to note only if it didn't exist before (i.e. size of tags has increased)
    if (notes[noteId].tags.size > originalNumOfTags){
      $(this).closest(".note-div").find(".tags-container").append(`<span class="tag">${newTag}</span>`);
    }

    $(this).closest("form").trigger("reset");
  });
}

const addSearchFieldHandler = function(tags){
  $(".add-field-button").on("click", function(){
    $(this).before(
      `<input type="input" class="filter-input" name="filter-input" list="tag-options">
        <datalist class="tag-options">{tagOptions}</datalist>
      `);
  });
}
  
const filterByTagsHandler = function(tags, notes){
  $("#filter-form").on("submit", function(event){
    event.preventDefault();
    let searchFields = $(this).find(".filter-input")
    let searchType = $(this).closest("#filter-container").find("select")[0].value

    let searchTerms = [];

    [...searchFields].forEach(function(tag){
        searchTerms.push(tag.value);
    });

    let notesToKeep = [];

    if (searchType == "or"){
      notes.forEach(function(note){
          let keepNote = searchTerms.some(function(searchTag){
            return note.tags.has(searchTag);
          })
          if (keepNote){notesToKeep.push(note.id);}
      });
    } else {
      notes.forEach(function(note){
        let keepNote = searchTerms.every(function(searchTag){
          return note.tags.has(searchTag);
        })
        if (keepNote){notesToKeep.push(note.id);}
      });
    }

    notes.forEach(function(note){
      if(!notesToKeep.includes(note.id)){
        let $noteDiv = $(`#${note.id}`)

        $noteDiv.fadeOut(200);
      }
    });

    $(this).trigger("reset");
  });
}


function noteObj(color, id){
  let self          = this;
  self.id           = id
  self.text         = ""
  self.tags         = new Set()
  self.color        = color
  self.updated      = Date.now();                        
}

