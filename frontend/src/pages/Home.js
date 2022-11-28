import React, { useState, useEffect } from "react";
import styles from "./Home.module.css";
import PollCard from "../components/PollCard";
import PollModal from "../components/PollModal";

import Modal from '@mui/material/Modal';

import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
    const [polls, setPolls] = useState([]);
    const [myPolls, setMyPolls] = useState([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        async function getPolls(){
            const accessToken = sessionStorage.getItem("accessToken");
            if(!accessToken) {
                navigate("/login");
            }
            console.log(accessToken);
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/poll/view`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accessToken
                }
            })
            const data = await response.json();
            console.log(data);
            setPolls(data);
        }
        async function getMyPolls(){
            const accessToken = sessionStorage.getItem("accessToken");
            console.log(accessToken);
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/poll/viewcreator`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accessToken
                }
            })
            const data = await response.json();
            console.log("mypolls", data);
            setMyPolls(data);
        }
        function getAdminStatus(){
            const isAdminStatus = sessionStorage.getItem("isAdmin");
            console.log(typeof(isAdminStatus));
            if(isAdminStatus === "true")
                setIsAdmin(true);
            console.log(isAdmin);
        }
        getAdminStatus();
        getPolls();
        getMyPolls();
    }, [navigate, isAdmin]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const logout = () => {
        sessionStorage.clear();
        navigate("/login");
    }

    return(
        <>
        <div className={styles.navbar}>
            <div className={styles.submitBtn} onClick={logout}>Logout</div>
            {isAdmin && <div onClick={handleOpen} className={styles.submitBtn}>Create Poll</div>}
        </div>
        <Modal
            open={open}
            onClose={handleClose}
        >
            <PollModal />
        </Modal>
        {
            isAdmin &&
            <div id="myPolls">
                <div className={styles.body}>
                    <div className={styles.cards}>
                    <div className={styles.cardsHeading}>Your Created Polls</div>
                    {myPolls.length !== 0 ? (
                        <div className={styles.cardsList}>
                        {myPolls.map((elem) => {
                            return (
                            <PollCard
                                key={elem._id}
                                id = {elem._id}
                                institution={elem.institution}
                                post={elem.post}
                                candidates={elem.candidates}
                                startTime={elem.startTime}
                                endTime={elem.endTime}
                                votes = {elem.votes}
                                myPoll = {true}
                            />
                            );
                        })}
                        </div>
                    ) : (
                        <div className={styles.secondaryText}>
                        No Polls
                        </div>
                    )}
                    </div>
                </div>
            </div>
        }  
        <div className="UserDashboard">
            <div className={styles.body}>
                <div className={styles.cards}>
                <div className={styles.cardsHeading}>Your Polls</div>
                {polls.length !== 0 ? (
                    <div className={styles.cardsList}>
                    {polls.map((elem) => {
                        return (
                        <PollCard
                            key={elem._id}
                            id={elem._id}
                            institution={elem.institution}
                            post={elem.post}
                            candidates={elem.candidates}
                            startTime={elem.startTime}
                            endTime={elem.endTime}
                            myPoll = {false}
                        />
                        );
                    })}
                    </div>
                ) : (
                    <div className={styles.secondaryText}>
                    You are not a voter in any Poll!
                    </div>
                )}
                </div>
            </div>
        </div>
        </>
    )
}