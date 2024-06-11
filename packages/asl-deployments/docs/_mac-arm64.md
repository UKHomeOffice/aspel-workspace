# Notes for Apple Silicon (ARM) Macs

## asl-deployments:

`npm ci` will fail as there are no pre-built ARM binaries for `node-canvas` and it needs to be built from source.

Tooling will need to be installed:

```
brew install pkg-config cairo pango libpng jpeg giflib librsvg
npm ci
```



## selenium-standalone:

Needs Java. There is an arm-based jdk available in brew:

```
brew install openjdk
npm i -g selenium-standalone
selenium-standalone install
```
