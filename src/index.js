import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import '@material/web/button/filled-button.js'
import '@material/web/button/outlined-button.js'
import '@material/web/checkbox/checkbox.js'
import store from './state/store'
import { Provider } from 'react-redux'
import { FPSProvider } from './state/FPSContext'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <FPSProvider>
      <Provider store={store}>
        <App/>
      </Provider>
    </FPSProvider>
  </React.StrictMode>
) 

