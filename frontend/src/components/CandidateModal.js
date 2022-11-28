import React, {useState} from "react";
import styles from "./PollModal.module.css";

import { useNavigate } from "react-router-dom";

export default function PollModal({id:pollId}){
    const navigate = useNavigate();
    const [candidate, setCandidate] = useState("");
    const [manifesto, setManifesto] = useState("");

    const handleOnSubmit = async() => {
        const accessToken = sessionStorage.getItem("accessToken");
        if(!accessToken) {
            navigate("/login");
        }
        // console.log(pollId);
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/poll/${pollId}/addcandidate`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': accessToken
            },
            body:JSON.stringify({candidate, manifesto})
        });
        
        if(response.ok) {
            window.location.reload(false);
        } else {
            const error = await response.json();
            window.alert(error);
        }
    }

    return(
        <div className={styles.pollModal}>
            <div className={styles.h1}>Create New Poll</div>
            <input
                className={styles.inputField}
                type="text"
                placeholder="Candidate Name"
                value={candidate}
                onChange={(e) => setCandidate(e.target.value)}
            />
            <input
                className={styles.inputField}
                type="text"
                placeholder="Manifesto Link"
                value={manifesto}
                onChange={(e) => setManifesto(e.target.value)}
            />

            <div className={styles.submitBtn} onClick={handleOnSubmit}>
                Add Candidate
            </div>
        </div>
    );
}