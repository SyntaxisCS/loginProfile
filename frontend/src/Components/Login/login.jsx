const React = require("react");
const axios = require("axios");
import {useAuth} from "../../Utils/Auth/auth";
import {useNavigate} from "react-router-dom";
import "./login.css";

export const Login = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const [logInState, setLogInState] = React.useState({email:"",password:"",attempts:0});
    const [passwordState, setPasswordState] = React.useState({h:true,i:true});
    const [formError, setFormError] = React.useState("");

    const handleInputChange = (event) => {
        let target = event.target;
        let newEdit = {...logInState};
        newEdit[target.name] = target.value;

        setLogInState(newEdit);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        prepareInputs().then(inputs => {
            apiCall(inputs);
        }, err => {
            switch(err) {
                case "empty":
                    setFormError("Please make sure all fields are filled in");
                break;
                case "email":
                    setFormError("Please make sure you typed in a valid email");
                break;
                case "password":
                    setFormError("Password must be 8 characters or more, have at least 1 capital letter, 1 lowercase, 1 number, and may include a special character");
                break;
            }
        });
    };

    const handlePassword = () => {
        if (passwordState.h) {
            let newEdit = {...passwordState};
            newEdit.h = false;
            newEdit.i = false;
            setPasswordState(newEdit);
        } else {
            let newEdit = {...passwordState};
            newEdit.h = true;
            newEdit.i = true;
            setPasswordState(newEdit);
        }
    };

    const handleLogin = (user) => {
        auth.login(user);
        navigate("/profile");
    };

    const handleRedirect = () => {
        navigate("/test-users");
    };

    const prepareInputs = async () => {
        return new Promise((resolve, reject) => {
            let email = logInState.email;
            let password = logInState.password;

            if (email.trim() != "" && password.trim() != "") {
                if (formError != "") {
                    clearError();
                }
                const emailPattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
                const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

                let finishedInputs = {email:null,password:null};

                let emailMatch = email.match(emailPattern);
                if (emailMatch) {
                    finishedInputs.email = emailMatch[0];
                } else {
                    reject("email");
                }
                let passwordMatch = password.match(passwordPattern);
                if (passwordMatch) {
                    finishedInputs.password = passwordMatch[0];
                } else {
                    reject("password");
                }

                if (finishedInputs.email && finishedInputs.password) {
                    resolve(finishedInputs); // endpoint
                }
            } else {
                reject("empty");
            }
        });
    };

    const apiCall = (inputs) => {
        let callBody = {
            username: inputs.email,
            password: inputs.password
        };

        axios.post("https://api.syntaxiscs.com/portfolio/login-profile/users/login", callBody, {
            headers: {
                "Content-Type": "application/json"
            },
            withCredentials: true
        }).then(response => {
            clearError();
            handleLogin(response.data);
        }, err => {
            console.log(err);
            let errResponse = err.response;
            if (errResponse.status === 401) {
                setFormError("Password is incorrect!");
            } else if (errResponse.status === 500) {
                setFormError("We could not find a user with the email provided");
            } else {
                console.error(err);
                setFormError("There was a server error! Please try again later. Sorry for the inconvience.");
            }
        });
    };

    const clearError = () => {
        setFormError("");
    };

    return (
        <div className="loginFormWrapper">
            <button onClick={handleRedirect} className="testUserBtn">Click to see test users</button>
            <form className="loginForm" onSubmit={handleSubmit}>
                <input type="text" name="email" placeholder="email" onChange={handleInputChange}/>

                <div className="passwordContainer">
                    <input type={passwordState.h ? "password" : "text"} name="password" placeholder="password" onChange={handleInputChange}/>
                    <i className={`bx bx-${passwordState.i ? "hide" : "show-alt"}`} onClick={handlePassword}/>    
                </div>

                {formError != "" ? <p className="errorText">{formError}</p> : <p style={{display:"none"}}>ErrorText</p>}
                <button type="submit" className="submitBtn">Login</button>
            </form>
        </div>
    )
}