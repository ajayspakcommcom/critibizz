const path = require('path');
const sql = require('mssql');

exports.getAdminReport = (req, res, next) => {
  res.sendFile(`${path.dirname(process.mainModule.filename)}/public/admin/admin-report.html`)
}

exports.getAdminFilters = (req, res, next) => {
  console.log('admin controller -->' + req.query.method)
  //return res.status(200).json(_loadFilter(req.body));
  _loadFilter(req.query.method).then((response) => {
    res.status(200).json(response.recordsets);
  });

}

exports.getAdminReportData = (req, res, next) => {
  console.log('admin controller -->' + req.query.method)
  //return res.status(200).json(_loadFilter(req.body));
  _getAdminReportData(req.body).then((response) => {
    res.status(200).json(response.recordset);
  });
}



const config = {
  server: "N1NWPLSK12SQL-v03.shr.prod.ams1.secureserver.net",
  user: "aasha",
  password: "2!Oryc83",
  port: 1433,
  database: "aasha-bsvwithu",
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




function _getAdminReportData(objParam) {
  console.log(objParam)
  let response;
  return new Promise((resolve) => {
    var dbConn = new sql.ConnectionPool(config);
    dbConn
      .connect()
      .then(function () {
        var request = new sql.Request(dbConn);
        request
          .input("month", sql.SmallInt, objParam.mon)
          .input("year", sql.SmallInt, objParam.year)
          .input("hospitalId", sql.Int, ((objParam.hospitalId) || null))
          .input("medId", sql.Int, ((objParam.medId) || null))
          .input("empId", sql.Int, ((objParam.empId) || null))
          .execute("USP_GET_ADMIN_REPORT_CRITIBIZZ_v1")
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

function _loadFilter(objParam) {
  console.log(objParam)
  let response;
  return new Promise((resolve) => {
    var dbConn = new sql.ConnectionPool(config);
    dbConn
      .connect()
      .then(function () {
        var request = new sql.Request(dbConn);
        request
          .execute("USP_GET_ADMIN_REPORT_FILTER_CRITIBIZZ")
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