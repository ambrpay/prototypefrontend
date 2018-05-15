pragma solidity ^0.4.18;

contract SubscriptionWallet {
    address public owner;

    //Subscriptions on the wallet
    mapping (address => Subscription) subscriptions;
    //Subscription issuers that are active on the wallet
    address[] subscriptionIssuers;



    struct Subscription {
        uint cycleStart; //start of the subscription cycle
        uint subscriptionTimeFrame; //Length of the subscription (1 Month ususally)
        uint maxAmount; //Max amount that can be withdrawn in one timeframe
        uint withdrawnAmount; //Amount that has been withdrawn so far this timeframe
        bool approved; // true if the subscription is active
        bool exists; //to see if the subscription exists. (needed for tech workaround)
    }

     //creator
    function SubscriptionWallet() public {
        owner = msg.sender; //setting the wallet owner
    }


    //adding a subscription to this wallet.
    function addSubscription (address _issuer,
                            uint _subscriptionTimeFrame,
                            uint _maxAmount) public returns(bool)
    {
        //var exists = subscriptions[_issuer].exists;
        var newSub = subscriptions[_issuer];
        newSub.cycleStart = block.timestamp;
        newSub.subscriptionTimeFrame = _subscriptionTimeFrame;
        newSub.maxAmount = _maxAmount;
        newSub.withdrawnAmount = 0;
        newSub.approved = true;
        newSub.exists = true;

        subscriptionIssuers.push(_issuer);
        return true;
    }

    //getting all subscription issuers that were added to this wallet.
    function getSubscriptionIssuers() view public returns(address[]) {
        return subscriptionIssuers;
    }
    //getting the data of a specific subscription.
    function getSubscrition(address _issuer) view public returns(uint,uint,uint,uint,bool) {
        var s = subscriptions[_issuer];
        return (
        s.cycleStart,
        s.subscriptionTimeFrame,
        s.maxAmount,
        s.withdrawnAmount,
        s.approved);
    }

    //avtivate a subscription
    function activateSubscription(address _issuer) public {
        subscriptions[_issuer].approved = true;
    }

    //deactivate a subscription
    function deactivateSubscription(address _issuer) public {
        subscriptions[_issuer].approved = false;
    }


    //letting the issuer withdraw funds from this wallet
    // but only if: the subscription is active
    // and the funds are no exeeded this timeframe.
    // this is called by the ambr backend.
    function withdrawForSubscription(uint amount) public {

        var s =  subscriptions[msg.sender];
        require(s.approved);

        //put into modifier https://www.youtube.com/watch?v=HGw-yalqdgs
        if(s.cycleStart+s.subscriptionTimeFrame<block.timestamp) {
            subscriptions[msg.sender].cycleStart = block.timestamp;
            subscriptions[msg.sender].withdrawnAmount = 0;
        }

        require(s.maxAmount>=amount+s.withdrawnAmount);
        subscriptions[msg.sender].withdrawnAmount+= amount;
        require(msg.sender.send(amount));
    }


    function removeSubscription (address _issuer) public {
        delete subscriptions[_issuer];

    }

    //receive funds into the wallet
    function () public payable {

    }

    //withdraw from this wallet. Only possible for the owner.
    function withdrawFunds(uint amount) public {

        owner.transfer(amount);
    }

    //getting the current balance of the wallet.
    function getBalance() view public returns (uint) {
        return address(this).balance;
    }


}
