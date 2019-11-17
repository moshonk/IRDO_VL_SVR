const DEFAULT_VALIDATION_MESASGE_TITLE = 'The following error has been encountered...';

$().ready(function () {
    let validate = [];
    let $table = $('table#vl-results')

    var searchVlResults = (mflcode, cccnumber) => {
        let uri = `http://localhost:50001/vlOnline?mflcode=${mflcode}&cccNumber=${cccnumber}`;
        $.ajax({
            url: uri,
            type: "GET",
            dataType: "json",
            success: (result) => {
                resetDataTable();
                if (result.status == 'ok') {
                    var data = JSON.parse(result.data);
                    if (data.error != undefined && data.error != null) {
                        validate.push(data.error.message);                                  
                    }  
                    else {
                        displaySearchResults(data);
                    }                      
                } else {
                    validate.push(result.data);                    
                }
                showValidationMessage(DEFAULT_VALIDATION_MESASGE_TITLE);
            },
            error: function (result) {
                validate.push(result.data);
                showValidationMessage(DEFAULT_VALIDATION_MESASGE_TITLE);
            },
        });
    }

    var showValidationMessage = (title) => {
        $('#message').hide();
        if (validate.length > 0) {
            $('#message .alert').html(`${title} </br>`);
            $.each(validate, (k, v) => {
                $('#message .alert').append(`${v} </br>`);
            });
            $('#message').show();        
        }
    }

    var resetDataTable = () => {
        $table.DataTable().clear().draw().destroy(); // Clear existing rows from the table before destroying the DataTable object 
    }

    var displaySearchResults = (results) => {
        resetDataTable();
        $.each(results,(k, v)=>{
            let tr = $('<tr/>') 
            tr.append($('<td/>').append(v.PatientID));
            tr.append($('<td/>').append(v.Facility));
            tr.append($('<td/>').append(v.Age));
            tr.append($('<td/>').append(v.Gender));
            tr.append($('<td/>').append(v.Justification));
            tr.append($('<td/>').append(v.Regimen));
            tr.append($('<td/>').append(v.DateCollected));
            tr.append($('<td/>').append(v.Result));
            $table.append($('<tbody/>')).append(tr);
        })
        $table.DataTable();
    }

    $('#search').click(() => {
        let mflcode = $('#facility').val();
        let cccnumber = $('#ccc-number').val();

        validate = [];

        if (mflcode == '' || mflcode == null) {
            validate.push('Missing MFL Code');
        }

        if (cccnumber == '') {
            validate.push('Missing CCC Number');
        }

        if (validate.length > 0) {
            showValidationMessage("Correct the following errors...");
        } else {
            searchVlResults(mflcode, cccnumber);
        }

    });

    showValidationMessage('');

    $table.DataTable();
    
});

$(document).ajaxSend(function(){
    $('#spinner').fadeIn(250);
});
$(document).ajaxComplete(function(){
    $('#spinner').fadeOut(250);
});