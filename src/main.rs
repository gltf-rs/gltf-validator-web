use std::os::raw::c_char;
use std::ffi::CString;

extern crate gltf;
use gltf::{Glb, Gltf};

fn main() {
}

#[no_mangle]
pub fn validate_gltf(glb_data: *const u8, len: i32) -> *mut c_char {
	let glb_data: &[u8] = unsafe {
		std::slice::from_raw_parts(glb_data, len as usize)
	};

	let glb = Glb::from_slice(glb_data).unwrap();
	let unvalidated = Gltf::from_glb(&glb).unwrap();
	let gltf = unvalidated.validate_completely();

	let message = format!("{:#?}", gltf);
    CString::new(message.as_str())
		.unwrap()
		.into_raw()
}
