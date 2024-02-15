// SPDX-License-Identifier: MIT
//By NFTea.app
//Play heads up esports games for crypto & nfts

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
pragma solidity ^0.8.0;
library SafeMath {
    
    function tryAdd(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            uint256 c = a + b;
            if (c < a) return (false, 0);
            return (true, c);
        }
    }
    
    
    function trySub(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            if (b > a) return (false, 0);
            return (true, a - b);
        }
    }
    
    
    function tryMul(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
            // benefit is lost if 'b' is also tested.
            // See: https://github.com/OpenZeppelin/openzeppelin-contracts/pull/522
            if (a == 0) return (true, 0);
            uint256 c = a * b;
            if (c / a != b) return (false, 0);
            return (true, c);
        }
    }


    function tryDiv(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            if (b == 0) return (false, 0);
            return (true, a / b);
        }
    }


    function tryMod(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            if (b == 0) return (false, 0);
            return (true, a % b);
        }
    }


    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        return a + b;
    }


    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        return a - b;
    }


    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        return a * b;
    }


    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        return a / b;
    }

    
    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        return a % b;
    }

    
    function sub(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        unchecked {
            require(b <= a, errorMessage);
            return a - b;
        }
    }

    
    function div(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        unchecked {
            require(b > 0, errorMessage);
            return a / b;
        }
    }
    

    function mod(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        unchecked {
            require(b > 0, errorMessage);
            return a % b;
        }
    }
}
contract Esports {
    address public admin;
    address public nftea;
    address public teaToken;
    address public wallet;
    address public wBNB;
    uint public mediatornft;
    uint public sfee;
    using SafeMath for uint;

    struct Game {
        address player1;
        address player2;
        uint nft1;
        uint nft2;
        string game;
        bool accepted;
        int score1;
        int score2;
        int status;
        uint amount;
        address token; // Token address for token wagers
    }

    struct PlayerProfile {
        uint win;
        uint loss;
        uint disputes;
        uint disputes_won;
    }

    struct Mediator {
        address mediatorAddress;
        bool active;
    }

    mapping(uint => Game) public games;
    uint public gameId = 1;

    mapping(address => PlayerProfile) public playerProfiles;
    mapping(address => Mediator) public mediators;
    mapping(uint=>bool) public disputed;
    mapping(uint=>address) public gameToDisputer;
    mapping(uint=>string) public gameToConsole;
    mapping(uint=>string) public gameToRules;
    mapping(uint=>address) public scoredBy;
    mapping(uint=>address) public gameToMediator;
    mapping(uint=>uint) public gameToScoreTime;
    mapping(address=>address[]) public mediatorToWinners;
    mapping(address=>uint[]) public mediatorToGames;
    mapping(address => address[]) public mediatorToRecentDisputes;
    mapping(address=>uint[]) public player2games;
    mapping(address=>mapping(uint=>uint)) public player2gamesIndex;
    uint[] public inDispute;
    mapping(uint=>uint) public inDispute2Index;
    event ChallengeCreated(uint gameId, address indexed player1, address indexed player2, uint nft1, uint nft2, uint amount, address token, string console, string game, string rules);
    event ChallengeAccepted(uint gameId, address indexed player1, address indexed player2);
    event ChallengeDeclined(uint gameId);
    event ScoreReported(uint gameId, address indexed player1, address indexed player2, int score1, int score2, address scorer);
    event ChallengeCanceled(uint gameId, address indexed player1, address indexed player2);
    event ChallengeDisputed(uint gameId, address indexed player1, address indexed player2, address mediator, address indexed disputer);
    event FundsTransferred(uint gameId, address indexed winner, uint nftIdWinner, address indexed loser, uint nftIdLoser);
    event MediatorAdded(address indexed mediator);
    event NewOpponent(uint gameId, address indexed opponent);
    event MediatorAssigned(uint gameId, address indexed mediator);
    event GameCancelled(uint gameId, address indexed player1, address indexed player2);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    modifier onlyPlayer1(uint _gameId) {
        require(msg.sender == games[_gameId].player1, "Not authorized");
        _;
    }
    modifier onlyPlayers(uint _gameId) {
        require(msg.sender == games[_gameId].player1 || msg.sender == games[_gameId].player2, "Not authorized");
        _;
    }
    modifier onlyScorers(uint _gameId) {
        require(msg.sender == games[_gameId].player1 || msg.sender == games[_gameId].player2 || msg.sender== gameToMediator[_gameId], "Not authorized");
        _;
    }

    modifier onlyAcceptedChallenge(uint _gameId) {
        require(games[_gameId].accepted, "Challenge not accepted yet");
        _;
    }

    modifier onlyActiveGame(uint _gameId) {
        require(games[_gameId].status==1, "Game not active");
        _;
    }

    modifier onlyMediator() {
        require(mediators[msg.sender].active, "Only active mediator can call this function");
        _;
    }

    constructor() {
        admin = msg.sender;
    }
    receive () external payable {}

    function createChallenge(
        address _player2,
        uint _nft1,
        uint _nft2,
        string memory _game,
        uint _amount,
        address _token,
        string memory _console,
        string memory _rules
    ) external payable {
        require(_amount > 0 || _nft1 != 0, "Invalid amount or NFT ID");

        if (_nft1>0) {
            require(_nft1 != 0 && _nft2 != 0, "Invalid NFT IDs");
            // Check if player2 owns the specified NFT
            require(IERC1155(nftea).balanceOf(_player2, _nft2) > 0, "Player2 doesn't own the specified NFT");
            // Transfer player1's NFT to the contract
            IERC1155(nftea).safeTransferFrom(msg.sender, address(this), _nft1, 1, "");
            require(checkSuccess(), 'transfer failed');

        } else if (_amount > 0) {
            // Transfer the wager amount from player1 to the contract
            if(_token!=wBNB){
                IERC20(_token).transferFrom(msg.sender, address(this), _amount);
            }else{
                require(msg.value == _amount, "BNB amount sent doesn't match the expected amount");
            }
        }

        games[gameId] = Game({
            player1: msg.sender,
            player2: _player2,
            nft1: _nft1,
            nft2: _nft2,
            score1: 0,
            score2: 0,
            game: _game,
            accepted: false,
            status: 1,
            amount: _amount,
            token: _token
        });
        
        gameToConsole[gameId] = _console;
        gameToRules[gameId] = _rules;
        player2games[msg.sender].push(gameId);
        player2gamesIndex[msg.sender][gameId] = player2games[msg.sender].length - 1;  
        player2games[_player2].push(gameId);
        player2gamesIndex[_player2][gameId] = player2games[_player2].length - 1;
      
        emit ChallengeCreated(gameId, msg.sender, _player2, _nft1, _nft2, _amount, _token, _console, _game, _rules);
        gameId++;
    }

    function acceptChallenge(uint _gameId) external payable onlyActiveGame(_gameId) {
        Game storage game = games[_gameId];
        require(!game.accepted, "Challenge already accepted");
        require(msg.sender == game.player2, "Only player2 can accept the challenge");

        if (game.nft2>0) {
            // Check if player2 owns the specified NFT
            require(IERC1155(nftea).balanceOf(msg.sender, game.nft2) > 0, "Player2 doesn't own the specified NFT");
            // Transfer player2's NFT to the contract
            IERC1155(nftea).safeTransferFrom(msg.sender, address(this), game.nft2, 1, "");
            require(checkSuccess(), 'transfer failed');

        } else if (game.amount > 0) {
            // Transfer the wager amount from player2 to the contract
            if(game.token!=wBNB){
                IERC20(game.token).transferFrom(msg.sender, address(this), game.amount);
            }else{
                //game is for bnb
                require(msg.value == game.amount, "BNB amount sent doesn't match the expected amount");
            }
        }

        game.accepted = true;
        emit ChallengeAccepted(_gameId, game.player1, game.player2);
    }

    function declineChallenge(uint _gameId) external onlyActiveGame(_gameId){
        Game storage game = games[_gameId];
        require(!game.accepted, "Challenge already accepted");
        require(msg.sender == game.player2, "Only player2 can decline the challenge");
        player2games[msg.sender][player2gamesIndex[msg.sender][gameId]] = player2games[msg.sender].length - 1;
        player2games[msg.sender].pop();
        game.player2 = address(0);
        emit ChallengeDeclined(_gameId);

    }
    function changeOpponent(uint _gameId, address _player2) external onlyActiveGame(_gameId) onlyPlayer1(_gameId){
        require(games[_gameId].accepted==false, 'game already accepted');
        games[_gameId].player2 = _player2;
        player2games[_player2].push(_gameId);
        player2gamesIndex[_player2][_gameId] = player2games[_player2].length - 1;
        emit NewOpponent(_gameId, _player2);

    }
    function reportScore(uint _gameId, int _score1, int _score2) external onlyPlayers(_gameId) onlyActiveGame(_gameId) {
        Game storage game = games[_gameId]; // Use memory for better gas efficiency
        require(!disputed[_gameId], "Challenge is disputed");
        require(_score1!=_score2,'tied game');
        // Either player can report the score
        game.score1 = _score1;
        game.score2 = _score2;
        gameToScoreTime[_gameId] = block.timestamp;
        scoredBy[_gameId] = msg.sender;
        emit ScoreReported(_gameId, game.player1, game.player2, _score1, _score2,msg.sender);
    }

    function confirmScore(uint _gameId, int _score1, int _score2) external onlyScorers(_gameId) onlyActiveGame(_gameId){
        uint timeExpired = gameToScoreTime[_gameId] + 60 minutes;
        require(!disputed[_gameId] || gameToMediator[_gameId]==msg.sender, "Challenge is disputed");
        require(scoredBy[_gameId]!=msg.sender || block.timestamp > timeExpired,  'opponent must confirm');
        Game storage game = games[_gameId];
        if(!disputed[_gameId]){
            require(game.score1 == _score1 && game.score2 == _score2, "Incorrect scores");
        }        
        address winner;
        uint nftIdWinner;
        address loser;
        uint nftIdLoser;
        bool mediated = false;

        if (_score1 > _score2) {
            winner = game.player1;
            nftIdWinner = game.nft1;
            loser = game.player2;
            nftIdLoser = game.nft2;
        } else {
            winner = game.player2;
            nftIdWinner = game.nft2;
            loser = game.player1;
            nftIdLoser = game.nft1;
        }
        scoredBy[_gameId] = msg.sender;
        if(gameToMediator[_gameId]!=address(0)){
            mediatorToWinners[gameToMediator[_gameId]].push(winner);
            mediatorToGames[gameToMediator[_gameId]].push(_gameId);
            mediated = true;
        }
        updatePlayerProfile(winner, loser);
        player2games[game.player1][player2gamesIndex[game.player1][gameId]] = player2games[game.player1].length - 1;
        player2games[game.player1].pop();
        player2games[game.player2][player2gamesIndex[game.player2][gameId]] = player2games[game.player2].length - 1;
        player2games[game.player2].pop();
        if(inDispute2Index[_gameId]>0){
            inDispute[inDispute2Index[gameId]] = inDispute.length - 1;
            inDispute.pop();
        }
        transferFunds(_gameId, winner, nftIdWinner, loser, nftIdLoser, mediated);
    }
    
    function transferFunds(uint _gameId, address winner, uint nftIdWinner, address loser, uint nftIdLoser, bool mediated) internal {
        // Transfer NFTs to the winner
        if (games[_gameId].nft1>0 && games[_gameId].nft2>0) {

            IERC1155(nftea).safeTransferFrom(address(this), winner, nftIdWinner, 1, "");
            require(checkSuccess(), 'transfer failed');

            IERC1155(nftea).safeTransferFrom(address(this), winner, nftIdLoser, 1, "");
            require(checkSuccess(), 'transfer failed');

        } else {

            // Transfer the wager amount to the winner
            uint amount = games[_gameId].amount * 2;
            uint fee = amount.mul(sfee).div(100);
            uint mediatorfee = fee.div(2);

            if(games[_gameId].token!=wBNB){

                if(games[_gameId].token==teaToken){
                    fee = 0;
                }

                if(mediated){

                    playerProfiles[winner].disputes_won ++;
                    playerProfiles[loser].disputes ++;
                    amount = amount.sub(fee).sub(mediatorfee);
                    IERC20(games[_gameId].token).transfer(gameToMediator[_gameId], mediatorfee);

                }else{

                    amount = amount.sub(fee);
                }
                    IERC20(games[_gameId].token).transfer(winner, amount);
                    
                if(fee>0){
                    IERC20(games[_gameId].token).transfer(wallet, fee);
                }

            }else{

                //native currency used
                if(mediated){
                    playerProfiles[winner].disputes_won ++;
                    playerProfiles[loser].disputes ++;
                    amount = amount.sub(fee).sub(mediatorfee);
                    payable(gameToMediator[_gameId]).transfer(mediatorfee);

                }else{

                    amount = amount.sub(fee);
                }
                    payable(games[_gameId].player1).transfer(amount);
                    if(fee>0){
                        payable(wallet).transfer(fee);
                    }

            }
            
        }

        emit FundsTransferred(_gameId, winner, nftIdWinner, loser, nftIdLoser);
        // Mark the game as completed
        games[_gameId].status = 3;
    }

    function disputeChallenge(uint _gameId) external onlyPlayers(_gameId) onlyActiveGame(_gameId) {
        Game storage game = games[_gameId];
        require(!disputed[_gameId], "Challenge already disputed");

        games[_gameId].status = 2;
        gameToDisputer[_gameId] = msg.sender;
        playerProfiles[msg.sender].disputes ++;
        inDispute.push(_gameId);
        inDispute2Index[_gameId] = inDispute.length - 1;
        emit ChallengeDisputed(_gameId, game.player1, game.player2, address(0),msg.sender);
    }

    function mediatorClaim(uint _gameId) external onlyMediator onlyActiveGame(_gameId){
        require(disputed[_gameId], "Challenge is not disputed");
        require(gameToMediator[_gameId]==address(0), 'mediator assigned');
        require(msg.sender != games[_gameId].player1 && msg.sender != games[_gameId].player2, 'you cannot mediate a game you are in');
        require(!contains(mediatorToRecentDisputes[msg.sender], gameToDisputer[_gameId]), "Mediator can't mediate for the same player in recent disputes");

        gameToMediator[_gameId] = msg.sender;
        addRecentDispute(msg.sender, gameToDisputer[_gameId]);
        emit MediatorAssigned(_gameId, msg.sender);
    }

    function updatePlayerProfile(
    address winner,
    address loser
    ) internal {
        // Update winner's profile
            playerProfiles[winner].win ++;
            playerProfiles[loser].loss ++;

    }
    
    function cancelGame(uint _gameId) external onlyActiveGame(_gameId) onlyPlayer1(_gameId) {

        require(games[_gameId].accepted==false, 'game already accepted');
        Game storage game = games[_gameId];
        
        if (game.token != address(0)) {
            // If it's a token game
            require(IERC20(game.token).balanceOf(address(this)) >= game.amount, "Insufficient balance for token refund");
            IERC20(game.token).transfer(game.player1, game.amount);

        } else {
            // If it's an NFT game with a provided NFT by player1
            if (game.nft1 != 0) {

                require(IERC1155(nftea).balanceOf(address(this), game.nft1) > 0, "Contract doesn't hold the specified NFT");
                IERC1155(nftea).safeTransferFrom(address(this), game.player1, game.nft1, 1, "");
                require(checkSuccess(), 'transfer failed');

            } else {
                // If it's an NFT game without a provided NFT by player1 (refund native currency)
                payable(game.player1).transfer(game.amount);
            }
        }
        // set game inactive
        game.status = 0;
        player2games[msg.sender][player2gamesIndex[msg.sender][gameId]] = player2games[msg.sender].length - 1;
        player2games[msg.sender].pop();
        if(game.player2!=address(0)){
            player2games[game.player2][player2gamesIndex[game.player2][gameId]] = player2games[game.player2].length - 1;
            player2games[game.player2].pop();
        }
        game.player2 = address(0);
        emit GameCancelled(_gameId, game.player1, game.player2);
    }

    function getGame(uint _gameId) external view returns (Game memory, string memory, string memory, address, address,address) {
        return (games[_gameId], gameToConsole[_gameId], gameToRules[_gameId], gameToDisputer[_gameId],scoredBy[_gameId], gameToMediator[_gameId]);
    }

    function getDisputedGames() external view returns (uint[] memory) {

        return inDispute;
    }

    function getPlayerGames(address _player) external view returns (uint[] memory) {

        return player2games[_player];
    }
    function getPlayerProfile(address _player) external view returns (
        uint ,
        uint
    ) {
        PlayerProfile storage profile = playerProfiles[_player];
        return (
            profile.win,
            profile.loss
        );
    }

    function addRecentDispute(address mediator, address player) internal {
        if (mediatorToRecentDisputes[mediator].length >= 6) {
            mediatorToRecentDisputes[mediator].pop();
        }
        mediatorToRecentDisputes[mediator].push(player);
    }

   function contains(address[] storage array, address target) internal view returns (bool) {
    for (uint i = 0; i < array.length; i++) {
        if (array[i] == target) {
            return true;
        }
    }
    return false;
}
    function setAdmin(address _admin) external onlyAdmin {
        admin = _admin;
    }
    function setMediatorNft(uint nft) external onlyAdmin {
        mediatornft = nft;
    }
    function setToken(address token) external onlyAdmin {
        teaToken = token;
    }
    function setNftea(address _nftea) external onlyAdmin {
        nftea = _nftea;
    }
    function setWallet(address _wallet) external onlyAdmin {
        wallet = _wallet;
    }
    function setFee(uint fee) external onlyAdmin {
        sfee = fee;
    }
    function setMediator(address _mediator) external onlyAdmin {
        require(IERC1155(nftea).balanceOf(_mediator, mediatornft) > 0, "mediator doesn't own mediator nft");
        mediators[_mediator] = Mediator({
            mediatorAddress: _mediator,
            active:true
        });
    }
    function updateMediator(address _mediator) external onlyAdmin {
        if(mediators[_mediator].active){
            mediators[_mediator].active = false;
        }else{
            mediators[_mediator].active = true;
        }
    }
    function checkSuccess()
    private pure
    returns (bool)
    {
        uint256 returnValue = 0;
        
        /* solium-disable-next-line security/no-inline-assembly */
        assembly {
        // check number of bytes returned from last function call
            switch returndatasize()
            
            // no bytes returned: assume success
            case 0x0 {
                returnValue := 1
            }

            // 32 bytes returned: check if non-zero
            case 0x20 {
            // copy 32 bytes into scratch space
                returndatacopy(0x0, 0x0, 0x20)

            // load those bytes into returnValue
                returnValue := mload(0x0)
            }

            // not sure what was returned: dont mark as success
            default { }

        }

        return returnValue != 0;
    }
}
