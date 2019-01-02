#!/usr/bin/env python3

import os
import shutil
import subprocess

FILES = [
    'words.js',
    'script.js',
    'normalize.css',
    'style.css',
];

def gitHash():
    return subprocess.check_output(['git', 'rev-parse', '--short', 'HEAD']).decode('utf-8').strip()

if os.path.exists('dist'):
    shutil.rmtree('dist')
if not os.path.exists('dist'):
    os.makedirs('dist')

with open('index.html', 'r') as index:
    contents = index.read()
    hsh = gitHash()

    print('Prefixing filenames with hash: ' + hsh)

    for filename in FILES:
        newName = hsh + '-' + filename
        contents = contents.replace(filename, newName)
        shutil.copyfile(filename, 'dist/' + newName)

    with open('dist/index.html', 'w') as di:
        di.write(contents)
