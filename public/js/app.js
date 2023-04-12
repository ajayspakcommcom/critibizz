const _POSTLOGINURL = '/chart1',
    _POST_5TH_USER_IS_ALLOWED_TO_ENTER_ACTUALS = true,
    _CUT_OF_DATE_OF_MONTH = 5,
    _ADMINROLE = 'ADMIN',
    _POSTLOGINADMINURL = '/admin-report';

function validateAdminUserDetails() {
    if ($("#username").val() === "") {
        alert("please enter your username");
        $("#username").focus();
        return false;
    }

    if ($("#password").val() === "") {
        alert("please enter your password");
        $("#password").focus();
        return false;
    }
    let param = {
        username: $("#username").val(),
        password: $("#password").val(),
        method: 'login'
    };

    axios
        .post("/api", param)
        .then((response) => {
            console.log(response.data.success);
            console.log(response.data)
            localStorage.setItem("userData", JSON.stringify(response.data.userDetiails));

            if(response.data.userDetiails.post.toLowerCase() === 'admin') {
                (response.data.success === true) ? (document.location.href = _POSTLOGINADMINURL) : $('#lblmsg').text(response.data.msg)
            } else {
                (response.data.success === true) ? (document.location.href = _POSTLOGINURL) : $('#lblmsg').text(response.data.msg)
            }
        })
        .catch((err) => {
            console.log("inside catch");
            console.log(err);
        });
}

function loadMonthYear() {
    const date = new Date();
    let dt = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    $('#cmbMonth').val(dt.getMonth() + 1); // our combo box starts with 1
    $('#cmbYear').val(dt.getFullYear());
}

/**
 * LOAD MANAGERS
 */
function getManagersList() {
    let urlParams = new URLSearchParams(window.location.search);
    let param = {
        stateName: urlParams.get('name'),
        method: 'getManagersList'
    };

    axios
        .post("/api", param)
        .then((response) => {
            managers = response.data.filter(rec => {
                return rec.Designation === 'ZBM'
            })
            let managerArr = [];
            managers.forEach(rec => {
                managerArr.push(`<b>${rec.firstName}</b>`)
            });
            $('#dvZbh').html(managerArr.join(''));
            managers = response.data.filter(rec => {
                return rec.Designation === 'RBM'
            })
            managerArr = [];
            managers.forEach(rec => {
                managerArr.push(` <li><b>${rec.firstName}</b></li>`)
            });
            $('.rbmm-list').html(managerArr.join(''))
        })
        .catch((err) => {
            console.log("inside catch");
            console.log(err);
        });
}

function loadManagers() {
    $(".zone-profile").load("includes/managers.html");
    getManagersList()
}

function setupTopNav() {
    $("#topnav").load("includes/topNavigation.html");

}

function isUserLoggedIn() {
   // console.log('check user is logged in or not')
   let adminLink = $('#adminReport'),
        userData = JSON.parse(localStorage.getItem("userData"));

    adminLink.show();
    const urlPathName = window.location.pathname;
    if ((urlPathName.substring(1) == '') || (urlPathName.substring(1) == 'index')) {
      //  console.log('user is on home page')
    } else {
        if (!userData) {
            document.location.href = '/index'
        }
    }
    if (userData) {
       // $('#spUserFullName').text('Hello ' + camelCaseText(userData.name) +'('+ +')');
        $('#spUserFullName').text(`Hello ${camelCaseText(userData.name)} (${(userData.post)})`);
        if (userData.post === _ADMINROLE) {
            adminLink.show();
        }
    }


}



function logMeOut() {
    localStorage.setItem("userData", null);
    localStorage.clear();
    //document.location.href = "/manager/login";
    document.location.href = "/index";

}




function canAddActuals() {
    /**
     * 1. IF USER IS ENTERING THE VALUES AFTER 5 OF THE MONTH HE CAN NOT ENTER, SHOULD BE A VARIABLE DRIVEN
     * 2. IF USER HAS ALREADY ENTERED THE VALUE, CAN NOT ENTER AGAIN FOR THAT MONTH
     * 
    */
    return;
    $('.saveActualBtn').removeClass('hide');
    $('.addActualBtn').addClass('none');

    var _cutofDate = new Date();

    console.log('total value -->' + parseInt($('#dvtotalActual').text()));
    if (parseInt($('#dvtotalActual').text()) === 0) {
        console.log('i can enter')
        $('.addActualBtn').removeClass('none');
        // if (today.getDate() <= _CUT_OF_DATE_OF_MONTH) {
        //     $('.addActualBtn').removeClass('none');
        // }
        // else {
        //     if (_POST_5TH_USER_IS_ALLOWED_TO_ENTER_ACTUALS) {
        //         $('.addActualBtn').removeClass('none');
        //     }
        // }

    } else {
        console.log('i can not enter')
        if (!$('.addActualBtn').hasClass('hide')) {
            $('.addActualBtn').addClass('hide');
        }
    }
}

function goBack() {
    window.history.back();
}


function toggleGoBackLink() {
    const urlPathName = window.location.pathname;
   // console.log(urlPathName.substring(1));
    const topLink = document.querySelector('#toplinks');
    const goBackLink = document.querySelector('#gobacklink');
    if ((urlPathName.substring(1) == '') || (urlPathName.substring(1) == 'thankyou') || (urlPathName.substring(1) == 'index')) {
        if (topLink) {
            topLink.classList.add('hide');
        }
    } else {
        if (topLink) {
            topLink.classList.remove('hide');
        }
    }

    if (urlPathName.substring(1) == 'chart') {
        goBackLink.classList.add('hide');
    } else {
        // goBackLink.classList.remove('hide');
    }
}

setTimeout(() => {
    toggleGoBackLink();
}, 500);

function camelCaseText(str) {
    // return txt.substr( 0, 1 ).toString().toUpperCase() + txt.substr( 1 ).toString().toLowerCase();
    if (str) {
        let arr = str.split(" ");
        for (var i = 0; i < arr.length; i++) {
            arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1).toLowerCase();

        }
        return arr.join(" ");
    }
}


/**
 * 
 * 
 * var tree = [];
var treeNode;
data = response.data.recordset;
console.log(data)
function recData (parentId, data) {
    data.forEach(rec =>{
       
        if (!rec.ParentID) {
             treeNode = data.find( ({ EmpID }) => EmpID === 37 );
             tree.push({...treeNode})
        } else {
             //console.log('child')
             treeNode = tree.find( ({ EmpID }) => EmpID === rec.ParentID );
            console.log(treeNode)
            console.log(treeNode.hasOwnProperty('childrens'));
           //  console.log('childrens' in treeNode); 
           //  if(treeNode.hasOwnProperty('childrens')) {
                
           //  } else {
           //      treeNode.childrens = [];
           //  }
           //  treeNode.childrens.push({...rec})
           
        }
    }) 
    
    // let record = data.find( ({ ParentId }) => ParentId === parentId ); 
    // if (record) {
                
    // } else {
    //     treeNode = data.find( ({ EmpID }) => EmpID === 37 );
    // }
     tree = {...treeNode}
    
    
}
recData(37, data)
console.log(tree)
 */