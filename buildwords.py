#!/usr/bin/env python3

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

makeList()
