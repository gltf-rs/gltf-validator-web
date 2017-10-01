# gltf-validator-web
Highly experimental glTF validator written in Rust and compiled to WebAssembly.
Setup based on [rust-wasm-webpack-template](https://github.com/bwasty/rust-wasm-webpack-template).

[Live Demo](https://gltf-rs.github.io/gltf-validator-web/) (check console if nothing happens)

## Development
* set up Rust and Emscripten for compiling to WebAssembly, for example using the beginning of [this](https://medium.com/@ianjsikes/get-started-with-rust-webassembly-and-webpack-58d28e219635) guide.
* `npm install`
* `npm run start` (builds and starts dev server)
* open http://localhost:8080 (or use `npm run start -- --open`)
* change the Rust or JavaScript code and watch the browser reload after a few seconds
  - incremental compilation is recommended (`CARGO_INCREMENTAL=1`)

### Production build
Use `npm run build` to generate an optimized build in the `dist` folder (compiling the Rust code in release mode and using UglifyJS for minifying the JavaScript code). To deploy to GitHub pages use `npm run deploy`.
