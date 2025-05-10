// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

contract SimpleFund {
    struct Project {
        address creator;
        uint goal;
        uint deadline;
        uint totalFunds;
        string name;
        string description;
        bool[3] milestones;
        bool isClosed;
        mapping(address => uint) contributions;
    }
    
    // Store an array of project IDs created by each address
    mapping(uint => Project) public projects;
    uint public projectCount = 0;
    
    event ProjectCreated(uint projectId, address creator, uint goal, uint deadline);
    event FundsContributed(uint projectId, address contributor, uint amount);
    event MilestoneApproved(uint projectId, uint milestoneIndex);
    event FundsWithdrawn(uint projectId, address creator, uint amount);
    event RefundClaimed(uint projectId, address contributor, uint amount);
    
    // Create a new project
    function createProject(string memory _name, string memory _description, uint _goal, uint _deadline) external {
        require(_goal > 0, "Goal must be greater than 0");
        require(_deadline > block.timestamp, "Deadline must be in the future");
        
        uint projectId = projectCount;
        Project storage newProject = projects[projectId];
        
        newProject.creator = msg.sender;
        newProject.name = _name;
        newProject.description = _description;
        newProject.goal = _goal;
        newProject.deadline = _deadline;
        newProject.totalFunds = 0;
        newProject.isClosed = false;
        
        projectCount++;
        
        emit ProjectCreated(projectId, msg.sender, _goal, _deadline);
    }
    
    // Contribute funds to a project
    function contribute(uint _projectId) external payable {
        Project storage project = projects[_projectId];
        
        require(!project.isClosed, "Project is closed");
        require(block.timestamp <= project.deadline, "Project deadline has passed");
        require(msg.value > 0, "Contribution must be greater than 0");
        
        project.contributions[msg.sender] += msg.value;
        project.totalFunds += msg.value;
        
        emit FundsContributed(_projectId, msg.sender, msg.value);
    }
    
    // The owner approves a milestone (0, 1, or 2)
    function approveMilestone(uint _projectId, uint _milestoneIndex) external {
        Project storage project = projects[_projectId];
        
        require(msg.sender == project.creator, "Only creator can approve milestones");
        require(_milestoneIndex < 3, "Invalid milestone index");
        require(!project.milestones[_milestoneIndex], "Milestone already approved");
        
        // If previous milestone isn't approved, don't allow approving current one
        if (_milestoneIndex > 0) {
            require(project.milestones[_milestoneIndex - 1], "Previous milestone not approved");
        }
        
        project.milestones[_milestoneIndex] = true;
        
        emit MilestoneApproved(_projectId, _milestoneIndex);
        
        // After milestone approval, withdraw corresponding funds
        uint withdrawAmount;
        if (_milestoneIndex == 0) {
            // 25% for first milestone
            withdrawAmount = project.totalFunds * 25 / 100;
        } else if (_milestoneIndex == 1) {
            // 50% for second milestone
            withdrawAmount = project.totalFunds * 50 / 100;
        } else if (_milestoneIndex == 2) {
            // 25% for final milestone
            withdrawAmount = project.totalFunds * 25 / 100;
            project.isClosed = true;
        }
        
        if (withdrawAmount > 0) {
            payable(project.creator).transfer(withdrawAmount);
            emit FundsWithdrawn(_projectId, project.creator, withdrawAmount);
        }
    }
    
    // Contributors can claim refund if goal is not met and deadline has passed
    function claimRefund(uint _projectId) external {
        Project storage project = projects[_projectId];
        
        require(block.timestamp > project.deadline, "Deadline has not passed yet");
        require(!project.isClosed, "Project is closed");
        require(project.totalFunds < project.goal, "Cannot claim refund, goal was reached");
        
        uint contribution = project.contributions[msg.sender];
        require(contribution > 0, "No contribution found");
        
        project.contributions[msg.sender] = 0;
        payable(msg.sender).transfer(contribution);
        
        emit RefundClaimed(_projectId, msg.sender, contribution);
    }
    
    // View functions
    function getProjectDetails(uint _projectId) external view returns (
        address creator,
        string memory name,
        string memory description,
        uint goal,
        uint totalFunds,
        uint deadline,
        bool[3] memory milestones,
        bool isClosed
    ) {
        Project storage project = projects[_projectId];
        return (
            project.creator,
            project.name,
            project.description,
            project.goal,
            project.totalFunds,
            project.deadline,
            project.milestones,
            project.isClosed
        );
    }
    
    function getContribution(uint _projectId, address _contributor) external view returns (uint) {
        return projects[_projectId].contributions[_contributor];
    }
}
