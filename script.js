function row(coords) {
  return Math.floor(coords / 4);
}

function col(coords) {
  return coords % 4;
}

function coords(row, col) {
  return 4 * row + col;
}

var neighborOffsets = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

function findWords(board) {
  if (!board) {
    return null;
  }

  var foundWords = {};
  for (var i = 0; i < words.length; i++) {
    var word = words[i];

    var visited = (new Array(16)).fill(false);
    var exists = wordExists(word, -1, board, visited);

    if (exists) {
      if (!foundWords[word.length]) {
        foundWords[word.length] = [];
      }

      foundWords[word.length].push(word);
    }
  }

  return foundWords;
}

function wordExists(word, startCoords, board, visited) {
  // handle base case - try starting at every letter
  if (startCoords === -1) {
    for (var i = 0; i < 16; i++) {
      var exists = wordExists(word, i, board, visited);

      if (exists) {
        return true;
      }
    }

    return false;
  }

  // base case - out of word
  if (word.length === 0) {
    return true;
  }

  // Normal operation - look up letter and try from there
  var letter = board[startCoords];
  if (word.indexOf(letter) === 0) {
    // build array of valid neighbors
    var currentRow = row(startCoords);
    var currentCol = col(startCoords);
    var neighborCoords = [];
    for (var i = 0; i < neighborOffsets.length; i++) {
      var newRow = currentRow + neighborOffsets[i][0];
      var newCol = currentCol + neighborOffsets[i][1];

      if (newRow < 0 || newRow > 3 || newCol < 0 || newCol > 3) {
        continue;
      }

      var newCoords = coords(newRow, newCol);

      if (visited[newCoords]) {
        continue;
      }

      neighborCoords.push(newCoords);
    }

    // build next word and visited
    var nextWord = word.slice(letter.length);
    var nextVisited = Array.from(visited);
    nextVisited[startCoords] = true;

    // recursively check neighbors
    for (var i = 0; i < neighborCoords.length; i++) {
      var exists = wordExists(nextWord, neighborCoords[i], board, nextVisited);

      if (exists) {
        return true;
      }
    }

    // none of the neighbors worked, so the word must not be possible
    return false;
  } else {
    // the word doesn't even match this letter
    return false;
  }
}

function getBoard() {
  var inputs = document.getElementsByClassName('boggle-input');

  var board = new Array(16);
  for (var i = 0; i < 16; i++) {
    var letter = inputs[i].value.toLowerCase();

    if (!letter || letter.match(/[^a-z]/)) {
      return null;
    }

    if (letter === 'q') {
      letter = 'qu';
    }

    board[i] = letter;
  }

  return board;
}

function init() {
  document.getElementById('search').addEventListener('click', function() {
    var found = findWords(getBoard());

    var lengths = Object.keys(found);
    lengths.sort(function(a, b) {
      return parseInt(b, 10) - parseInt(a, 10);
    });

    var output = '';
    for (var i = 0; i < lengths.length; i++) {
      output += lengths[i] + ' letters:\n';
      output += found[lengths[i]].join('\n');
      output += '\n\n';
    }

    document.getElementById('results').innerHTML = output;
  });

  getBoard();
};
