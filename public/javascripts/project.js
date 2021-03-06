const DEFAULT_VALIDATION_MESASGE_TITLE = 'The following error has been encountered...';

$().ready(function () {
    let validate = [];
    let $table = $('table#vl-results')

    var searchVlResults = (mflcode, cccnumber) => {
        let uri = `/vlOnline?mflcode=${mflcode}&cccNumber=${cccnumber}`;
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

    $('#facility').select2({
        ajax: {
            url: '/facility',
            type: 'GET',
            dataType: 'json',
            delay: 1000,
            data: (params) => {
                return { searchTerm: params.term }
            },
            processResults: function (response) {
                var facilities = response.map((f) => {
                    return {id: f.facilityMFLCode,
                            name: f.facilityMFLCode,
                            text: `${f.facility} (${f.facilityMFLCode})`}
                });
                return {
                    results: facilities
                }
                
            },
           cache: true
        },
        minimumInputLength: 3
    })

    /*
    $('#facility1').select2({
        theme: 'bootstrap4',
        width: 'style',
        query: function (data) {
            var pageSize,
                    dataset,
                    that = this;
            pageSize = 20; // Number of the option loads at a time
            results = [];
            if (data.term && data.term !== '') {
                // HEADS UP; for the _.filter function I use underscore (actually lo-dash) here
                results = _.filter(that.data, function (e) {
                    return e.text.toUpperCase().indexOf(data.term.toUpperCase()) >= 0;
                });
            } else if (data.term === '') {
                results = that.data;
            }
            data.callback({
                results: results.slice((data.page - 1) * pageSize, data.page * pageSize),
                more: results.length >= data.page * pageSize,
            });
        },
        placeholder: $(this).attr('placeholder'),
        allowClear: Boolean($(this).data('allow-clear')),
    });
    */

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

    // populateFacilities();

    $table.DataTable();
    
});

$(document).ajaxSend(function(){
    $('#spinner').fadeIn(250);
});
$(document).ajaxComplete(function(){
    $('#spinner').fadeOut(250);
});