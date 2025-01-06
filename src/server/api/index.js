const express = require('express');
const router = express.Router();

module.exports = router;

router.get('/test', async(req, res, next)=> {
  res.send('sample api route');
});
