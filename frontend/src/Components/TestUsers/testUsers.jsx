const React = require("react");
import { useNavigate } from "react-router-dom";
import "./testUsers.css";

export const TestUsers = () => {
    const navigate = useNavigate();

    const handleRedirect = () => {
        navigate("/");
    }

    return (
        <div className="userWrapper">
            <button onClick={handleRedirect}>Home</button>

            <div className="users">
            <h1 id="list-of-all-test-users">List of all test users</h1>
                <ol>
                <li><p>Rachel Rogers</p>
                <ul>
                <li>estrella.dougl@yahoo.com</li>
                <li>Ke8Hi2rah</li>
                </ul>
                </li>
                <li><p>James Hibbler</p>
                <ul>
                <li>eddie1995@gmail.com</li>
                <li>Wee1okuora</li>
                </ul>
                </li>
                <li><p>Christina Kramer</p>
                <ul>
                <li>lexi2014@yahoo.com</li>
                <li>aeyof5OThei</li>
                </ul>
                </li>
                <li><p>John Kramer</p>
                <ul>
                <li>ilikepuzzles001@hotmail.com</li>
                <li>Gideon52?</li>
                </ul>
                </li>
                </ol>
            </div>
        </div>
    );
};