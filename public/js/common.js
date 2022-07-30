function loadComboBox(data, dropdown, displayValue, displayText, optionTextAlongWithDisplayText) {
    $('#' + dropdown).empty();
    //$('#' + dropdown).append($('<option></option>').val('').html('---- Select ----'));

    let selectHeader = '';

    switch(dropdown) {
        case 'cmbHosp':
            selectHeader = 'Select Hospital';
        break;
        case 'cmbRegion':
            selectHeader = 'Select State';
        break;
        case 'cmbBrandList':
            selectHeader = 'Select Brand';
        break;
        case 'cmbKam':
            selectHeader = 'Select Kam';
        break;
        default:
            selectHeader = '----Select----';
            break;
    }

    $('#' + dropdown).append($('<option></option>').val('').html(`${selectHeader}`));
    $.each(data, function (index, item) {
        let text = (item[displayText]) ? item[displayText] : '',
            optinalText = ((optionTextAlongWithDisplayText) ? item[optionTextAlongWithDisplayText] : ''),
            textPlusOptionl = text + ((optinalText.length > 0) ? ' - ' + optinalText : '');
        // console.log('-------------------------------------------')
        // console.log(text)
        // console.log(optinalText)
        // console.log()
        // console.log('-------------------------------------------')
        $('#' + dropdown).append(
            $('<option></option>').val(item[displayValue]).html(camelCaseText(textPlusOptionl))
        );
    });
}



function camelCaseText(str) {
    if (str) {
        let arr = str.split(" ");
        for (var i = 0; i < arr.length; i++) {
            arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1).toLowerCase();

        }
        return arr.join(" ");
    }
}


function loadMonthYear() {
    const date = new Date();
    let dt = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    $('#cmbMonth').val(dt.getMonth() + 1); // our combo box starts with 1
    $('#cmbYear').val(dt.getFullYear());
}
