const express = require('express');
const { createAdmin, loginAdmin, checkSession, logoutAdmin } = require('../controllers/admins');
const router =express.Router();


router.route('/').post(createAdmin)
router.route("/login").post(loginAdmin)
router.route("/checkSession").get(checkSession)
router.route("/logout").get(logoutAdmin)

module.exports = router