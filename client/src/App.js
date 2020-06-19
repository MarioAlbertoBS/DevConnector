import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";

import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Alert from "./components/layout/Alert";
import Dashboard from "./components/dashboard/Dashboard";
import PrivateRoute from "./components/routing/PrivateRoute";
import CreateProfile from "./components/profile-forms/CreateProfile";
import Profile from "./components/profile/Profile";
import EditProfile from "./components/profile-forms/EditProfile";
import AddExperience from "./components/profile-forms/AddExperience";
import AddEducation from "./components/profile-forms/AddEducation";
import EditExperience from "./components/profile-forms/EditExperience";
import EditEducation from "./components/profile-forms/EditEducation";
import Profiles from "./components/profiles/Profiles";
import Posts from "./components/posts/Posts";

//Redux
import { Provider } from "react-redux";
import store from "./store";
import { loadUser } from "./actions/auth";
import setAuthToken from "./utils/setAuthToken";

if (localStorage.token) {
    setAuthToken(localStorage.token);
}

const App = () => {
    useEffect(() => {
        store.dispatch(loadUser());
    }, []);

    return (
        <Provider store={store}>
            <Router>
                <Navbar />
                <Route exact path="/" component={Landing} />
                <section style={{ marginTop: "6rem" }}>
                    <Alert />
                </section>
                <Switch>
                    <Route exact path="/register" component={Register} />
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/profiles" component={Profiles} />
                    <Route exact path="/profile/:id" component={Profile} />
                    <PrivateRoute
                        exact
                        path="/dashboard"
                        component={Dashboard}
                    />
                    <PrivateRoute
                        exact
                        path="/create-profile"
                        component={CreateProfile}
                    />
                    <PrivateRoute
                        exact
                        path="/edit-profile"
                        component={EditProfile}
                    />
                    <PrivateRoute
                        exact
                        path="/add-experience"
                        component={AddExperience}
                    />
                    <PrivateRoute
                        exact
                        path="/add-education"
                        component={AddEducation}
                    />
                    <PrivateRoute
                        exact
                        path="/edit-experience/:index"
                        component={EditExperience}
                    />
                    <PrivateRoute
                        exact
                        path="/edit-education/:index"
                        component={EditEducation}
                    />
                    <PrivateRoute exact path="/posts" component={Posts} />
                </Switch>
            </Router>
        </Provider>
    );
};

export default App;
