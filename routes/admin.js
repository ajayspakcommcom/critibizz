const express = require('express'),
      router = express.Router(),
      adminController = require('../controllers/admin');


      router.get('/admin-report', adminController.getAdminReport)
      router.get('/admin/api', adminController.getAdminFilters)
      router.post('/admin/api', adminController.getAdminReportData)
      router.post('/admin/api/actuals', adminController.getAdminReportDataActuals)
   


      module.exports = router;
