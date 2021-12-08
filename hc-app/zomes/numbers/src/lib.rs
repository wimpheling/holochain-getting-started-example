use hdk::prelude::*;

#[derive(Serialize, Deserialize, SerializedBytes, Debug, Clone)]
pub struct ZomeInput {
    pub original_number: i32,
}

// data we want back from holochain
#[derive(Serialize, Deserialize, SerializedBytes, Debug, Clone)]
pub struct ZomeOutput {
    pub other_number: i32,
}

#[hdk_extern]
pub fn add_ten(input: ZomeInput) -> ExternResult<ZomeOutput> {
    Ok(ZomeOutput {
      other_number: input.original_number + 10
    })
}
