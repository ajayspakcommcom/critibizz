/*jshint esversion: 6 */

const express = require("express");
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const sql = require("mssql");
const { isArray } = require("util");
const _allowedDesignaiton = ['ZBM', 'RBM', 'ADMIN'];

const adminRoutes = require('./routes/admin');

app.use(express.static(path.join(__dirname, "public")));

//app.use("/", express.static(__dirname + "/public"));



const twoDay = 1000 * 60 * 60 * 48;
console.log(twoDay);

app.use(sessions({
  secret: "spak5u9rbRWBkWTSmu9kspak",
  saveUninitialized: true,
  cookie: { maxAge: twoDay },
  resave: false
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(cookieParser());
app.use(adminRoutes);

const config = {
  server: "P3NWPLSK12SQL-v15.shr.prod.phx3.secureserver.net",
  user: "spakDb",
  password: "Spak@123-",
  port: 1433,
  database: "bsvDb",
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: true, // for azure
    trustServerCertificate: true, // change to true for local dev / self-signed certs
  },
};

console.log('Ajay');


// app.get("/admin-dashbaord", (req, res) => {
//   console.log('h3ere')
//   res.sendFile(`${__dirname}/dashboard.html`);
// });


// app.get("/report", (req, res) => {
//   console.log('report1')
//   res.sendFile(`${__dirname}/report1.html`);
// });

app.get("/index", (req, res) => {
  // CHECK IF USER HAS ALREADY LOGGED IN
  //console.clear();
  //console.log('this get called')
  //let session = req.session;
  //console.log(session.userDetiails)
  // if (session.userDetiails) {
  //  res.sendFile(`${__dirname}/public/chart.html`);
  //} else {
  res.sendFile(`${__dirname}/public/index.html`);
  //}
});

app.get("/thankyou", (req, res) => {
  res.sendFile(`${__dirname}/public/thank-you.html`);
});

app.get("/chart", (req, res) => {
  res.sendFile(`${__dirname}/public/chart.html`);
});

app.get("/chart1", (req, res) => {
  res.sendFile(`${__dirname}/public/chart1.html`);
});

app.get("/hospital-list", (req, res) => {
  res.sendFile(`${__dirname}/public/hospital-list.html`);
});

app.get("/hospital-detail", (req, res) => {
  //console.log('Hospital Detail')
  res.sendFile(`${__dirname}/public/hospital-detail.html`);
});

app.get("/potentiallist", (req, res) => {
  //console.log('Hospital Detail')
  res.sendFile(`${__dirname}/public/potentiallist.html`);
});


app.get("/addpotential", (req, res) => {
  console.log('Hospital Detail')
  res.sendFile(`${__dirname}/public/addPotentials.html`);
});

app.get("/addNoBed", (req, res) => {
  console.log('Hospital Detail')
  res.sendFile(`${__dirname}/public/addNoBed.html`);
});


app.get("/my-kam-list", (req, res) => {
  console.log('Hospital Detail')
  res.sendFile(`${__dirname}/public/my-kam-list.html`);
});

// app.get("/admin-report", (req, res) => {
//   console.log('Admin Report')
//   res.sendFile(`${__dirname}/public/admin-report.html`);
// });


//my-kam-list

app.post("/api", (req, res) => {
  //console.log('method--->' + req.body.method);

  switch (req.body.method) {
    case "login":
      _userLogin(req.body).then((result) => {

        let response, success, msg, userDetiails,
          session = req.session;
        if (result.recordset) {
          let rec = result.recordset[0]
          if (_allowedDesignaiton.includes(rec.Designation.toUpperCase())) {
            success = true;
            msg = 'Login successful'
            userDetiails = {
              empId: rec.EmpID,
              name: rec.firstName,
              post: rec.Designation,
              lastLogin: rec.lastLoginDate,
              targetLeft: 4
            }
          } else {
            success = false;
            msg = 'You are not authorized to login to the system';
          }

        } else {
          success = false;
          msg = 'Invalid Username or Password'
        }

        session.userDetiails = userDetiails;

        //console.log(req.session)

        response = {
          success, msg, userDetiails
        };
        session = req.session;
        session.userid = req.body.username;
        // console.log(req.session)
        res.status(200).json(response);
      });
      break;
    case "getMedicine":
      _getMedicine(req.body).then((response) => {
        res.status(200).json(response.recordset);
      });
      break;
    case "getMyKamlist":
      _getMyKamlist(req.body).then((response) => {
        res.status(200).json(response.recordsets);
      });
      break;

    case "getEmpDetails":
      _getEmpDetails(req.body).then((response) => {
        res.status(200).json(response.recordset);
      });
      break;

    //
    case "dataLog":

      _dataLog(req.body).then((response) => {
        let rep = _prepareResponse(response)
        res.status(200).json(rep);
      });
      break;
    //
    case "adminuserlogin":
      _adminuserlogin(req.body).then((response) => {
        let rep = _prepareResponse(response)
        res.status(200).json(rep);
      });
      break;
    case "getMychildforOrgChart":

      _getMychildforOrgChart(req.body).then((response) => {
        //let rep = _prepareResponse(response)
        res.status(200).json(response.recordsets);
      });
      break;

    case "getMychildforOrgChart1":
      _getMychildforOrgChart1(req.body).then((response) => {
        res.status(200).json(response.recordsets);
      });
      break;

    case "getMychildforOrgChart2":
      _getMychildforOrgChart2(req.body).then((response) => {
        res.status(200).json(response.recordsets);
      });
      break;

    case "myChildHospitalList":
      _myChildHospitalList(req.body).then((response) => {
        res.status(200).json(response.recordsets[1]);
      });
      break;
    //
    case "loadDataForReport1":

      _loadDataForReport1(req.body).then((response) => {

        //let rep = _prepareResponse(response)
        res.status(200).json(response.recordset);
      });
      break;
    case "loadDashboardReport":

      _loadDashboardReport(req.body).then((response) => {
        // console.log('index js', response);
        res.status(200).json(response.recordset);
      });
      break;
    case "loadFilters":

      _loadFilters(req.body).then((response) => {
        res.status(200).json(response.recordsets);
      });
      break;
    case "getHospitalList":
      _getHospitalList(req.body).then((response) => {
        //let rep = _prepareResponse(response)
        res.status(200).json(response.recordsets);
      });
      break;
    //
    case "getHospitalListByEmp":
      _getHospitalListByEmp(req.body).then((response) => {
        res.status(200).json(response.recordset);
      });
      break;

    case "getManagersList":
      _getManagersList(req.body).then((response) => {
        res.status(200).json(response.recordset);
      });
      break;
    //
    case "getHospitalDetails":

      _getHospitalDetails(req.body).then((response) => {

        //let rep = _prepareResponse(response)
        //console.log(response.recordsets)
        res.status(200).json(response.recordsets);
      });
      break;
    case "saveHospitalTargets":

      _saveHospitalTargets(req.body).then((response) => {
        //let rep = _prepareResponse(response)
        //console.log(response)
        res.status(200).json(response);
      });
      break;
    case "saveHospitalPotentials":
      _saveHospitalPotentials(req.body).then((response) => {
        //console.log(response)
        res.status(200).json(response);
      });
      break;

    case 'saveNoOfBed':
      _saveNoOfBed(req.body).then((response) => {
        res.status(200).json(response);
      });
      break;

    //
    case "userModule":
      startModule(req.body).then((result) => {
        res.status(200).json({ message: "record added sucessfully" });
      });
      break;
    case "updateuserbadge":
      badgeEarned(req.body).then((result) => {
        res.status(200).json({ message: "badge earned sucessfully" });
      });
      break;


    // case "bucket":
    //   questionHTML = renderBucketQuestion(matchingQuestion);
    //   break;
    // case "chart":
    //   questionHTML = renderChartQuestion(matchingQuestion);
    //   break;
    default:
      //   getdata(req.body).then((result) => {
      //     res.status(200).json(result.recordset);
      //   });
      //console.log("Got body:", req.body.password);
      //console.log(req.body);
      break;
  }
});

app.listen(process.env.PORT || 3333, () => {
  //
  console.clear();
  console.log("Application listening on port 3333!");

});

function _prepareResponse(response, flag = true) {
  //console.log(response)
  //console.log(response.recordset.length);

  flag = (response.recordset.length === 0) ? false : true;
  let res = {
    success: flag,
    message: (flag) ? 'API responded scuessfully' : 'API responded NOT scuessfully'
  }
  return res;

}


function _loadDashboardReport(objParam) {
  //console.log(objParam)
  let response;
  return new Promise((resolve) => {
    var dbConn = new sql.ConnectionPool(config);
    dbConn
      .connect()
      .then(function () {
        var request = new sql.Request(dbConn);
        request
          .execute("USP_ADMIN_DASHBOARD_MEDICINE")
          .then(function (resp) {
            resolve(resp);
            dbConn.close();
          })
          .catch(function (err) {
            //console.log(err);
            dbConn.close();
          });
      })
      .catch(function (err) {
        //console.log(err);
      });
  });
}
//

function _loadFilters(objParam) {
  //console.log(objParam)
  let response;
  return new Promise((resolve) => {
    var dbConn = new sql.ConnectionPool(config);
    dbConn
      .connect()
      .then(function () {
        var request = new sql.Request(dbConn);
        request
          .execute("USP_ADMIN_REPORT_FILTERS")
          .then(function (resp) {
            resolve(resp);
            dbConn.close();
          })
          .catch(function (err) {
            //console.log(err);
            dbConn.close();
          });
      })
      .catch(function (err) {
        //console.log(err);
      });
  });
}

function _saveHospitalTargets(objParam) {

  //console.log(objParam)
  let response;
  return new Promise((resolve) => {
    var dbConn = new sql.ConnectionPool(config);
    dbConn
      .connect()
      .then(function () {
        var request = new sql.Request(dbConn);
        request
          .input("medId", sql.Int, ((objParam.medID) || null))
          .input("hospitalId", sql.Int, ((objParam.hospitalId) || null))
          .input("empId", sql.Int, ((objParam.empId) || null))
          .input("actualTarget", sql.BigInt, ((objParam.medVal) || null))
          .input("month", sql.SmallInt, objParam.mon)
          .input("year", sql.SmallInt, objParam.year)
          .execute("USP_INSERT_HOSPITAL_ACTUAL_TARGETS")
          .then(function (resp) {
            //console.log(resp);
            resolve(resp);
            dbConn.close();
          })
          .catch(function (err) {
            //         console.log(err);
            dbConn.close();
          });
      })
      .catch(function (err) {
        //   console.log(err);
      });
  });
}

function _saveHospitalPotentials(objParam) {
  let response;
  return new Promise((resolve) => {
    var dbConn = new sql.ConnectionPool(config);
    dbConn
      .connect()
      .then(function () {
        var request = new sql.Request(dbConn);
        request
          .input("medId", sql.Int, ((objParam.medID) || null))
          .input("hospitalId", sql.NVarChar, ((objParam.hospitalId) || null))
          .input("empId", sql.Int, ((objParam.empId) || null))
          .input("potential", sql.BigInt, ((objParam.medVal) || null))
          .execute("USP_INSERT_HOSPITAL_POTENTIAL_TARGETS")
          .then(function (resp) {
            //console.log(resp);
            resolve(resp);
            dbConn.close();
          })
          .catch(function (err) {
            //console.log(err);
            dbConn.close();
          });
      })
      .catch(function (err) {
        //console.log(err);
      });
  });
}

function _saveNoOfBed(objParam) {
  console.log('save No Of Bed');
  return new Promise((resolve) => {
    var dbConn = new sql.ConnectionPool(config);
    dbConn
      .connect()
      .then(function () {
        var request = new sql.Request(dbConn);
        request
          .input("hospitalId", sql.Int, ((objParam.hospitalId) || null))
          .input("bed", sql.Int, ((objParam.noOfBed) || null))
          .input("icuBed", sql.Int, ((objParam.noOfIcuBed) || null))
          .execute("USP_UPDATE_HOSPITALS_BED")
          .then(function (resp) {
            resolve(resp);
            dbConn.close();
          })
          .catch(function (err) {
            dbConn.close();
          });
      })
      .catch(function (err) {
      });
  });
}

//
function _loadDataForReport1(objParam) {
  //console.log(objParam)
  let response;
  return new Promise((resolve) => {
    var dbConn = new sql.ConnectionPool(config);
    dbConn
      .connect()
      .then(function () {
        var request = new sql.Request(dbConn);
        request
          .input("empId", sql.Int, ((objParam.empId) || null))
          .input("medId", sql.Int, ((objParam.medId) || null))
          .input("hospitalName", sql.NVarChar, ((objParam.hospitalName) || null))
          .input("hospitalCity", sql.NVarChar, ((objParam.hospitalCity) || null))
          .input("fromDate", sql.NVarChar, ((objParam.fromDate) || null))
          .input("toDate", sql.NVarChar, ((objParam.toDate) || null))
          .execute("USP_REPORT_1")
          .then(function (resp) {
            //console.log(resp);
            resolve(resp);
            dbConn.close();
          })
          .catch(function (err) {
            //        console.log(err);
            dbConn.close();
          });
      })
      .catch(function (err) {
        //  console.log(err);
      });
  });
}

function _userLogin(objParam) {

  return new Promise((resolve) => {
    var dbConn = new sql.ConnectionPool(config);
    dbConn
      .connect()
      .then(function () {
        var request = new sql.Request(dbConn);
        request
          .input("email", sql.NVarChar, objParam.username)
          .input("password", sql.NVarChar, objParam.password)
          .execute("USP_VALIDATE_USER")
          .then(function (resp) {
            resolve(resp);
            dbConn.close();
          })
          .catch(function (err) {
            //console.log(err);
            dbConn.close();
          });
      })
      .catch(function (err) {
        //console.log(err);
      });
  });
}

function _getMedicine(objParam) {
  //  console.log(objParam)
  let response;
  return new Promise((resolve) => {
    var dbConn = new sql.ConnectionPool(config);
    dbConn
      .connect()
      .then(function () {
        var request = new sql.Request(dbConn);
        request
          //.input("portalCode", sql.NVarChar, 'PATH2CARE,CRITIBIZZ')
          .input("portalCode", sql.NVarChar, 'CRITIBIZZ')
          .execute("USP_GET_MEDICINES_LIST")
          .then(function (resp) {
            //console.log(resp);
            resolve(resp);
            dbConn.close();
          })
          .catch(function (err) {
            //console.log(err);
            dbConn.close();
          });
      })
      .catch(function (err) {
        //console.log(err);
      });
  });
}


function _getMyKamlist(objParam) {
  console.log(objParam)
  let response;
  return new Promise((resolve) => {
    var dbConn = new sql.ConnectionPool(config);
    dbConn
      .connect()
      .then(function () {
        var request = new sql.Request(dbConn);
        request
          .input("empId", sql.Int, objParam.empId)
          .execute("USP_GET_ALL_EMPLOYEES_UNDER_ME_v1")
          .then(function (resp) {
            //console.log(resp);
            resolve(resp);
            dbConn.close();
          })
          .catch(function (err) {
            console.log(err);
            dbConn.close();
          });
      })
      .catch(function (err) {
        console.log(err);
      });
  });
}

function _getEmpDetails(objParam) {
  console.log(objParam)
  let response;
  return new Promise((resolve) => {
    var dbConn = new sql.ConnectionPool(config);
    dbConn
      .connect()
      .then(function () {
        var request = new sql.Request(dbConn);
        request
          .input("empId", sql.Int, objParam.empId)
          .execute("USP_GET_EMPLOYEE_DETAILS")
          .then(function (resp) {
            //console.log(resp);
            resolve(resp);
            dbConn.close();
          })
          .catch(function (err) {
            console.log(err);
            dbConn.close();
          });
      })
      .catch(function (err) {
        console.log(err);
      });
  });
}

//

function _dataLog(objParam) {
  return new Promise((resolve) => {
    var dbConn = new sql.ConnectionPool(config);
    dbConn
      .connect()
      .then(function () {
        var request = new sql.Request(dbConn);
        request
          .input("OrderDate", sql.SmallDateTime, objParam.logDate)
          .input("EmpID", sql.SmallInt, objParam.empId)
          .input("MedID", sql.SmallInt, objParam.medId)
          .input("noOfPaitents", sql.SmallInt, objParam.noOfPaitent)
          .input("DoctorsName", sql.NVarChar, objParam.drName)
          .input("DoctorID", sql.NVarChar, objParam.drCode)
          .input("noOfVials", sql.SmallInt, objParam.noOfVials)
          .input("HospitalName", sql.NVarChar, objParam.hospitalName)
          .input("HospitalCity", sql.NVarChar, objParam.hospitalCity)
          .execute("USP_LOG_USER_MEDICINE_DETAILS")
          .then(function (resp) {
            //console.log(resp);
            resolve(resp);
            dbConn.close();
          })
          .catch(function (err) {
            //console.log(err);
            dbConn.close();
          });
      })
      .catch(function (err) {
        //console.log(err);
      });
  });
}

/**
 * ADMIN FUNCTIONS
 */

function _adminuserlogin(objParam) {
  return new Promise((resolve) => {
    var dbConn = new sql.ConnectionPool(config);
    dbConn
      .connect()
      .then(function () {
        var request = new sql.Request(dbConn);
        request
          .input("username", sql.NVarChar, objParam.username)
          .input("password", sql.NVarChar, objParam.password)
          .execute("USP_VALIDATE_ADMIN_USER")
          .then(function (resp) {
            //console.log(resp);
            resolve(resp);
            dbConn.close();
          })
          .catch(function (err) {
            //console.log(err);
            dbConn.close();
          });
      })
      .catch(function (err) {
        //console.log(err);
      });
  });
}

//
function _getHospitalList(objParam) {

  return new Promise((resolve) => {
    var dbConn = new sql.ConnectionPool(config);
    dbConn
      .connect()
      .then(function () {
        var request = new sql.Request(dbConn);
        request
          .input("stateName", sql.VarChar, objParam.stateName)
          .input("month", sql.SmallInt, objParam.mon)
          .input("year", sql.SmallInt, objParam.year)
          .execute("USP_GET_STATE_HOSPITALS")
          .then(function (resp) {
            resolve(resp);
            dbConn.close();
          })
          .catch(function (err) {
            //console.log(err);
            dbConn.close();
          });
      })
      .catch(function (err) {
        //console.log(err);
      });
  });
}


function _getHospitalListByEmp(objParam) {

  return new Promise((resolve) => {
    var dbConn = new sql.ConnectionPool(config);
    dbConn
      .connect()
      .then(function () {
        var request = new sql.Request(dbConn);
        request
          .input("empId", sql.Int, objParam.empId)
          .input("month", sql.SmallInt, objParam.mon)
          .input("year", sql.SmallInt, objParam.year)
          .execute("USP_GET_HOSPITALS_LIST_FROM_EMP")
          .then(function (resp) {
            resolve(resp);
            dbConn.close();
          })
          .catch(function (err) {
            console.log(err);
            dbConn.close();
          });
      })
      .catch(function (err) {
        console.log(err);
      });
  });
}
//
function _getManagersList(objParam) {

  return new Promise((resolve) => {
    var dbConn = new sql.ConnectionPool(config);
    dbConn
      .connect()
      .then(function () {
        var request = new sql.Request(dbConn);
        request
          .input("stateName", sql.VarChar, objParam.stateName)
          .execute("USP_GET_STATE_MANAGERS")
          .then(function (resp) {
            resolve(resp);
            dbConn.close();
          })
          .catch(function (err) {
            //console.log(err);
            dbConn.close();
          });
      })
      .catch(function (err) {
        //console.log(err);
      });
  });
}

//
function _getHospitalDetails(objParam) {

  //console.log(objParam)
  return new Promise((resolve) => {
    var dbConn = new sql.ConnectionPool(config);
    dbConn
      .connect()
      .then(function () {
        var request = new sql.Request(dbConn);
        request
          .input("hospitalId", sql.SmallInt, objParam.hospitalId)
          .input("month", sql.SmallInt, objParam.mon)
          .input("year", sql.SmallInt, objParam.year)
          .execute("USP_HOSPITAL_DETAILS")
          .then(function (resp) {
            //  console.log('xxxxxx')
            //  console.log(resp)
            resolve(resp);
            dbConn.close();
          })
          .catch(function (err) {
            console.log(err);
            dbConn.close();
          });
      })
      .catch(function (err) {
        console.log(err);
      });
  });
}


function _getMychildforOrgChart(objParam) {

  return new Promise((resolve) => {
    var dbConn = new sql.ConnectionPool(config);
    dbConn.connect().then(function () {
      var request = new sql.Request(dbConn);
      request
        .input("month", sql.SmallInt, objParam.mon)
        .input("year", sql.SmallInt, objParam.year)
        .input("empid", sql.SmallInt, objParam.empId)
        .execute("USP_GET_CHART_RECORDS_v1")
        .then(function (resp) {
          //console.log(resp);
          //_processHirarchyData(resp);
          resolve(resp);
          dbConn.close();
        })
        .catch(function (err) {
          //console.log(err);
          dbConn.close();
        });
    })
      .catch(function (err) {
        //console.log(err);
      });
  });
}

function _getMychildforOrgChart1(objParam) {

  // objParam.mon = 6;
  // objParam.year = 2022;
  // objParam.empId = 2;

  return new Promise((resolve) => {
    var dbConn = new sql.ConnectionPool(config);
    dbConn.connect().then(function () {
      var request = new sql.Request(dbConn);
      request
        .input("month", sql.SmallInt, objParam.mon)
        .input("year", sql.SmallInt, objParam.year)
        .input("empid", sql.SmallInt, objParam.empId)
        .execute("USP_GET_CHART_RECORDS_v2")
        .then(function (resp) {
          // console.log('response', resp);
          resolve(resp);
          dbConn.close();
        })
        .catch(function (err) {
          //console.log(err);
          dbConn.close();
        });
    })
      .catch(function (err) {
        //console.log(err);
      });
  });
}

function _getMychildforOrgChart2(objParam) {

  return new Promise((resolve) => {
    var dbConn = new sql.ConnectionPool(config);
    dbConn.connect().then(function () {
      var request = new sql.Request(dbConn);
      request
        .input("month", sql.SmallInt, objParam.mon)
        .input("year", sql.SmallInt, objParam.year)
        .input("empid", sql.SmallInt, objParam.empId)
        .execute("spEmployeeState")
        .then(function (resp) {
          resolve(resp);
          dbConn.close();
        })
        .catch(function (err) {
          //console.log(err);
          dbConn.close();
        });
    })
      .catch(function (err) {
        //console.log(err);
      });
  });
}


function _myChildHospitalList(objParam) {

  return new Promise((resolve) => {
    var dbConn = new sql.ConnectionPool(config);
    dbConn
      .connect()
      .then(function () {
        var request = new sql.Request(dbConn);
        request
          .input("empID", sql.SmallInt, objParam.empId)
          .execute("USP_GET_MY_CHILD_RECORDS")
          .then(function (resp) {
            //console.log(resp);
            resolve(resp);
            dbConn.close();
          })
          .catch(function (err) {
            //console.log(err);
            dbConn.close();
          });
      })
      .catch(function (err) {
        //console.log(err);
      });
  });
}


// function _processHirarchyData(data) {
//   
//   console.log(data);
//   let response = {

//   }
// }

/** *********** OLD REFERENCE */

function startModule(objParam) {
  return new Promise((resolve) => {
    var dbConn = new sql.ConnectionPool(config);
    dbConn
      .connect()
      .then(function () {
        var request = new sql.Request(dbConn);
        request
          .input("userId", sql.Int, objParam.userId)
          .input("moduleId", sql.Int, objParam.moduleId)
          .input("subModuleId", sql.Int, objParam.subModuleId)
          .execute("USP_UPDATE_USER_MODULES_DETAILS")
          .then(function (resp) {
            resolve("Sucess");
            dbConn.close();
          })
          .catch(function (err) {
            // console.log(err);
            dbConn.close();
          });
      })
      .catch(function (err) {
        //console.log(err);
      });
  });
}

function badgeEarned(objParam) {
  return new Promise((resolve) => {
    var dbConn = new sql.ConnectionPool(config);
    dbConn
      .connect()
      .then(function () {
        var request = new sql.Request(dbConn);
        request
          .input("userId", sql.Int, objParam.userId)
          .input("moduleId", sql.Int, objParam.moduleId)
          .input("subModuleId", sql.Int, objParam.subModuleId)
          .input("BadgeEarned", sql.NVarChar, objParam.BadgeEarned)
          .execute("USP_USER_EARN_BADGE")
          .then(function (resp) {
            resolve("Sucess");
            dbConn.close();
          })
          .catch(function (err) {
            //  console.log(err);
            dbConn.close();
          });
      })
      .catch(function (err) {
        // console.log(err);
      });
  });
}
function getdata(objParam) {
  return new Promise((resolve) => {
    var dbConn = new sql.ConnectionPool(config);
    dbConn
      .connect()
      .then(function () {
        var request = new sql.Request(dbConn);
        request
          .input("fullname", sql.NVarChar, objParam.fullname)
          .input("email", sql.NVarChar, objParam.email)
          .input("phone", sql.NVarChar, objParam.phone)
          .input("password", sql.NVarChar, objParam.password)
          .execute("USP_VALIDATE_USER")
          .then(function (resp) {
            resolve(resp);
            dbConn.close();
          })
          .catch(function (err) {
            // console.log(err);
            dbConn.close();
          });
      })
      .catch(function (err) {
        //console.log(err);
      });
  });
}

function getdataQuery() {
  return new Promise((resolve) => {
    var dbConn = new sql.ConnectionPool(config);
    dbConn
      .connect()
      .then(function () {
        var request = new sql.Request(dbConn);
        request
          .query("select * from tblDeepUsers")
          .then(function (resp) {
            // console.log(resp);
            resolve(resp);
            dbConn.close();
          })
          .catch(function (err) {
            //  console.log(err);
            dbConn.close();
          });
      })
      .catch(function (err) {
        // console.log(err);
      });
  });
}

