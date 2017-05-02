$(document).ready(function(){
  initializeButtons();
  var word_list = "";
  $.ajax({
      type: 'GET',
      url: '/leaderboards',
      async: true,
      data: { data: 'success' },
      success: function(results){
        var parsed = JSON.parse(results);  
        for(var i = 0; i < parsed.length; i++){
          $("#leaderboard_table").append("<tr><td>" + (i+1) + "</td><td>" + parsed[i]._id + "</td><td>" + parsed[i].score + "</td></tr>")
        }
      }
    });
  $('#start_button').on('click', function() {
    var getUser = $("#username").val();
    $.ajax({
      type: 'POST',
      url: '/checkUser',
      async: false,
      data: { name: getUser },
      success: function(results){  
      }
    });
    $.ajax({
      type: 'GET',
      url: '/game',
      async: true,
      data: { start: true },
      success: function(resultData) {
         word_list = resultData.split("\n");
         refreshGame();
         initializeGame(word_list);
      }
    });
});
});

function initializeGame(word_list){
  var playingGame = true;
  if(playingGame){
    var selected_word = word_list[Math.floor(Math.random()*word_list.length)].toUpperCase();
    console.log(selected_word);
    $('#game').show();
    initializeWord(selected_word);
    $("#start").hide();
    
    var solved = Array(selected_word.length).fill("_");
    var attempts = 6;

    console.log(solved);

    $('.game-buttons').on('click', function(){
      if(playingGame){
        var letter = $(this).attr("data-letter");
        var exists = false;

        for(var i = 0; i < selected_word.length; i++){
          if(selected_word[i] == letter){
            exists = true;
            solved[i] = letter;
          }
        }

        if(exists){
          fillWord(solved);
          var check = true;
          for(var i = 0; i < solved.length; i++){
            if(solved[i] != selected_word[i]){
              check = false;
            }
          }

          if(check){
            gameWon(word_list);
            playingGame = false;
            return;
          }
        }

        if(!exists){
          attempts--;
          setAttempts(attempts);
          if(attempts == 0){
            gameOver(selected_word, word_list);
            playingGame = false;
            return;
          }
        }

        disableButton(this);
      }
    });
  }
}

function initializeButtons(){
   var p, letter, button, holder;
    holder = document.getElementById( "button_holder" );
    for ( var i = 65; i <= 90; i++ ) {
        if ( i == 65 || i == 75 || i == 84 ) {
            p = document.createElement( "p" );
        }
        letter = String.fromCharCode( i );
        button = document.createElement( "button" );
        button.innerHTML = letter;
        button.className = "btn btn-default btn-sm game-buttons"
        button.setAttribute( "data-letter", letter );
        p.appendChild( button );
        if ( i == 74 || i == 83 || i == 90 ) {
            holder.appendChild( p );
        }
    }
}

function initializeWord(word){
  var length = word.length;
  $('#word_holder').append("<ul id='word'></ul>")
  for(var i = 0; i < length; i++){
    $('#word').append("<li class='guess'>_</li>")
  }
}

function disableButton(btn){
  $(btn).removeClass("btn-default");
  $(btn).addClass("btn-primary");
  $(btn).attr("disabled", true);
}

function fillWord(solved){
  var i = 0;
  $('#word > li').each(function () {
    $(this).text(solved[i]);
    i++;
  });
}

function setAttempts(attempts){
  $("#score").text("Remaining Attempts: " + attempts);

  switch(attempts){
    case 5:
      $("#hangman").attr("src", "/assets/game_files/hangman_2.png");
      break;
    case 4:
      $("#hangman").attr("src", "/assets/game_files/hangman_3.png");
      break;
    case 3:
      $("#hangman").attr("src", "/assets/game_files/hangman_4.png");
      break;
    case 2:
      $("#hangman").attr("src", "/assets/game_files/hangman_5.png");
      break;
    case 1:
      $("#hangman").attr("src", "/assets/game_files/hangman_6.png");
      break;
    case 0:
      $("#hangman").attr("src", "/assets/game_files/hangman_7.png");
      break;
  }
}

function gameOver(selected_word){
  fillWord(selected_word);
  $("button").attr("disabled", true);
  $("#score").text("Game over!");
  $("#start").show();
  $("#start_button").attr("disabled", false).show().text("Play Again");
  return;
}

function gameWon(){
  $("button").attr("disabled", true);
  $("#score").text("You got it!");
  $("#start").show();
  $("#start_button").attr("disabled", false).show().text("Play Again");
  var getUser = $("#username").val();
  $.ajax({
      type: 'POST',
      url: '/',
      async: true,
      data: { name: getUser, score: 1 },
      success: function(resultData) {
      }
    });
  return;
}

function refreshGame(){
  $("#hangman").attr("src", "/assets/game_files/hangman_1.png");
  $(".game-buttons").attr("disabled", false);
  $(".game-buttons").removeClass("btn-primary");
  $(".game-buttons").addClass("btn-default");
  $("#score").text("Remaining Attempts: 6");
  $('#word > li').each(function () {
    $(this).remove();
  });
  return;
}