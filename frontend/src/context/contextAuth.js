import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useHistory } from "react-router-dom";

const contextAuthentication = createContext();
//Using djangos library create an authentication context variable

export default contextAuthentication

export const AuthenticationProvider = ({ children }) => {

    const [AuthenticationToken, setAuthenticationToken] = useState(() => 
        localStorage.getItem("AuthenticationToken") ?
            JSON.parse(localStorage.getItem("AuthenticationToken")) :
            null
    )
    //Authenticates the token and user data

    const [user, setUser] = useState(() => 
        localStorage.getItem("AuthenticationToken") ?
            jwtDecode(localStorage.getItem("AuthenticationToken")) :
            null
    )

    const [loading, setLoading] = useState(true)

    const history = useHistory()

    const login = async (email, password) => {
        const resp = await fetch("http://127.0.0.1:8000/api/token/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        })

        const data = await resp.json();


        if (resp.status === 200) {
            setAuthenticationToken(data);
            setUser(jwtDecode(data.access));
            localStorage.setItem("AuthenticationToken", JSON.stringify(data));
            history.push("/");
        } else {
            alert("Error while trying to log in! Try again.");
        }
    }
    //Login function that gets data passed, after sending request to server and responds with 200 OK a token is saved in localStorage and redirects to home page

    const register = async (email, username, password, passwordtwo) => {
        const resp = await fetch("http://127.0.0.1:8000/api/signup/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, username, password, passwordtwo })
        });

        if (resp.status === 201) {
            history.push("/login");
        } else {
            alert("Error when registering! Your password might be too simple or a user with same email already exists on the system!");
        }
    }

    //Register user passes information to backend, if 201 Created then redirects to login where they can input information else an error is returned

    const logout = () => {
        setAuthenticationToken(null);
        setUser(null);
        localStorage.removeItem("AuthenticationToken");
        history.push("/home");
    }
    //Logout will remove the token from the localstorage and redirect to home while taking away user only privelages

    const methods = {
        user,
        setUser,
        AuthenticationToken,
        setAuthenticationToken,
        register,
        login,
        logout,
    }

    useEffect(() => {
        if (AuthenticationToken) {
            setUser(jwtDecode(AuthenticationToken.access));
        }
        setLoading(false);
    }, [AuthenticationToken, loading])

    //Initializes the authentication state and loading status

    return (
        <contextAuthentication.Provider value={methods}>
            {loading ? null : children}
        </contextAuthentication.Provider>
    )

}

