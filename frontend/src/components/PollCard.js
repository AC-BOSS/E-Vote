import React, {useState} from "react";
import styles from "./PollCard.module.css";
import Button from "@mui/material/Button";
import CountdownTimer from "./CountdownTimer";
import CandidateModal from "./CandidateModal";
import VoterModal from "./VoterModal";
import {useNavigate} from "react-router-dom";
import Modal from '@mui/material/Modal';

const PollCard = (props) => {
    const navigate = useNavigate();
	const [open, setOpen] = useState(false);
	const [openVoter, setOpenVoter] = useState(false);
	const curr = new Date();
	// const ISToffset = 330*60*1000;
	// const currIST = new Date(curr.getTime() + ISToffset).toISOString();

	const startTime = new Date(props.startTime);
	const endTime = new Date(props.endTime);

	console.log(startTime, endTime, curr);
	const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
	const handleOpenVoter = () => setOpenVoter(true);
	const handleCloseVoter = () => setOpenVoter(false);

	const submitHandler = async(candidateId) => {
		const accessToken = sessionStorage.getItem("accessToken");
        if(!accessToken) {
            navigate("/login");
        }
		const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/poll/${props.id}/vote`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': accessToken
            },
            body:JSON.stringify({candidateId})
        });
		if(response.ok) {
			window.alert("Your vote has been cast");
		} else {
			const error = await response.json();
            window.alert(error);
		}
	}

	return (
		<div className={styles.apiCard}>
			<div className={styles.primaryText}>{props.institution}</div>
			<div className={styles.secondaryText}>{props.post}</div>
			{curr > endTime ? <div className={styles.heading}>Results</div> : <div className={styles.heading}>Candidates</div>}

			{props.candidates.map((elem) => {
				return(
					<div key={elem._id} className={styles.candidate} >
						<span className={styles.candidateName}>{elem.name}</span>
						<a href={elem.manifesto} target="_blank" rel="noreferrer" className={styles.manifesto}>Manifesto</a>
						{
							curr> startTime && curr < endTime ?
							<Button variant="contained" onClick={() => submitHandler(elem._id)}>Vote</Button> 
							:
							curr < startTime ?
							<Button variant="contained" disabled>Vote</Button>
							:
							<div>Votes: {elem.votes}</div>
						}
					</div>
				)
			})}
			<CountdownTimer startDate={props.startTime} endDate={props.endTime} />
			{props.myPoll && <div className={styles.submitBtn} onClick={handleOpen}>Add Candidate</div>}
			{props.myPoll && <div className={styles.submitBtn} onClick={handleOpenVoter}>Add Voter</div>}
			<Modal
				open={open}
				onClose={handleClose}
			>
				<CandidateModal id={props.id} />
			</Modal>
			<Modal open={openVoter} onClose={handleCloseVoter}>
				<VoterModal id = {props.id} />
			</Modal>
		</div>
	);
};

export default PollCard;