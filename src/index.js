const wasm = require('./main.rs')

wasm.initialize({noExitRuntime: true}).then(module => {
  // Create a Javascript wrapper around our Rust function
  const validate_gltf = module.cwrap('validate_gltf', 'string', ['array', 'number'])

  let url = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Box/glTF-Binary/Box.glb"
  console.log("fetching ", url)
  fetch(url)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => {
      console.log("parsing and validating...")
      let glb_data = new Uint8Array(arrayBuffer);
      let result = validate_gltf(glb_data, glb_data.length);
      document.body.innerHTML =
        `<pre style="white-space: pre-wrap; word-break: keep-all;">${result}</pre>`;
      console.log("...done")
    })
})
