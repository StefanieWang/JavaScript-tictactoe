function Player(mark){
	this.mark = mark;
	this.positions = [];
	this.score = 0;
};

var computerMove = function(player, computer){
	//block
	this.winCombos.forEach(function(winArray){
		count = 0;
        winArray.forEach(function(winPosition){
            player.positions.forEach(function(position){
                if (position == winPosition){
            	    count++;           			 
                };
            });
        });

        if(count == 2){
            	    win = true;
            	    tttObj.getGameOverMessage();  
            	    tttObj.playerWinPositions = winArray; 
                    tttObj.player.score ++;      	
        };         
	});
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
        this.player1 = undefined;
        this.player2 = undefined;
        this.player = undefined;
        this.playerWinPositions = [];
	    this.turn = 0;
	    this.gameOverMessage = "It's a draw!";
	    $(".square").off("click");
	},

    getChoiceForQ1: function(){
    	var tttObj = this;
    	$(".game-q1 .choice").click(function(event){
            var userChoice = $(event.target);
            var message;
            if(userChoice.hasClass("one-player")){
            	tttObj.player2 = "computer";
                message = "Would you like to be X or O?";
                $(".game-points .player1 .name").html("Player: ");
            	$(".game-points .player2 .name").html("Computer: ");
            } else {
            	message = "player 1, would you like to be X or O?"
            	$(".game-points .player1 .name").html("Player 1: ");
            	$(".game-points .player2 .name").html("Player 2: ");
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
    		tttObj.startGame();
    	})
    },

	getUsersChoice: function(){
		this.getChoiceForQ1();
		this.getChoiceForQ2(); 
		this.getReset();      
	},

	play: function(){
		var tttObj = this;
		$(".square").click(function(){
			//place mark
			if(!$(this).html()){
			    $(this).html(tttObj.player.mark.toUpperCase());
			    tttObj.player.positions.push($(this).attr("id"));
			    tttObj.turn++;
		    };

		    if(tttObj.gameOver()){
			    tttObj.showGameoverMessage();
			    tttObj.updatePlayerScore();	
			    setTimeout(function(){
			    	tttObj.startNewTurn();

			    }, 3000);
		    }else{
			    tttObj.switchPlayer();
		    };
		});  
		
	},

	startNewTurn: function(){
        $(".game-over-message").remove();
        $(".square").remove();
        this.setUpBoard();       
        //this.player = undefined;
        this.switchPlayer();
        this.player1.positions = [];
        this.player2.positions = [];
        this.playerWinPositions = [];
	    this.turn = 0;
	    this.gameOverMessage = "It's a draw!";
	    this.play();
	},

	switchPlayer: function(){
		if(this.player == this.player1){
			this.player = this.player2;
			$(".currentPlayer").html("Player 2's turn!");
		} else {
			this.player = this.player1;
			$(".currentPlayer").html("Player 1's turn!");
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
            	    tttObj.getGameOverMessage();  
            	    tttObj.playerWinPositions = winArray; 
                    tttObj.player.score ++;      	
                };         
		    });
		};
	
		return win || this.turn==9; 
	},

	getGameOverMessage: function(){
		if(this.player === this.player1){
            this.gameOverMessage = "Player one wins!"
        }else {
            this.gameOverMessage = "Player two wins!"
        }

	},

	startGame: function(){
		this.init();
		this.getUsersChoice();
		//if(this.player1){
	    this.play();
		//};
        				
	}
};

$(document).ready(function(){
    tictactoe.startGame();
    
})