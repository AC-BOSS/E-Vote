const router = require("express").Router();
const { isAdmin, isLoggedIn } = require("../middlewares/Auth");
const Poll = require("../models/Poll");

router.post("/create", [isLoggedIn, isAdmin], async(req, res) => {
    const {post, institution, startTime, endTime} = req.body;

    // console.log(req.user);
    // console.log(req.body);

    try {
        const start = new Date(startTime);
        const end = new Date(endTime);
        const curr = new Date();

        // console.log(start.getDate(), start.getMonth(), start.getFullYear());
        // console.log(end.getDate(), end.getMonth(), end.getFullYear());
        // console.log(curr.getDate(), curr.getMonth(), curr.getFullYear());

        if(start >= end) {
            return res.status(400).json("The start time of the poll should be before the end time");
        }
        if(curr >= start || curr >= end) {
            return res.status(400).json("The poll can't start or end in the past");
        }

        await Poll.create({post, institution, startTime:start, endTime:end, creator:req.user.email});
        res.status(201).json("Poll created");
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
    
});

router.post("/:id/addcandidate", [isLoggedIn], async(req, res) => {
    const pollId = req.params.id;
    try {
        const poll = await Poll.findById(pollId);
        if(req.user.email !== poll.creator) {
            return res.status(403).json("You can only edit polls created by you!");
        }
        poll.candidates.push({name:req.body.candidate, votes:0});
        res.sendStatus(200);
        await poll.save();
    } catch (error) {
        console.log(error);
        res.send(500).json(error);
    }

})
module.exports = router;