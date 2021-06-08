import * as React from 'react'

export const App = (): JSX.Element => {
  return (
    <div style={{ margin: '120px auto', width: 400 }}>
      <img src="https://raw.githubusercontent.com/actyx-contrib/react-pond/master/icon.png?token=AATHWQIC5RWS62GY3OINH3C645MHQ" />
      <h1>Start something awesome!</h1>
      <h4>Help and examples:</h4>
      <ul>
        <li>
          <a href="https://developer.actyx.com/blog/2020/06/22/react-pond">
            react-pond - Introduction
          </a>
        </li>
        <li>
          <a href="https://developer.actyx.com/docs/pond/getting-started">Pond - getting-started</a>
        </li>
        <li>
          <a href="https://developer.actyx.com/docs/pond/guides/hello-world">
            Guides - hello-world
          </a>
        </li>
      </ul>
    </div>
  )
}
