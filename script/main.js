$(document).ready(function() {

  var setPlayerOne = $('#setPlayer1');
  var setPlayerTwo = $('#setPlayer2');
  var playerNumber = null;

  //setup firebase here
  var fb = new Firebase('https://blazing-torch-4030.firebaseio.com');

  //check to see if any players are connected
  fb.child('player1/isConnected').on('value', function(connection1){
    fb.child('player2/isConnected').on('value', function(connection2){
      if(!connection1.val()){
        setPlayerOne.show();
      }else{ 
        setPlayerOne.hide();
      }

      if(!connection2.val()){
        setPlayerTwo.show();
      }else {
        setPlayerTwo.hide();
      }

    });
  });

  //set player buttons
  $('#setPlayer1').on('click', function(){
    fb.child('player1/isConnected').set(true);
    $(this).hide();
    playerNumber = 1;
    setPlayerTwo.hide();
    $('#player').text('You are player 1');
  });

  $('#setPlayer2').on('click', function(){
    fb.child('player2/isConnected').set(true);
    $(this).hide();
    playerNumber = 2;
    setPlayerOne.hide();
    $('#player').text('You are player 2');
  });

  $('#resetGame').on('click', function(){
    fb.child('player2/isConnected').set(false);
    fb.child('player1/isConnected').set(false);
    fb.child('tableData').set([0,0,0,0,0,0,0,0,0]);
    fb.child('turn').set(0);

    $('#player').text('Game reset.');
  });



  //GAME LOGIC

  //selects all table columns
  var table = $('table td');
  var turn = 0;

  //a simple mirror array to send to each other
  var mirror = [
     0,    0,    0,
     0,    0,    0,
     0,    0,    0
  ];

  var mirrorRef = fb.child('tableData');
  var turnRef = fb.child('turn');

  //updates the mirror array based on firebase
  mirrorRef.on('value', function(snapshot){
    mirror = snapshot.val();
    clearTable();
    updateTable(mirror);
  });

  //updates the mirror array based on firebase
  turnRef.on('value', function(snapshot){
    turn = snapshot.val(); 
  });


  //check to see which cells are filled
  //and mirror array

  $('td').on('click', function(){
    //this is the cell that was clicked
    var cellClicked = $(this).attr('id');
    var self = this; //this stores the td that was clicked!

    //this calculates whose move it is and puts the symbol in this variable
    var symbol = playerMove(this);

    //check to see if it's already occupied
    //$.each is just like forEach in JavaScript but is used to loop through jQuery objects
    $.each(table, function(index, td){
      //if the cell clicked is the same as the index on this loop AND the mirror array at that index is 0
      //then change the symbol, add it to the mirror array
      //update the mirror on firebase
      if(index == cellClicked && isEmpty(self)){
        $(self).text(symbol); 
        mirror[cellClicked] = symbol
        fb.child('tableData').set(mirror);
      }
    });

  });

  //this function will check to see whose turn it is and what their symbol is
  //it will update the turn variable on firebase as well
  function playerMove(){
    if (turn % 2 === 0) {
      turn++;
      fb.child('turn').set(turn);
      return 'x';
    } else if (turn % 2 !== 0) {
      turn++;
      fb.child('turn').set(turn);
      return 'o';
    }
  }

  //make sure table column is empty
  function isEmpty(td){
    return $(td).text() === ''
  }

  //this function updates the table for both players!
  function updateTable(arr){
    $.each(table, function(index, td){
      if(!arr[index]){return;} //don't let it print zeroes
      else{ $(td).text(arr[index]) };
    });
  }

  //clear the html table
  function clearTable(){
    $.each(table, function(index, td){
      $(td).text('');
    })
  }





});
