import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Sidebar from './components/Sidebar';
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
            <div style={{ display: 'flex' }}>
                <Sidebar />
                <main style={{ flexGrow: 1, padding: '20px', marginLeft: '240px' }}>
                    <Switch>
                        <Route exact path="/" render={() => <Dashboard setMessage={setMessage} />} />
                        <Route path="/initialize-ledger" render={() => <InitializeLedger setMessage={setMessage} />} />
                        <Route path="/create-prescription" render={() => <CreatePrescription setMessage={setMessage} />} />
                        <Route path="/terminate-prescription" render={() => <TerminatePrescription setMessage={setMessage} />} />
                        <Route path="/fill-prescription" render={() => <FillPrescription setMessage={setMessage} />} />
                    </Switch>
                    <Notification message={message} handleClose={() => setMessage(null)} />
                </main>
            </div>
        </Router>
    );
};

export default App;
