const React = require("react");
const axios = require("axios");

const AuthContext = React.createContext(null);

export const AuthProvider = ({children}) => {
    const [loading, setLoading] = React.useState(true);
    const [user, setUser] = React.useState(null);

    const login = (userObject) => {
        (userObject) ? setUser(userObject) : setUser(null);
    };

    const logout = () => {
        return new Promise((resolve, reject) => {
            axios.delete("URL", {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            }).then(response => {
                setUser(null);
                resolve("User logged out");
            }, err => {
                console.error(err);
                reject("Could not log out user");
            });
        });
    };

    React.useEffect(() => {
        axios.get("https://api.syntaxiscs.com/portfolio/login-profile/users/authenticate", {
            headers: {
                "Content-Type": "application/json"
            },
            withCredentials: true
        }).then(response => {
            if (response.status === 200) {
                setUser(response.data);
                setLoading(false);
            } else {
                setLoading(false);
            }
        }, err => {
            console.log(err);
            setLoading(false);
        });
    }, []);

    return (
        <AuthContext.Provider value={{user, login, logout}}>
            {!loading && children}
        </AuthContext.Provider>
    )
};

export const useAuth = () => {
    return React.useContext(AuthContext);
}