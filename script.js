function Player(mark){
	this.mark = mark;
	this.positions = [];
	this.score = 0;
};

/*var canvasDraw = function(){
	var CANVAS = document.getElementById("game-board-canvas");
	var ctx = CANVAS.getContext("2d");

	ctx.beginPath();
	ctx.moveTo(100, 25);
	ctx.lineTo(100, 275);
	ctx.moveTo(200, 25);
	ctx.lineTo(200, 275);
	ctx.moveTo(25, 100);
	ctx.lineTo(275, 100);
	ctx.moveTo(25, 200);
	ctx.lineTo(275, 200);
	ctx.strokeStyle = "#fff";
	ctx.lineWidth = 5;
	ctx.stroke();

};*/

var tictactoe = {
	winCombos: [[0,1,2],
	            [3,4,5],
	            [6,7,8],
	            [0,3,6],
	            [1,4,7],
	            [2,5,8],
	            [0,4,8],
	            [2,4,6]],

	setUpBoard: function(){
		var board = $(".squares");
		//canvasDraw();
		for(var i=0;i<9;i++){
			var square  = $("<div class=\"square\" id="+i+"></div>");
			board.append(square);
		};
		
	},

	init: function(){
		var controlList = $("ul.game-control li");
		$(".game-over-message").remove();
        $(".square").remove();
        this.setUpBoard();       
        controlList.hide();
        $(controlList[0]).show();
        this.onePlayer = false;
        this.player1 = undefined;
        this.player2 = undefined;
        this.player = undefined;
        this.playerWinPositions = [];
	    this.turn = 0;
        this.timer = undefined;
	    this.gameOverMessage = "It's a draw!";
	    $(".square").off("click");
	},

    getChoiceForQ1: function(){
    	var tttObj = this;
    	$(".game-q1 .choice").click(function(event){
            var userChoice = $(event.target);
            var message;
            if(userChoice.hasClass("one-player")){
            	tttObj.onePlayer = true;
                message = "Would you like to be X or O?";
                $(".game-points .player1 .name").html("Player: ");
            	$(".game-points .player2 .name").html("Computer: ");
                $(".currentPlayer").html("Player: your turn!");
            } else {
            	message = "player 1, would you like to be X or O?"
            	$(".game-points .player1 .name").html("Player 1: ");
            	$(".game-points .player2 .name").html("Player 2: ");
                $(".currentPlayer").html("Player 1: your turn!");
            };
            $(".game-q2 h2").html(message);
            $(".game-q1").hide();
            $(".game-q2").fadeIn(1000);
        })

    },

    getChoiceForQ2: function(){
    	var tttObj = this;
    	$(".game-q2 .choice").click(function(event){
            var userChoice = $(event.target).attr("class");
            if(userChoice === "back"){
                tttObj.startGame();
            }else if(userChoice === "x" ||
            	     userChoice === "o"){            
                tttObj.player1 = new Player(userChoice);
            	tttObj.player2 = userChoice ==="x" ? new Player("o") : new Player("x");               
                tttObj.player = tttObj.player1;
                $(".game-q2").hide();
                $(".game-points").fadeIn(1000);
            };           
    	});
        
    },

    getReset: function(){
    	var tttObj = this;
    	$(".reset").click(function(){
            if(tttObj.timer){
                clearTimeout(tttObj.timer);
            };
    		tttObj.startGame();
    	})
    },

	getUsersChoice: function(){
		this.getChoiceForQ1();
		this.getChoiceForQ2(); 
		this.getReset();      
	},
   
	
    /*===================================
            main game logic
    =====================================*/
	play: function(){
		var tttObj = this;
		
		$(".square").click(function(){
			//player place mark
			if(!$(this).html()){
			    $(this).html(tttObj.player.mark.toUpperCase());
			    var move = parseInt($(this).attr("id"))
			    tttObj.player.positions.push(move);
			    tttObj.turn++;
		    };
            //check if game over or switch player
		    if(tttObj.gameOver()){
			    tttObj.showGameoverMessage();
			    tttObj.updatePlayerScore();	
			    tttObj.timer = setTimeout(function(){
			    	tttObj.startNewRound();
			    }, 3000);
		    }else{
			    tttObj.switchPlayer();
			    tttObj.computerPlay();
		    };
		});  
		
	},

    computerPlay: function(){
        if(this.onePlayer){
            if(this.player === this.player2){
                var move = this.computerMove();
                this.player.positions.push(move);
                $("#"+move).html(this.player.mark.toUpperCase());
                this.turn++;

                if(this.gameOver()){
                    this.showGameoverMessage();
                    this.updatePlayerScore();   
                    var tttObj = this;
                    this.timer = setTimeout(function(){
                        tttObj.startNewRound();
                    }, 3000);
                }else{
                    this.switchPlayer();
                 
                };
            };
        };

    },

	startNewRound: function(){
        $(".game-over-message").remove();
        $(".square").remove();
        this.setUpBoard();       
        if(this.onePlayer){
        //if play with the computer, always let player starts first
            this.player = this.player2;
        };
        //if player with another player, 
        //let the one who lost in last round to start first
        this.switchPlayer();
        this.player1.positions = [];
        this.player2.positions = [];
        this.playerWinPositions = [];
	    this.turn = 0;
	    this.gameOverMessage = "It's a draw!";
	    this.play();
	},

	switchPlayer: function(){
        var player2name = $(".player2 .name").html();
        var player1name = $(".player1 .name").html();
		if(this.player == this.player1){
			this.player = this.player2;           
			$(".currentPlayer").html(player2name + "your turn!");
		} else {
			this.player = this.player1;
			$(".currentPlayer").html(player1name + "your turn!");
		}
	    
	},

	showGameoverMessage: function(){
		if(this.playerWinPositions.length){
			this.playerWinPositions.forEach(function(position){
				$("#"+position).addClass("highlight");
			})
		};
		var messageDiv = $("<div class=\"game-over-message\"></div>").html(this.gameOverMessage);
        $(".game-board").append(messageDiv);
	},

	updatePlayerScore: function(){
        $(".game-points .player1 .points").html(this.player1.score);
        $(".game-points .player2 .points").html(this.player2.score);
	},

	gameOver: function(){
		var win = false;
		var count;
		var player = this.player;
		var tttObj = this;
        var playerWinPositions;
		if(this.turn > 4){
			this.winCombos.forEach(function(winArray){
			    count = 0;
                winArray.forEach(function(winPosition){
            	    player.positions.forEach(function(position){
            		    if (position == winPosition){
            			    count++;           			 
            		    };
            	    });
                });

                if(count === 3){
            	    win = true;
            	    tttObj.generateGameOverMessage();  
            	    tttObj.playerWinPositions = winArray; 
                    tttObj.player.score ++;      	
                };         
		    });
		};
	    
		return win || this.turn==9; 
	},

	generateGameOverMessage: function(){
		if(this.player === this.player1){
            this.gameOverMessage = "Player one wins!"
        }else {
            this.gameOverMessage = "Player two wins!"
        }

	},

	startGame: function(){
		this.init();
		this.getUsersChoice();
	    this.play();        				
	},

   /*=========================
         computer logic
    ==========================*/
	computerMove: function(){
	    var computer = this.player2;
	    var opponent = this.player1;
	    var corners = [0,2,6,8];
	    var sides = [1,3,5,7];
	    var emptySquares = $([0,1,2,3,4,5,6,7,8])
	                   .not(computer.positions)
	                   .not(opponent.positions)
	                   .get();
	    var winCombos = this.winCombos;
	    var squares = $(".square");
	    var nextMove;

        function WinningMoves(moves, count){
    	    this.moves = moves;
    	    this.count = count;
        };

	    var countWinningMoves = function(playerPositions){
            var winningMoves = [];
            var winningCount = 0;
            winCombos.forEach(function(winArray){
                var numOfPositions = 0;
                var positionsTaken = [];
            
                winArray.forEach(function(winPosition){
            	    if(playerPositions.includes(winPosition)){
            		    numOfPositions ++;
            		    positionsTaken.push(winPosition);
            	    }
                });
                if(numOfPositions === 2){               
                    var winningMove = $(winArray).not(positionsTaken).get(0);                   
                    if(emptySquares.includes(winningMove)){
                	    winningCount ++;
                	    winningMoves.push(winningMove);
                    }               
                };
            });
            var moves = new WinningMoves(winningMoves, winningCount);
            return moves;
	    };
    
        var getWinMove = function(player){
            var winningMoves = countWinningMoves(player.positions);
            return winningMoves.moves[0];
        };

        var canCreateFork = function(player, possibleMove){
    	    var winningCount = 0;
    	    var canfork = false;
            winCombos.forEach(function(winArray){           
                if(winArray.includes(possibleMove)){
            	    winArray.forEach(function(winPosition){
            	        if(player.positions.includes(winPosition)){
            	    	    var thirdPosition = $(winArray).not([possibleMove, winPosition]).get(0);
            	    	    if(emptySquares.includes(thirdPosition)){
            	    		    winningCount ++;
            	    	    };           		    
            	        };
                    });
                };
            }); 
           
            if(winningCount === 2){
            canfork = true;      
            };     

            return canfork;  
        };
    
        var createFork = function(){
    	    emptySquares.forEach(function(emptySquare){
                if(canCreateFork(computer, emptySquare)){
                    nextMove = emptySquare;               
                };   
            }); 
        };

        var createDoubleThreat = function(player){
            winCombos.forEach(function(winArray){
                player.positions.forEach(function(position){
                    if(winArray.includes(position)){
                        var others = $(winArray).not([position]).get();
                        if(emptySquares.includes(others[0]) 
                           && emptySquares.includes(others[1])){
                            nextMove = others[1];
                        };
                    };
                });
            
            });
        };

        var blockOpponentsFork = function(){
            emptySquares.forEach(function(emptySquare){
        	    if(canCreateFork(opponent, emptySquare)){
                    createDoubleThreat(computer);
        		    if(nextMove === undefined) {
                       nextMove = emptySquare;
                    };
        	    };
            });
        };

        var playCenter = function(){
    	    if (emptySquares.includes(4)){
    		    nextMove = 4;
    	    };
        };

        var playOppositeCorner = function(){
    	    var opponentArray = opponent.positions;
    	    corners.forEach(function(corner){
    		    if(opponentArray.includes(corner) &&
    			    emptySquares.includes(8-corner)){
                   nextMove = 8-corner;
    		    }
    	    });   	
        };
    
        var playEmptyCorner = function(){
    	    var emptyCorners = []; 
    	    corners.forEach(function(corner){
    		    if(emptySquares.includes(corner)){
    			    emptyCorners.push(corner);
    		    };    		
    	    });
             nextMove = emptyCorners[0];
        };
    
        var playEmptySide = function(){
    	    var emptySides = [];
    	    sides.forEach(function(side){
                if(emptySquares.includes(side)){
            	    emptySides.push(side);
                };
    	    });
    	    nextMove = emptySides[0];
        };

        var makeNextMove = function(){
    	    //take win move
            nextMove = getWinMove(computer);  
            console.log("1:"+nextMove);      
            if(nextMove === undefined){
        	    //block opponent's win move
        	    nextMove = getWinMove(opponent);
        	    console.log("2:"+nextMove);
            };
            if(nextMove === undefined){
        	    createFork();
        	    console.log("3:"+nextMove);
            };
            if(nextMove === undefined){
        	    blockOpponentsFork();
        	    console.log("4:"+nextMove);
            
            };
            if(nextMove === undefined){
        	    playCenter();
        	    console.log("5:"+nextMove);
            };
            if(nextMove === undefined){
        	    playOppositeCorner();
        	    console.log("6:"+nextMove);
            };
            if(nextMove === undefined){
        	    playEmptyCorner();
        	    console.log("7:"+nextMove);
            };
            if(nextMove === undefined){
        	    playEmptySide();
        	    console.log("8:"+nextMove);
            };

        };

        makeNextMove();
        return nextMove;
    }

};


$(document).ready(function(){
    tictactoe.startGame();
 
})