// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;

    /*
     * A little magic, Google what events are in Solidity!
     */
    event NewWave(
        uint256 index;
        address indexed from,
        string message,
        uint256 timestamp,
        uint256 voteCount
    );

    /*
     * I created a struct here named Wave.
     * A struct is basically a custom datatype where we can customize what we want to hold inside it.
     */
    struct Wave {
        uint256 index;
        address waver; // The address of the user who waved.
        string message; // The message the user sent.
        uint256 timestamp; // The timestamp when the user waved.
        uint256 voteCount;
    }

    struct Voter {
        uint256 voted_on;
        bool voted;
    }

    /*
     * I declare a variable waves that lets me store an array of structs.
     * This is what lets me hold all the waves anyone ever sends to me!
     */
    Wave[] waves;

    // A map to easily access Voter details
    mapping(address => Voter) public voters;

    constructor() {
        console.log("I AM SMART CONTRACT. POG.");
    }

    /*
     * You'll notice I changed the wave function a little here as well and
     * now it requires a string called _message. This is the message our user
     * sends us from the frontend!
     */
    function wave(string memory _message) public {
        console.log("%s waved w/ message %s", msg.sender, _message);

        /*
         * This is where I actually store the wave data in the array.
         */
        waves.push(Wave(totalWaves, msg.sender, _message, block.timestamp, 0));
        
        /*
         * I added some fanciness here, Google it and try to figure out what it is!
         * Let me know what you learn in #general-chill-chat
         */
        emit NewWave(totalWaves, msg.sender, _message,  block.timestamp, 0);
        totalWaves += 1;
        
    }

    /*
     * I added a function getAllWaves which will return the struct array, waves, to us.
     * This will make it easy to retrieve the waves from our website!
     */
    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        // Optional: Add this line if you want to see the contract print the value!
        // We'll also print it over in run.js as well.
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }

    function vote(uint256 ideaIndex) public {
        Voter storage sender = voters[msg.sender];
        require(!sender.voted, "Has voted.");
        require(ideaIndex < waves.length, "IdeaIndex does not exist");
        sender.voted = true;
        sender.voted_on = ideaIndex;

        for (uint i = 0; i < waves.length; i++) {
            if (i == ideaIndex) {
                waves[i].voteCount++;
            }
        }
    }

    function unvote(uint256 ideaIndex) public {
        Wave memory userVoted = userVotedOn();

        Voter storage sender = voters[msg.sender];
        require(sender.voted, "Has not voted.");
        require(voters.voted_on != userVoted.index);
        require(ideaIndex < waves.length, "IdeaIndex does not exist");
        
        sender.voted = false;
        sender.voted_on = ideaIndex;

        for (uint i = 0; i < waves.length; i++) {
            if (i == ideaIndex) {
                waves[i].voteCount--;
            }
        }
    }

    function userVotedOn() public view returns (Wave memory) {
        require(voters[msg.sender].voted, "Has not voted");
        Wave memory result;

        for (uint i = 0; i < waves.length; i++) {
            if (voters[msg.sender].voted_on == i) {
                result = waves[i];
                break;
            }
        }

        return result;
    }
}
