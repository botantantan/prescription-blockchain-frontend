import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MenuBar from './components/MenuBar';
import Dashboard from './components/Dashboard';
import InitializeLedger from './components/InitializeLedger';
import CreatePrescription from './components/CreatePrescription';
import TerminatePrescription from './components/TerminatePrescription';
import FillPrescription from './components/FillPrescription';
import Notification from './components/Notification';

const App = () => {
    const [message, setMessage] = useState(null);

    return (
        <Router>
            <div>
                <MenuBar />
                <Notification message={message} />
                <Switch>
                    <Route exact path="/" component={Dashboard} />
                    <Route path="/initialize-ledger" component={InitializeLedger} />
                    <Route path="/create-prescription" component={CreatePrescription} />
                    <Route path="/terminate-prescription" component={TerminatePrescription} />
                    <Route path="/fill-prescription" component={FillPrescription} />
                </Switch>
            </div>
        </Router>
    );
};

export default App;
