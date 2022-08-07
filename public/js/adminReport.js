function setupAdminReport() {
    let userData = JSON.parse(localStorage.getItem("userData")),
        divRBM = $('#divRBM');
        //divZBM = $('#divRBM')
       // divAdmin = $('#divadmin');

    if(!userData) {
        alert('You are not login, kindly login')
        document.location.href = '/index'
    }

    divRBM.show()
   // divZBM.hide()
   // divAdmin.hide()
    
    switch (userData.post) {
        case 'RBM':
            divRBM.show()
            break;
    }

}

function reset() {
    $('#cmbYear').prop('selectedIndex',0);
    $('#cmbHosp').prop('selectedIndex',0);
    $('#cmbBrandList').prop('selectedIndex',0);
    $('#cmbKam').prop('selectedIndex',0);
}


function setUpPage() {
    setupAdminReport();
    let monthArr = [3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2],
        month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        userData = JSON.parse(localStorage.getItem("userData"));
    monthArr.forEach(i => {
        $('#adminReport1 tr').append(`<th>${month[i]}</th>`)
    })
    setupTopNav();
   
    getReportFilters();
    getAdminReport()
    
    $('#divzone').hide();
    $('#divZbm').hide();
    $('#divFormRbm').hide();

    if (userData.post  === 'ZBM')  {
        $('#cmbRBM').show();
        $('#divFormRbm').show();
    } else if (userData.post  === 'RBM')  {
      
        // hide both the combobox
    } else {
        $('#divzone').show();
        $('#divZbm').show();
        $('#divFormRbm').show();
    }

}
function getReportFilters() {
    let params = {
        method: 'getAdminReportFilters'
    };
    //console.log({ ...params })
    axios
        .get("/admin/api", {
            params: params
        })
        .then((response) => {
            let hospitalList = response.data[0],
                stateList = response.data[1],
                brandList = response.data[2],
                kamList = response.data[3],
                empList = response.data[4]
                zoneList = response.data[5]
                showHtml = [],
                mon = $('#cmbMonth').val(),
                year = $('#cmbYear').val()
                rbmList = empList.filter(emp => {
                    return emp.Designation === 'RBM'
                }),
                zbmList = empList.filter(emp => {
                    return emp.Designation === 'ZBM'
                })
                ;


            //console.log(zoneList);

            // LIST HOSPITALS
            loadComboBox(hospitalList, 'cmbHosp', 'hospitalId', 'hospitalName', 'regionName');
            // LIST STATE
            loadComboBox(stateList, 'cmbRegion', 'stateID', 'StateName');
            //LIST BRANDS
            loadComboBox(brandList, 'cmbBrandList', 'medId', 'medicineName');
            //LIST KAMS
            loadComboBox(kamList, 'cmbKam', 'EmpID', 'firstName', 'Designation');
             //LIST rbm
             loadComboBox(rbmList, 'cmbRBM', 'EmpID', 'firstName', 'Designation');
              //LIST zbm
            loadComboBox(zbmList, 'cmbZBM', 'EmpID', 'firstName', 'designZone');
             //LIST zone
             loadComboBox(zoneList, 'cmbZone', 'zoneID', 'name');
        });

}

