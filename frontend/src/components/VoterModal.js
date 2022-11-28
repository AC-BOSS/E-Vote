import React, {useState} from "react";
import styles from "./PollModal.module.css";

import { useNavigate } from "react-router-dom";

export default function PollModal({id:pollId}){
    const navigate = useNavigate();
    const [voter, setVoter] = useState("");

    const handleOnSubmit = async() => {
        const accessToken = sessionStorage.getItem("accessToken");
        if(!accessToken) {
            navigate("/login");
        }
        console.log(pollId);
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/poll/${pollId}/addvoter`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': accessToken
            },
            body:JSON.stringify({voter})
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
            <div className={styles.h1}>Add Voter</div>
            <input
                className={styles.inputField}
                type="text"
                placeholder="Voter Email"
                value={voter}
                onChange={(e) => setVoter(e.target.value)}
            />

            <div className={styles.submitBtn} onClick={handleOnSubmit}>
                Add Voter
            </div>
        </div>
    );
}