const wasm = require('./main.rs')
import './style.css';

let validate_gltf = null;

let wasmPromise = wasm.initialize({noExitRuntime: true}).then(module => {
  // Create a Javascript wrapper around our Rust function
  validate_gltf = module.cwrap('validate_gltf', 'string', ['array', 'number'])
})

function validate_url(gltfUrl) {
  let filename = gltfUrl.substring(gltfUrl.lastIndexOf('/')+1);
  appendToBody(`Downloading <a href="${gltfUrl}">${filename}</a> ...`)
  fetch(gltfUrl)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => {
      console.log("... received glTF data")
      let gltf_data = new Uint8Array(arrayBuffer);

      console.log("waiting for WASM module to be ready")
      wasmPromise.then(() => {
        console.log("validating...")
        let result = validate_gltf(gltf_data, gltf_data.length);
        appendToBody(`<pre>${result}</pre>`)
        console.log("... done")
      })

    })
}

function appendToBody(innerHTML) {
  let el = document.createElement('div');
  el.innerHTML = innerHTML;
  document.body.appendChild(el)
}

window.addEventListener('load', () => {
  // let url = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Box/glTF-Binary/Box.glb"
  // let url = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Box/glTF/Box.gltf"
  let url = "https://raw.githubusercontent.com/gltf-rs/gltf/master/gltf-json/tests/minimal_accessor_invalid.gltf"
  validate_url(url)
});
