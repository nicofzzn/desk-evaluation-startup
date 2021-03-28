const express = require('express')
const Startup = require('../models/Startup')
const { v4: uuidv4 } = require('uuid')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const router = express.Router()

// add startup
router.post('/', upload.single('myfile'), async (req, res) => {
  console.log(req.body)
  // const { name, funding_year, funding_profile_version } = req.body
  // try {
  //   const startup = await Startup.create({
  //     name,
  //     funding_year,
  //     funding_profile_version,
  //   })

  //   res.json(startup)
  // } catch (error) {}
})

module.exports = router
