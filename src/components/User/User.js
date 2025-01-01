import React from 'react';
import Form from '../form/Form'; // Assuming Form.js is in the form directory
import { sendUserAuthRequest } from '../../api-helpers/api-helpers'; // Ensure the correct import
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { userAction } from '../../store'; // Ensure the correct import for userAction

const User = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onResReceived = (data) => {
        console.log("Response Data:", data);
        dispatch(userAction.setUser({ name: data.name, email: data.email })); // Update to set user details
        localStorage.setItem("userId", data.id);
        navigate("/"); // Redirect after successful login
    };

    const getData = (data) => {
        console.log("User Data", data);
        sendUserAuthRequest(data.inputs) // Call the correct function
            .then(onResReceived)
            .catch((err) => console.log(err));
    };

    return (
        <div>
            <Form onSubmit={getData} isUser={true} />
        </div>
    );
};

export default User;
