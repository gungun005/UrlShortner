const express=require('express');
const {generateShortUrl, generateUrl}=require("../controllers/url");
const router=express.Router();

router.post('/post',generateShortUrl);
router.post('/shortid',generateUrl);

module.exports=router;