function getAdminReport() {
    let urlParams = new URLSearchParams(window.location.search),
        financialYear = $('#cmbYear').val(),
        year = financialYear.split('-')[0],
        secondYear = financialYear.split('-')[1],
        userData = JSON.parse(localStorage.getItem("userData"))
        ;

    $('.loader-wrapper').removeClass('none');
    let param = {
        parentId: 1,
        method: 'getAdminReport',
        year: year,
        secondYear: secondYear,
        empId: (userData.post === _ADMINROLE) ? 999 : userData.empId,
        hospitalId: parseInt($('#cmbHosp').val()),
        medId: parseInt($('#cmbBrandList').val()),
        kamId: parseInt($('#cmbKam').val()),
        rbmId: parseInt($('#cmbRBM').val()),
        zbmId: parseInt($('#cmbZBM').val()),
        zoneId: parseInt($('#cmbZone').val())
    };

    axios
        .post("/admin/api", param)
        .then((response) => {
            //console.log(response.data);
            let list = response.data,
                showHtml = [],
                mon = $('#cmbMonth').val(),
                year = $('#cmbYear').val();

            //<td>${camelCaseText(currVal.hospitalName)}</td>
            // <td style='background-color:${ (parseInt(item.Apr) > 0 && parseInt(item.Apr) >= parseInt(item.PotentialTarget)) ? `green` : ``}'>${item.Apr}</td>
            //       <td style='background-color:${ (parseInt(item.May) > 0 && parseInt(item.May) >= parseInt(item.PotentialTarget)) ? `green` : ``}'>${item.May}</td>
            //       <td style='background-color:${ (parseInt(item.Apr) > 0 && parseInt(item.Apr) >= parseInt(item.PotentialTarget)) ? `green` : ``}'>${item.Apr}</td>

            list.forEach((item) => {
                let actualTotal = (parseInt(item.Apr) +
                    parseInt(item.May) +
                    parseInt(item.Jun) +
                    parseInt(item.Jul) +
                    parseInt(item.Aug) +
                    parseInt(item.Sep) +
                    parseInt(item.Oct) +
                    parseInt(item.Nov) +
                    parseInt(item.Dec) +
                    parseInt(item.Jan) +
                    parseInt(item.Feb) +
                    parseInt(item.Mar)

                )
                showHtml.push(` <tr>
                  <td class="clsadmin">${(item.zoneName)}</td>
                  <td>${(item.EmpNumber)}</td>
                  <td class="clsadmin">${camelCaseText(item.zbmName)}</td>
                  <td class="clszbm">${(item.rbmName)}</td>
                  <td>${camelCaseText(item.empName)}</td>
                  <td>${camelCaseText(item.regionName)}</td>
                  <td>${camelCaseText(item.hospitalName)}</td>
                  <td>${camelCaseText(item.brand)}</td>
                  <td>${(item.potentialTarget)}</td>
                  <td>${actualTotal}</td>

                  <td>${item.Apr}</td>
                  <td>${item.May}</td>
                  <td>${item.Jun}</td>

                  <td>${item.Jul}</td>
                  <td>${item.Aug}</td>
                  <td>${item.Sep}</td>

                  <td>${item.Oct}</td>
                  <td>${item.Nov}</td>
                  <td>${item.Dec}</td>

                  <td>${item.Jan}</td>
                  <td>${item.Feb}</td>
                  <td>${item.Mar}</td>
                  
                  
               
                </tr>   `);
            });
            $('#loadHospitalList').html(showHtml.join('')); //
            $('#divTotalHospitals').html(`${list.length} Record found`); //
            
          
            // if ( $.fn.dataTable.isDataTable( '#adminReport1' ) ) {
            //     table = $('#adminReport1').DataTable(
                    
            //     );
            // }
            // else {
            //     table = $('#adminReport1').DataTable( {
            //         paging: false,
            //         "searching": false
            //     } );
            // }
            //console.log(userData.post)
            if (userData.post  === 'RBM')  {
                $('.clsadmin').hide();
                $('.clsadmin').hide();
                $('.clszbm').hide();
            } else if (userData.post  === 'ZBM')  {
                $('.clsadmin').hide();
            } else if (userData.post  === 'ADMIN') {

            }


            $('.loader-wrapper').addClass('none');

        });

}


function downLoadReport()
{
    var type = 'xlsx';
    var data = document.getElementById('adminReport1');
    var file = XLSX.utils.table_to_book(data, {sheet: "sheet1"});
    XLSX.write(file, { bookType: type, bookSST: true, type: 'base64' });
    XLSX.writeFile(file, 'admin_report_excel-format.' + type);
}
