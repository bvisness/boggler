#!/usr/bin/env python3

import json
import re

def makeList():
    with open('/usr/share/dict/words', 'r') as words:
        with open('words.js', 'w') as js:
            js.write('var words = [')

            for line in words:
                word = line.strip().lower()
                if len(word) < 3 or len(word) > 17:
                    continue
                if re.search(r'[^a-z]', word):
                    continue

                js.write('"' + word + '",')

            js.write('];')

def makeTrie():
    with open('/usr/share/dict/words', 'r') as words:
        with open('words.js', 'w') as js:
            trie = {}

            for line in words:
                word = line.strip().lower()
                if len(word) < 3 or len(word) > 17:
                    continue
                if re.search(r'[^a-z]', word):
                    continue
                if re.search(r'q[^u]', word):
                    continue

                currentNode = trie
                while word != '':
                    letter = word[0]
                    if letter == 'q':
                        letter = 'qu'

                    if letter not in currentNode:
                        currentNode[letter] = {}

                    currentNode = currentNode[letter]
                    word = word[len(letter):]

                currentNode['done'] = True

            js.write('var wordTrie = ')
            js.write(json.dumps(trie, separators=(',', ':')))
            js.write(';')

makeTrie()
