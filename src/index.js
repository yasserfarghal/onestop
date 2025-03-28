// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import App from './App';
import { store, persistor } from './redux/store'; // Import store and persistor
import { PersistGate } from 'redux-persist/integration/react';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ToastContainer
            position="top-right"
            autoClose={1000}
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover={false}
            theme="light"
          />
          <App />
        </PersistGate>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
