import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from 'react-bootstrap'
import HandExtChart from './HandExtChart'
import SquatChart from "./SquatChart";

const Profile = () => {
  let navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(()=> {
    if(!localStorage.getItem("token")){
        navigate("/login")
    }
    getUser()
  }, [navigate])

  const getUser = async () => {
      console.log("Get User")
      const response = await fetch(`https://api.health-ify.works/api/auth/getUser`, {
        method: "GET",
        headers: {
            "auth-token": localStorage.getItem("token"),
        },
      });
      const data = await response.json();
      setUser(data);
  }

  return(
    <div>
        {!user ? (
            <div className="text-center">
                <Spinner animation="grow" size="xl"/>
                <Spinner animation="grow" size="xl"/>
                <Spinner animation="grow" size="xl"/>
                <Spinner animation="grow" size="xl"/>
            </div>
        ):
        (
            <div>
              <h2>{user.name}</h2>
              <HandExtChart data={user.handExtensions}/>
              <SquatChart data={user.squats}/>
            </div>
        )}
    </div>
  );
};

export default Profile;
