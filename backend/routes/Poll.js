const router = require("express").Router();
const { isAdmin, isLoggedIn } = require("../middlewares/Auth");
const Poll = require("../models/Poll");

router.post("/create", [isLoggedIn, isAdmin], async(req, res) => {
    const {post, institution, startTime, endTime} = req.body;

    try {
        const ISToffset = 330*60*1000;

        const start = new Date(startTime);
        const end = new Date(endTime);
        const curr = new Date();

        // const startIST = new Date(start.getTime() + ISToffset);
        // const endIST = new Date(end.getTime() + ISToffset);
        const currIST = new Date(curr.getTime() + ISToffset);

        // console.log(start.getDate(), start.getMonth(), start.getFullYear());
        // console.log(end.getDate(), end.getMonth(), end.getFullYear());
        // console.log(curr.getDate(), curr.getMonth(), curr.getFullYear());
        console.log(start, end, currIST);
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
        poll.candidates.push({name:req.body.candidate, manifesto:req.body.manifesto, votes:0});
        await poll.save();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }

})

router.post("/:id/addvoter", [isLoggedIn], async(req, res) => {
    const pollId = req.params.id;
    try {
        const poll = await Poll.findById(pollId);
        if(req.user.email !== poll.creator) {
            return res.status(403).json("You can only edit polls created by you!");
        }
        poll.voterList.push(req.body.voter);
        await poll.save();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
})

router.post("/:id/vote/", [isLoggedIn], async(req, res) => {
    const pollId = req.params.id;
    const candidateId = req.body.candidateId;

    try {
        const poll = await Poll.findById(pollId);

        const inVoterList = poll.voterList.find(voter => req.user.email === voter);
        if(!inVoterList) {
            return res.status(403).json("You are not listed as a voter!");
        }

        const inVotedList = poll.votedList.find(voter => req.user.email === voter);
        if(inVotedList) {
            return res.status(403).json("You have already voted!");
        }

        const candidate = poll.candidates.find(candidate => {
            console.log(candidate._id);
            return (candidateId == candidate._id.toString());
        });
        if(!candidate) {
            return res.sendStatus(400);
        }

        candidate.votes = candidate.votes + 1;
        poll.votedList.push(req.user.email);
        await poll.save();
        res.json("Your vote has been registered!");
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})
router.get("/view", [isLoggedIn], async(req, res) => {
    try {
        const polls = await Poll.find({voterList:req.user.email});
        res.json(polls);
    } catch (error) {
        console.log(error);
        res.status(500).json(err);
    }
})
router.get("/viewcreator", [isLoggedIn], async(req, res) => {
    try {
        const polls = await Poll.find({creator: req.user.email});
        res.json(polls);
    } catch (error) {
        console.log(error);
        res.status(500).json(err);
    }
})
module.exports = router;