var notesTemplate = Handlebars.compile(

    `
      {{#each note}}
      <div class="note">
          <textarea data-id="{{ index }}"> {{ content }}</textarea>
          <button class="remove btn btn-xs" data-id="{{ index }}"><i class="fas fa-trash-alt" aria-hidden="true"></i></button>
          </div>
          {{/each}}
      `

);

const reloadNotes = (notes) => {
    console.log("RELOADING");
    $("#notes").html(notesTemplate({ note: notes }));
};


$(document).ready(function() {

    // adding new note
    $('#note-taking').submit((event) => {
        event.preventDefault();
        let add = document.getElementById("taking-note").value;
        let newNote = {}
        if (add == '') {
            return;
        }
        $('#note-taking')[0].reset();
        newNote.add = add;
        console.log(newNote, 'post newNote')

        axios.post('/user/add', newNote)
            .then((res) => {
                console.log('post in frontend', res.data);
                reloadNotes(res.data);
            })
            .catch(err => console.log(err));
    })

    // changing note content
    $('#notes').on('blur', 'textarea', (event) => {

        let noteid = $(event.currentTarget).data('id')

        let changes = $(event.currentTarget).val().replace('content ', '').trim();

        let amend = {};
        amend.content = changes;

        axios.put('/user/change/' + noteid, amend).then((res) => {
            reloadNotes(res.data);
        }).catch(err => console.log(err));
    })

    //delete note
    $('#notes').on('click', '.remove', (event) => {
        let noteid = $(event.currentTarget).data('id')

        axios.delete('/user/delete/' + noteid).then((res) => {
            reloadNotes(res.data);
        }).catch(err => console.log(err));
    })

})