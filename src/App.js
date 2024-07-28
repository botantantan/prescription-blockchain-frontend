import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MenuBar from './components/MenuBar';
import Dashboard from './components/Dashboard';
import InitializeLedger from './components/InitializeLedger';
import CreatePrescription from './components/CreatePrescription';
import TerminatePrescription from './components/TerminatePrescription';
import FillPrescription from './components/FillPrescription';
import Notification from './components/Notification';
import { Snackbar, Alert } from '@mui/material';

const App = () => {
    const [message, setMessage] = useState(null);

    return (
        <Router>
            <div>
                <MenuBar />
                <Switch>
                    <Route exact path="/" render={() => <Dashboard setMessage={setMessage} />} />
                    <Route path="/initialize-ledger" render={() => <InitializeLedger setMessage={setMessage} />} />
                    <Route path="/create-prescription" render={() => <CreatePrescription setMessage={setMessage} />} />
                    <Route path="/terminate-prescription" render={() => <TerminatePrescription setMessage={setMessage} />} />
                    <Route path="/fill-prescription" render={() => <FillPrescription setMessage={setMessage} />} />
                </Switch>
                <Snackbar
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    open={!!message}
                    autoHideDuration={6000}
                    onClose={() => setMessage(null)}
                >
                    {message && (
                        <Alert onClose={() => setMessage(null)} severity={message.type}>
                            {message.text}
                        </Alert>
                    )}
                </Snackbar>
            </div>
        </Router>
    );
};

export default App;
