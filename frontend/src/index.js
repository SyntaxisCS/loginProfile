const React = require("react");
const ReactDOM = require("react-dom");
const {BrowserRouter, Routes, Route} = require("react-router-dom");

// Utils
import {AuthProvider} from "./Utils/Auth/auth";
import {RequireAuth} from "./Utils/Auth/requireAuth";
import "./index.css";

// Pages
import {LoginPage} from "./Pages/login";
import {ProfilePage} from "./Pages/profile";
import {TestUserPage} from "./Pages/testUsers";

ReactDOM.render((
    <AuthProvider>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage/>}/>
                <Route path="/test-users" element={<TestUserPage/>}/>
                <Route path="/profile" element={<RequireAuth><ProfilePage/></RequireAuth>}/>
            </Routes>
        </BrowserRouter>
    </AuthProvider>
), document.getElementById("root"));