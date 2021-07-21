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
    console.log(notes);
    console.log(8);
    $("#notes").html(notesTemplate({ note: notes }));
    // window.location.replace('http://localhost:1227/');
};

$(document).ready(function() {

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

        axios.post('/api/info/add', newNote).then((res) => {
                console.log('post in frontend', res.data);
                reloadNotes(res.data);
            })
            .catch(err => console.log(err));
    })

    $('#notes').on('blur', 'textarea', (event) => {

        console.log('to be changed id', $(event.currentTarget).data('id'))
        console.log('to be changed content', $(event.currentTarget).val())

        let noteid = $(event.currentTarget).data('id')

        let changes = $(event.currentTarget).val().replace('content ', '').trim();

        let amend = {};
        amend.content = changes;


        axios.put('http://localhost:1227/api/info/change/' + noteid, amend).then((res) => {
            reloadNotes(res.data);
        }).catch(err => console.log(err));

    })

    $('#notes').on('click', '.remove', (event) => {
        let noteid = $(event.currentTarget).data('id')

        axios.delete('http://localhost:1227/api/info/delete/' + noteid).then((res) => {
            reloadNotes(res.data);
        }).catch(err => console.log(err));
    })

})