function row(coords) {
  return Math.floor(coords / 4);
}

function col(coords) {
  return coords % 4;
}

function crd(row, col) {
  return 4 * row + col;
}

var neighborOffsets = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

function validNeighbors(coords, visited) {
  var currentRow = row(coords);
  var currentCol = col(coords);
  var neighborCoords = [];
  for (var i = 0; i < neighborOffsets.length; i++) {
    var newRow = currentRow + neighborOffsets[i][0];
    var newCol = currentCol + neighborOffsets[i][1];

    if (newRow < 0 || newRow > 3 || newCol < 0 || newCol > 3) {
      continue;
    }

    var newCoords = crd(newRow, newCol);

    if (visited[newCoords]) {
      continue;
    }

    neighborCoords.push(newCoords);
  }

  return neighborCoords;
}

function findWords(board) {
  if (!board) {
    return null;
  }

  var allWords = [];
  for (var i = 0; i < 16; i++) {
    var visited = (new Array(16)).fill(false);
    var words = getWordsTrie(board[i], i, wordTrie[board[i]], board, visited);
    allWords = allWords.concat(words);
  }

  return allWords;
}

function getWordsTrie(wordSoFar, coords, node, board, visited) {
  var words = [];
  visited[coords] = true;

  if (node['done']) {
    words.push(wordSoFar);
  }

  var neighborCoords = validNeighbors(coords, visited);

  for (var i = 0; i < neighborCoords.length; i++) {
    var letter = board[neighborCoords[i]];

    if (node[letter]) {
      var subWords = getWordsTrie(wordSoFar + letter, neighborCoords[i], node[letter], board, Array.from(visited));
      words = words.concat(subWords);
    }
  }

  return words;
}

function wordExists(word, coords, board, visited) {
  // handle base case - try starting at every letter
  if (coords === -1) {
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
  var letter = board[coords];
  if (word.indexOf(letter) === 0) {
    neighborCoords = validNeighbors(coords, visited);

    // build next word and visited
    var nextWord = word.slice(letter.length);
    var nextVisited = Array.from(visited);
    nextVisited[coords] = true;

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

function search() {
  var found = findWords(getBoard());

  var foundByLength = {};
  for (var i = 0; i < found.length; i++) {
    if (!foundByLength[found[i].length]) {
      foundByLength[found[i].length] = [];
    }

    foundByLength[found[i].length].push(found[i]);
  }

  var lengths = Object.keys(foundByLength);
  lengths.sort(function(a, b) {
    return parseInt(b, 10) - parseInt(a, 10);
  });

  var output = '';
  for (var i = 0; i < lengths.length; i++) {
    output += lengths[i] + ' letters:\n';
    output += foundByLength[lengths[i]].join('\n');
    output += '\n\n';
  }

  document.getElementById('results').innerHTML = output;
}

function allFull() {
  var result = true;
  document.querySelectorAll('.boggle-input').forEach(function(i) {
    if (!i.value) {
      result = false;
    }
  });

  return result;
}

function init() {
  document.body.addEventListener('keydown', function(event) {
    if (event.code === 'Enter' || event.code === 'Space') {
      search();
    }
  });

  document.getElementById('search').addEventListener('click', function() {
    search();
  });

  var inputs = document.querySelectorAll('.boggle-input');
  inputs.forEach(function(input, index) {
    input.addEventListener('focus', function() {
      if (input.value) {
        input.dataset.previousValue = input.value;
      }

      input.value = '';
    });

    input.addEventListener('blur', function() {
      if (input.dataset.previousValue) {
        input.value = input.dataset.previousValue;
      }      

      document.querySelector('#search').disabled = !allFull();
    });

    input.addEventListener('input', function(e) {
      if (!e.target.value.match(/[a-zA-Z]/)) {
        e.target.value = '';
      }

      if (e.target.value === 'Q' || e.target.value === 'q') {
        e.target.classList.add('qu');
      } else {
        e.target.classList.remove('qu');
      }

      if (e.target.value.length > 0) {
        delete input.dataset.previousValue;
        if (inputs[index + 1]) {
          inputs[index + 1].focus();
        } else {
          input.blur();
        }
      }
    });
  });
};
