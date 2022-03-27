const express = require("express");
const router = express.Router();
const fetchUser = require("../middleware/fetchUser");
const User = require("../models/User");

router.post("/addHandExtension", fetchUser, async(req, res) => {
    try{
        user = await User.findById(req.user.id)
        const { count, adherance, time } = req.body
        const date = new Date()
        await user.handExtensions.push({date: date, count:count, adherance:Number(adherance), totalTime:Number(time)})
        await user.save()
        res.send(JSON.stringify(user))
    }
    catch(error){
        console.log(error)
    }
})

module.exports = router