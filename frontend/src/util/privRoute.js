import { Route, Redirect } from "react-router-dom";
import { useContext } from "react";
import contextAuthentication from "../context/contextAuth";

const PrivRoute = ({ children, ...rest }) => {

    const { user } = useContext(contextAuthentication);

    return (

        <Route {...rest}>

            {!user ? <Redirect to="/login" /> : children}

        </Route>

    );

    //Security measure, user tring to access user only features through url will be rejected and redirected to login page
    //Is user trying to access isnt authorized then redirected
    
};

export default PrivRoute;
