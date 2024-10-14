// Import necessary libraries
use borsh::{BorshDeserialize, BorshSerialize}; // For serialization
use solana_program::{
    account_info::{next_account_info, AccountInfo}, // For account handling
    entrypoint, // For defining the program entry point
    entrypoint::ProgramResult, // Result type for the entry point
    msg, // For logging messages
    pubkey::Pubkey, // Public key type
    program_error::ProgramError, // Error type
};

// Struct to represent a user's Proof of Like
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct ProofOfLike {
    pub wallet: Pubkey,       // Wallet address of the user
    pub artist_name: String,  // Name of the artist liked
    pub song_id: String,      // ID of the song liked
    pub timestamp: u64,       // When the like was made
    pub rawvibe_created: bool, // Has a RawVibe card been created?
}

// Struct to track user vibes
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct UserVibes {
    pub vibes_used: u8,              // Number of vibes (likes) used (maximum 3)
    pub proof_of_likes: Vec<ProofOfLike>, // List of Proofs of Likes
}

// Define the entry point of the program
entrypoint!(process_instruction);

// Main function to process incoming instructions
pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8], // Data containing the song ID, artist name, etc.
) -> ProgramResult {
    // Get the user's account info
    let account_info_iter = &mut accounts.iter();
    let user_account = next_account_info(account_info_iter)?;

    // Deserialize user data or create a new user with no vibes used
    let mut user_vibes = if user_account.data_len() > 0 {
        UserVibes::try_from_slice(&user_account.data.borrow())?
    } else {
        UserVibes {
            vibes_used: 0, // Start with 0 vibes used
            proof_of_likes: vec![], // No Proofs of Likes initially
        }
    };

    // Check if the user has already used all 3 vibes
    if user_vibes.vibes_used >= 3 {
        return Err(ProgramError::Custom(0)); // Custom error: All vibes used
    }

    // Parse the instruction data (song ID, artist name, timestamp)
    let instruction_str = std::str::from_utf8(instruction_data)
        .map_err(|_| ProgramError::InvalidInstructionData)?;

    let parts: Vec<&str> = instruction_str.split(',').collect();
    if parts.len() != 3 {
        return Err(ProgramError::InvalidInstructionData); // Invalid data format
    }

    let song_id = parts[0].to_string(); // Extract song ID
    let artist_name = parts[1].to_string(); // Extract artist name
    let timestamp: u64 = parts[2].parse().map_err(|_| ProgramError::InvalidInstructionData)?; // Extract timestamp

    // Log the like action
    msg!("User liked song: {} by {}", song_id, artist_name);

    // Create a new Proof of Like and add it to the user's record
    let proof_of_like = ProofOfLike {
        wallet: *user_account.key, // User's wallet address
        artist_name,
        song_id,
        timestamp,
        rawvibe_created: false, // RawVibe card not created yet
    };

    user_vibes.proof_of_likes.push(proof_of_like); // Add to the user's Proof of Likes
    user_vibes.vibes_used += 1; // Increment the vibes used

    // Serialize updated user data back to the account
    user_vibes.serialize(&mut &mut user_account.data.borrow_mut()[..])?;

    Ok(())
}

// Function to handle RawVibe card creation
pub fn create_rawvibe(
    accounts: &[AccountInfo],
    _program_id: &Pubkey,
) -> ProgramResult {
    // Get the user's account info
    let account_info_iter = &mut accounts.iter();
    let user_account = next_account_info(account_info_iter)?;

    // Deserialize the user's data
    let mut user_vibes = UserVibes::try_from_slice(&user_account.data.borrow())?;

    // Check if the last Proof of Like has already been used to create a RawVibe card
    let last_proof = user_vibes
        .proof_of_likes
        .last_mut()
        .ok_or(ProgramError::Custom(1))?; // Custom error: No likes found

    if last_proof.rawvibe_created {
        return Err(ProgramError::Custom(2)); // Custom error: RawVibe already created
    }

    // Mint the RawVibe card (implement your minting logic here)
    msg!("Minting RawVibe card for song: {}", last_proof.song_id);

    // Mark the RawVibe card as created
    last_proof.rawvibe_created = true;

    // Serialize the updated data back to the user's account
    user_vibes.serialize(&mut &mut user_account.data.borrow_mut()[..])?;

    Ok(())
}
