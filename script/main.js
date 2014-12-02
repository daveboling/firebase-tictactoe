$(document).ready(function() {

  var setPlayerOne = $('#setPlayer1');
  var setPlayerTwo = $('#setPlayer2');
  var playerNumber = null;

  //setup firebase here
  var fb = new Firebase('https://blazing-torch-4030.firebaseio.com');

  //check firebase for player connections
/*
  fb.child('player1/isConnected').once('value', function(isConnected1){
    if(!isConnected1.val()){
      playerNumber = 1;
      p1HasConnected = true;
      fb.child('player1/isConnected').set(true);
      console.log('You are player #' + playerNumber);
    }
  });


  fb.child('player2/isConnected').once('value', function(isConnected2){
      if(!isConnected2.val() && !p1HasConnected){
        playerNumber = 2;
        fb.child('player2/isConnected').set(true);
        console.log('You are player #' + playerNumber);
      }else if(playerNumber === 2){
        console.log('sorry, there are multiple users in this session');
      }
  });
*/

fb.child('player1/isConnected').on('value', function(connection1){
  fb.child('player2/isConnected').on('value', function(connection2){
    if(!connection1.val()){
      setPlayerOne.show();
    }
    if(!connection2.val()){
      setPlayerTwo.show();
    }
    else {
      setPlayerTwo.hide();
      setPlayerOne.hide();
    }
  });
});

$('#setPlayer1').on('click', function(){
  fb.child('player1/isConnected').set(true);
  $(this).hide();
  playerNumber = 1;
  $('#player').text('You are player 1');
});

$('#setPlayer2').on('click', function(){
  fb.child('player2/isConnected').set(true);
  $(this).hide();
  playerNumber = 2;
  $('#player').text('You are player 2');
});

$('#resetGame').on('click', function(){
  fb.child('player2/isConnected').set(false);
  fb.child('player1/isConnected').set(false);
});






  var board = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ];

  var turn = 0;

  /*function playersTurn() {
    if (turn % 2 === 0) {
      document.getElementById('players-turn').innerHTML =
        "Player 2's Turn";
    } else if (turn % 2 != 0) {
      document.getElementById('players-turn').innerHTML =
        "Player 1's Turn";
    }
  }*/

  function isEmpty(td) {
    return $(td).text() === ''
  }



  $("td").click(function() {

    if (isEmpty(this) && turn % 2 === 0) {
      $(this).text("x");
      turn++;
    } else if (isEmpty(this) && turn % 2 !== 0) {
      $(this).text("o");
      turn++;
    }
  })



});
