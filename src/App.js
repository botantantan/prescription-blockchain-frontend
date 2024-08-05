import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import InitializeLedger from './components/InitializeLedger';
import CreatePrescription from './components/CreatePrescription';
import TerminatePrescription from './components/TerminatePrescription';
import FillPrescription from './components/FillPrescription';
import Notification from './components/Notification';
import LoginPage from './components/LoginPage';
import { Snackbar, Alert } from '@mui/material';

const App = () => {
  const [message, setMessage] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={props =>
        localStorage.getItem('token') ? (
          <Component {...props} setMessage={setMessage} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );

  return (
    <Router>
      <div style={{ display: 'flex' }}>
        <Sidebar handleLogout={handleLogout} />
        <main style={{ flexGrow: 1, padding: '20px', marginLeft: '240px' }}>
          <Switch>
            <Route exact path="/" render={() => <Redirect to="/login" />} />
            <Route path="/login" render={() => <LoginPage setMessage={setMessage} />} />
            <PrivateRoute path="/dashboard" component={Dashboard} />
            <PrivateRoute path="/initialize-ledger" component={InitializeLedger} />
            <PrivateRoute path="/create-prescription" component={CreatePrescription} />
            <PrivateRoute path="/terminate-prescription" component={TerminatePrescription} />
            <PrivateRoute path="/fill-prescription" component={FillPrescription} />
          </Switch>
          <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            open={!!message}
            autoHideDuration={3000}
            onClose={() => setMessage(null)}
          >
            {message && (
              <Alert onClose={() => setMessage(null)} severity={message.type}>
                {message.text}
              </Alert>
            )}
          </Snackbar>
        </main>
      </div>
    </Router>
  );
};

export default App;
