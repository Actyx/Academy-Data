// [[start:import-bootstrap]]
// default imports
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Pond } from '@actyx-contrib/react-pond'
import { App } from './App'
import manifest from './manifest'

// add bootstrap CSS
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'
// [[end:import-bootstrap]]

const onError = () => {
  setTimeout(() => location.reload(), 2500)
  return <div>Failed to connect to Actyx</div>
}

ReactDOM.render(
  <React.StrictMode>
    <Pond
      manifest={manifest}
      loadComponent={<div>Connecting to Actyx</div>}
      onError={onError}
    >
      <App />
    </Pond>
  </React.StrictMode>,
  document.getElementById('root'),
)
