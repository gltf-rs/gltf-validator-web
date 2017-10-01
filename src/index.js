const wasm = require('./main.rs')
import './style.css';

let validate_gltf = null;

let wasmPromise = wasm.initialize({noExitRuntime: true}).then(module => {
  // Create a Javascript wrapper around our Rust function
  validate_gltf = module.cwrap('validate_gltf', 'string', ['array', 'number'])
})

function validate_url(gltfUrl) {
  let content = document.getElementById("content");
  content.innerHTML = "";

  let baseUrl = [location.protocol, '//', location.host, location.pathname].join('')
  window.history.replaceState('', '', `${baseUrl}?${gltfUrl}` )

  let filename = gltfUrl.substring(gltfUrl.lastIndexOf('/')+1);
  appendToContent(`Downloading <a href="${gltfUrl}">${filename}</a> ...`)
  fetch(gltfUrl)
    .then(response => {
      if (response.ok) {
        return response.arrayBuffer()
      }
      throw new Error("Error: " + response.statusText)
    })
    .then(arrayBuffer => {
      let gltf_data = new Uint8Array(arrayBuffer);
      appendToContent(" done", false)

      let waited = false
      promiseState(wasmPromise).then(state => {
        if (state === 'pending') {
          appendToContent("Waiting for WebAssembly initialization to finish ...")
          waited = true;
        }
      })

      wasmPromise.then(() => {
        if (waited)
          appendToContent(" done", false)
        appendToContent("Validating glTF ...")
        try {
          let result = validate_gltf(gltf_data, gltf_data.length);
          appendToContent(" done. Result:", false)
          appendToContent(`<pre>${result}</pre>`)
        } catch (e) {
          appendToContent("Error calling into Rust: " + e, true, "red")
        }
      })

    })
    .catch(error => {
      appendToContent(error.message, true, 'red')
    })
}
window.validate_url = validate_url

function appendToContent(innerHTML, br=true, className="") {
  let el = document.createElement('span');
  el.innerHTML = innerHTML;
  el.className = className;
  let content = document.getElementById("content")
  if (br) {
    content.appendChild(document.createElement("p"))
  }
  content.appendChild(el)
}

window.addEventListener('load', () => {
  let url = location.search.substr(location.search.indexOf("?")+1);
  url = url || "https://raw.githubusercontent.com/gltf-rs/gltf/master/gltf-json/tests/minimal_accessor_invalid.gltf"

  validate_url(url)
});

// https://stackoverflow.com/a/35820220/2858790
function promiseState(p) {
  const t = {};
  return Promise.race([p, t])
    .then(v => (v === t)? "pending" : "fulfilled", () => "rejected");
}
