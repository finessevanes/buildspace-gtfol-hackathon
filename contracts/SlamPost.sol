// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract SlamPost {
    uint256 totalPosts;

    event NewPost(
        uint256 index,
        address indexed from,
        string message,
        uint256 timestamp,
        uint256 voteCount
    );

    struct Post {
        uint256 index;
        address poster; // The address of the user who posted.
        string message; // The message the user sent.
        uint256 timestamp; // The timestamp when the user posted.
        uint256 voteCount;
    }

    struct Voter {
        uint256 voted_on;
        bool voted;
    }

    Post[] posts;

    mapping(address => Voter) public voters;

    constructor() {
        console.log("Slam Post has been deployed");
    }

    function post(string memory _message) public {
        console.log("%s post w/ message %s", msg.sender, _message);

        posts.push(Post(totalPosts, msg.sender, _message, block.timestamp, 0));

        emit NewPost(totalPosts, msg.sender, _message, block.timestamp, 0);
        totalPosts += 1;
    }

    function getAllPosts() public view returns (Post[] memory) {
        return posts;
    }

    function getTotalPosts() public view returns (uint256) {
        return totalPosts;
    }

    function upVote(uint256 ideaIndex) public {
        console.log('upVote ideaIndex');

        Voter storage sender = voters[msg.sender];
        require(!sender.voted, "Has voted.");
        require(ideaIndex < posts.length, "IdeaIndex does not exist");
        sender.voted = true;
        console.log('sender.voted_on', sender.voted_on);
        sender.voted_on = ideaIndex;

        for (uint i = 0; i < posts.length; i++) {
            if (i == ideaIndex) {
                posts[i].voteCount++;
            }
        }
    }

    function downVote(uint256 ideaIndex) public {
        console.log('downVote ideaIndex');
        
        Post memory userVoted = userVotedOn();

        Voter storage sender = voters[msg.sender];
        require(sender.voted, "Has not voted.");
        console.log('sender.voted_on', sender.voted_on);
        require(sender.voted_on == userVoted.index);
        require(ideaIndex < posts.length, "IdeaIndex does not exist");

        sender.voted = false;
        sender.voted_on = ideaIndex;

        for (uint i = 0; i < posts.length; i++) {
            if (i == ideaIndex) {
                posts[i].voteCount--;
            }
        }
    }

    function userVotedOn() public view returns (Post memory) {
        require(voters[msg.sender].voted, "Has not voted");
        Post memory result;

        for (uint i = 0; i < posts.length; i++) {
            if (voters[msg.sender].voted_on == i) {
                result = posts[i];
                break;
            }
        }

        return result;
    }
}
