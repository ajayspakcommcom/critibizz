function setupAdminReport() {
    let userData = JSON.parse(localStorage.getItem("userData")),
        divRBM = $('#divRBM');
    //divZBM = $('#divRBM')
    // divAdmin = $('#divadmin');

    if (!userData) {
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
    $('#cmbYear').prop('selectedIndex', 0);
    $('#cmbHosp').prop('selectedIndex', 0);
    $('#cmbBrandList').prop('selectedIndex', 0);
    $('#cmbKam').prop('selectedIndex', 0);
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

    if (userData.post === 'ZBM') {
        $('#cmbRBM').show();
        $('#divFormRbm').show();
    } else if (userData.post === 'RBM') {

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
            console.log(response);
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
            loadComboBox(zbmList, 'cmbZBM', 'EmpID', 'firstName', 'Designation');
            //LIST zone
            loadComboBox(zoneList, 'cmbZone', 'zoneID', 'name');
        });

}

async function getAdminReport() {
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



    let paramActuals = {
        method: 'getAdminReportActuals',
        year: year,
        secondYear: secondYear,
        hospitalId: parseInt($('#cmbHosp').val()),
        medId: parseInt($('#cmbBrandList').val()),
        kamId: parseInt($('#cmbKam').val())

    };

    // const axiosrequestNorth = axios.post("/admin/api", paramNorth);
    // const axiosrequestSouth = axios.post("/admin/api", paramSouth);
    // const axiosrequestEast = axios.post("/admin/api", paramEast);

    const axiosrequestWest = axios.post("/admin/api", param);
    const axiosrequest2 = axios.post("/admin/api/actuals", paramActuals);
    await axios.all([axiosrequestWest, axiosrequest2]).then(axios.spread(function (res1, res2) {

        console.log(res1.data[0]);
        console.log(res2.data[0]);

        let list = res1.data[0],
            showHtml = [],
            mon = $('#cmbMonth').val(),
            year = $('#cmbYear').val();
        list.forEach((item) => {
            let actuals = res2.data[0].filter(data => {
                //console.log(data.MedID, data.hospitalId)
                return data.medId == item.medID && data.hospitalId == item.hospitalId
            });
            console.log(actuals);
            let apr, may, june,
                july, aug, sep,
                oct, nov, dec,
                jan, feb, mar;

            apr = actuals.find(data => {
                return data.ActualsEnteredFor.split('-')[1] == 04;
            })

            may = actuals.find(data => {
                return data.ActualsEnteredFor.split('-')[1] == 05;
            })
            june = actuals.find(data => {
                return data.ActualsEnteredFor.split('-')[1] == 06;
            })

            july = actuals.find(data => {
                return data.ActualsEnteredFor.split('-')[1] == 07;
            })
            aug = actuals.find(data => {
                return data.ActualsEnteredFor.split('-')[1] == 08;
            })
            sep = actuals.find(data => {
                return data.ActualsEnteredFor.split('-')[1] == 09;
            })

            oct = actuals.find(data => {
                return data.ActualsEnteredFor.split('-')[1] == 10;
            })
            nov = actuals.find(data => {
                return data.ActualsEnteredFor.split('-')[1] == 11;
            })
            dec = actuals.find(data => {
                return data.ActualsEnteredFor.split('-')[1] == 12;
            })

            jan = actuals.find(data => {
                return data.ActualsEnteredFor.split('-')[1] == 01;
            })
            feb = actuals.find(data => {
                return data.ActualsEnteredFor.split('-')[1] == 02;
            })
            mar = actuals.find(data => {
                return data.ActualsEnteredFor.split('-')[1] == 03;
            })

            let aprValue = (apr) ? apr.ActualTarget : '0',
                mayValue = (may) ? may.ActualTarget : '0',
                juneValue = (june) ? june.ActualTarget : '0',
                julyValue = (july) ? july.ActualTarget : '0',
                augValue = (aug) ? aug.ActualTarget : '0',
                sepValue = (sep) ? sep.ActualTarget : '0',
                octValue = (oct) ? oct.ActualTarget : '0',
                novValue = (nov) ? nov.ActualTarget : '0',
                decValue = (dec) ? dec.ActualTarget : '0',
                janValue = (jan) ? jan.ActualTarget : '0',
                febValue = (feb) ? feb.ActualTarget : '0',
                marValue = (mar) ? mar.ActualTarget : '0';



            // if (actuals[0]) {
            //     apr = (actuals[0].ActualsEnteredFor) ? ((actuals[0].ActualsEnteredFor.split('-')[1] == 4)? actuals[0].ActualTarget : '0') : 'N/A'
            //     may = (actuals[0].ActualsEnteredFor) ? ((actuals[0].ActualsEnteredFor.split('-')[1] == 5)? actuals[0].ActualTarget : '0') : 'N/A'
            //     june = (actuals[0].ActualsEnteredFor) ? ((actuals[0].ActualsEnteredFor.split('-')[1] == 6)? actuals[0].ActualTarget : '0') : 'N/A'
            //     july = (actuals[0].ActualsEnteredFor) ? ((actuals[0].ActualsEnteredFor.split('-')[1] == 7)? actuals[0].ActualTarget : '0') : 'N/A'
            //     aug = (actuals[0].ActualsEnteredFor) ? ((actuals[0].ActualsEnteredFor.split('-')[1] == 8)? actuals[0].ActualTarget : '0') : 'N/A'
            //     sep = (actuals[0].ActualsEnteredFor) ? ((actuals[0].ActualsEnteredFor.split('-')[1] == 9)? actuals[0].ActualTarget : '0') : 'N/A'
            //     oct = (actuals[0].ActualsEnteredFor) ? ((actuals[0].ActualsEnteredFor.split('-')[1] == 10)? actuals[0].ActualTarget : '0') : 'N/A'
            //     nov = (actuals[0].ActualsEnteredFor) ? ((actuals[0].ActualsEnteredFor.split('-')[1] == 11)? actuals[0].ActualTarget : '0') : 'N/A'
            //     dec = (actuals[0].ActualsEnteredFor) ? ((actuals[0].ActualsEnteredFor.split('-')[1] == 12)? actuals[0].ActualTarget : '0') : 'N/A'
            //     jan = (actuals[0].ActualsEnteredFor) ? ((actuals[0].ActualsEnteredFor.split('-')[1] == 1)? actuals[0].ActualTarget : '0') : 'N/A'
            //     feb = (actuals[0].ActualsEnteredFor) ? ((actuals[0].ActualsEnteredFor.split('-')[1] == 2)? actuals[0].ActualTarget : '0') : 'N/A'
            //     mar = (actuals[0].ActualsEnteredFor) ? ((actuals[0].ActualsEnteredFor.split('-')[1] == 3)? actuals[0].ActualTarget : '0') : 'N/A'
            // }

            showHtml.push(` 
            <tr>
                <td class="clsadmin">${(item.name)}</td>
                <td>${(item.EmpNumber)}</td>
                <td class="clsadmin">${camelCaseText(item.ZBMName)}</td>
                <td class="clszbm">${(item.RBM)}</td>
                <td>${camelCaseText(item.firstName)}</td>
                <td>${camelCaseText(item.regionName)}</td>
                <td>${camelCaseText(item.hospitalName)}</td>
                <td>${camelCaseText(item.Brand)}</td>
                <td>${(item.PotentialTarget)}</td>
                <td>${aprValue}</td>
                <td>${mayValue}</td>
                <td>${juneValue}</td>
                <td>${julyValue}</td>
                <td>${augValue}</td>
                <td>${sepValue}</td>
                <td>${octValue}</td>
                <td>${novValue}</td>
                <td>${decValue}</td>
                <td>${janValue}
                <td>${febValue}</td>
                <td>${marValue}</td>
                
            </tr>   `);
        });
        $('#loadHospitalList').html(showHtml.join('')); //
        $('#divTotalHospitals').html(`${list.length} Record found`); //


    }));


    // axios
    //     .post("/admin/api", param)
    //     .then((response) => {
    //         console.log(response.data[0]);
    //         let list = response.data[0],
    //             showHtml = [],
    //             mon = $('#cmbMonth').val(),
    //             year = $('#cmbYear').val();

    //         //<td>${camelCaseText(currVal.hospitalName)}</td>
    //         // <td style='background-color:${ (parseInt(item.Apr) > 0 && parseInt(item.Apr) >= parseInt(item.PotentialTarget)) ? `green` : ``}'>${item.Apr}</td>
    //         //       <td style='background-color:${ (parseInt(item.May) > 0 && parseInt(item.May) >= parseInt(item.PotentialTarget)) ? `green` : ``}'>${item.May}</td>
    //         //       <td style='background-color:${ (parseInt(item.Apr) > 0 && parseInt(item.Apr) >= parseInt(item.PotentialTarget)) ? `green` : ``}'>${item.Apr}</td>

    //         list.forEach((item) => {

    //             showHtml.push(` <tr>
    //               <td class="clsadmin">${(item.name)}</td>
    //               <td>${(item.EmpNumber)}</td>
    //               <td class="clsadmin">${camelCaseText(item.ZBMName)}</td>
    //               <td class="clszbm">${(item.RBM)}</td>
    //               <td>${camelCaseText(item.EmpName)}</td>
    //               <td>${camelCaseText(item.regionName)}</td>
    //               <td>${camelCaseText(item.hospitalName)}</td>
    //               <td>${camelCaseText(item.Brand)}</td>
    //               <td>${(item.PotentialTarget)}</td>

    //               <td>${item.Apr}</td>
    //               <td>${item.May}</td>
    //               <td>${item.Jun}</td>

    //               <td>${item.Jul}</td>
    //               <td>${item.Aug}</td>
    //               <td>${item.Sep}</td>

    //               <td>${item.Oct}</td>
    //               <td>${item.Nov}</td>
    //               <td>${item.Dec}</td>

    //               <td>${item.Jan}</td>
    //               <td>${item.Feb}</td>
    //               <td>${item.Mar}</td>



    //             </tr>   `);
    //         });
    //         $('#loadHospitalList').html(showHtml.join('')); //
    //         $('#divTotalHospitals').html(`${list.length} Record found`); //


    //         // if ( $.fn.dataTable.isDataTable( '#adminReport1' ) ) {
    //         //     table = $('#adminReport1').DataTable(

    //         //     );
    //         // }
    //         // else {
    //         //     table = $('#adminReport1').DataTable( {
    //         //         paging: false,
    //         //         "searching": false
    //         //     } );
    //         // }
    //         //console.log(userData.post)
    //         if (userData.post  === 'RBM')  {
    //             $('.clsadmin').hide();
    //             $('.clsadmin').hide();
    //             $('.clszbm').hide();
    //         } else if (userData.post  === 'ZBM')  {
    //             $('.clsadmin').hide();
    //         } else if (userData.post  === 'ADMIN') {

    //         }


    $('.loader-wrapper').addClass('none');

    //     });

}


function downLoadReport() {
    var type = 'xlsx';
    var data = document.getElementById('adminReport1');
    var file = XLSX.utils.table_to_book(data, { sheet: "sheet1" });
    XLSX.write(file, { bookType: type, bookSST: true, type: 'base64' });
    XLSX.writeFile(file, 'admin_report_excel-format.' + type);
}
