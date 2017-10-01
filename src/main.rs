use std::os::raw::c_char;
use std::ffi::CString;

extern crate gltf;
use gltf::{Glb, Gltf};

fn main() {}

#[no_mangle]
pub fn validate_gltf(gltf_data: *const u8, len: i32) -> *mut c_char {
    let gltf_data: &[u8] = unsafe { std::slice::from_raw_parts(gltf_data, len as usize) };

    // TODO!: handle all unwraps
    // TODO!: validate_binary: https://github.com/gltf-rs/gltf/blob/master/gltf-importer/src/lib.rs#L200-L218
    let unvalidated =
        if gltf::is_binary(gltf_data) {
            let glb = Glb::from_slice(gltf_data).unwrap();
            Gltf::from_glb(&glb).unwrap()
        } else {
            Gltf::from_slice(&gltf_data).unwrap()
        };

    let gltf = unvalidated.validate_completely();

    let message = format!("{:#?}", gltf);
    CString::new(message.as_str()).unwrap().into_raw()
}
