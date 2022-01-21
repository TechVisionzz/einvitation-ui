import "antd/dist/antd.css";
import "./App.css";
import { withRouter } from "react-router";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import "./css/LogIn.css";
import LogIn from "./components/LogIn";
import SignUp from "./components/SignUp";
import { isLoggedIn } from "./components/CommonHelper";
import DashBoard from "./components/DashBoard";
import AttendeeDashBoard from "./components/AttendeeDashBoard";
import ReceiverDashBoard from "./components/ReceiverDashBoard";
import NewContactList from "./components/NewContactList";
import EventDashBoard from "./components/EventDashBoard";
import EditEvent from "./components/EditEvent";
import { GlobalVars } from "./global/global";
import PublicEventsDashboard from "./components/PublicEventsDashboard";
function SecureRoute(props: any) {
  return (
    <Route
      path={props.path}
      render={(data) =>
        isLoggedIn() ? (
          <props.component {...data}></props.component>
        ) : (
          <Redirect to={{ pathname: "/" }}></Redirect>
        )
      }
    ></Route>
  );
}
function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/signup" component={SignUp} />
          {/* <Route
            path={`/dashboard/publicEvent/940f1589-a4e0-47d4-ab29-bd50442247c2`}
            component={PublicEventsDashboard}
          /> */}
          <SecureRoute path="/dashboard" component={DashBoard} />
          <SecureRoute
            path="/attendeedashboard"
            component={AttendeeDashBoard}
          />
          <SecureRoute path="/editContactlist" component={NewContactList} />
          <SecureRoute
            path="/receiverdashboard"
            component={ReceiverDashBoard}
          />
          <SecureRoute path="/eventDashboard" component={EventDashBoard} />
          <Route exact path="/" component={LogIn} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
