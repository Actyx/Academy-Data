[[start:axp-setup]]
$ npm install -g @actyx-contrib/axp
/usr/local/bin/axp -> /usr/local/lib/node_modules/@actyx-contrib/axp/bin/axp
+ @actyx-contrib/axp@1.4.0
added 41 packages from 35 contributors in 2.817s
$ axp --version
Actyx Project tool V:1.4.0
[[end:axp-setup]]

[[start:scaffold]]
$ mkdir my-project
$ cd my-project
$ axp init
     _        _                ____            _           _
    / \   ___| |_ _   ___  __ |  _ \ _ __ ___ (_) ___  ___| |_
   / _ \ / __| __| | | \ \/ / | |_) | '__/ _ \| |/ _ \/ __| __|
  / ___ \ (__| |_| |_| |>  <  |  __/| | | (_) | |  __/ (__| |_
 /_/   \_\___|\__|\__, /_/\_\ |_|   |_|  \___// |\___|\___|\__|
                  |___/                     |__/

✅ Setup git
✅ Setup npm project
✅ Setup TS config
done
[[end:scaffold]]

[[start:project-contents]]
.
├── node_modules
├── package-lock.json
├── package.json
├── src/
│   └── fish/
│       └── index.ts
└── tsconfig.json
[[end:project-contents]]


 [[start:add-node]]
 $ axp add node --appName machine-mock
     _        _                ____            _           _
    / \   ___| |_ _   ___  __ |  _ \ _ __ ___ (_) ___  ___| |_
   / _ \ / __| __| | | \ \/ / | |_) | '__/ _ \| |/ _ \/ __| __|
  / ___ \ (__| |_| |_| |>  <  |  __/| | | (_) | |  __/ (__| |_
 /_/   \_\___|\__|\__, /_/\_\ |_|   |_|  \___// |\___|\___|\__|
                  |___/                     |__/

Create a new NodeJS project with TypeScript
✅ Create template
✅ Add Actyx manifest
✅ Install dependencies
✅ Install dev dependencies
✅ Add project to package.json
done
[[end:add-node]]

[[start:node-app-contents]]
src/machine-mock
├── index.ts
└── manifest.json
[[end:node-app-contents]]
