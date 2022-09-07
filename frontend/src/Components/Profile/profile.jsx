const React = require("react");
const axios = require("axios");
import { useAuth } from "../../Utils/Auth/auth";
import {useNavigate} from "react-router-dom";
import "./profile.css";

export const Profile = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    
    const getUserInfo = async (id) => {
        // getuser and replace user object
        axios.get(`https://api.syntaxiscs.com/portfolio/login-profile/users/${id}`, {
            header: {
                "Content-Type": "application/json"
            },
            withCredentials: true
        }).then(response => {
            setUser(response.data.user);
            setLoading(false);
        }, err => {
            console.error(err);
        });
    };

    const handleLogout = () => {
        axios.delete("https://api.syntaxiscs.com/portfolio/login-profile/users/logout", {
            header: {
                "Content-Type": "application/json"
            },
            withCredentials: true
        }).then(response => {
            // do nothing
        }, err => {
            console.error(err);
        });
        navigate("/");
    };

    React.useEffect(() => {
        if (auth.user) {
            getUserInfo(auth.user.id);
        } else {
            navigate("/");
        }
    }, []);

    return (
        <div className="profileWrapper">
            {loading ? <a style={{display:"none"}}/> : 
            <div className="profile">
                <h1 className="name">{user.name ? user.name : "unknown"}</h1>
                <p>{user.email ? user.email : "unknown"}</p>
                <p>On Server Password: {user.password ? user.password : "unknown"}</p>
                <p>Age {user.age ? user.age : "unknown"}</p>
                <p>{`Lives at ${user.address ? user.address : "unknown"} in ${user.city ? user.city : "unknown"}`}</p>
                <p>Social Security Number: {user.ssn ? user.ssn : "unkown"}</p>
            </div>
            }
            <button onClick={handleLogout} className="logoutBtn">Logout</button>
        </div>
    );
};