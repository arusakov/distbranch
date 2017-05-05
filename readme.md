distbranch
=========

[![Greenkeeper badge](https://badges.greenkeeper.io/arusakov/distbranch.svg)](https://greenkeeper.io/)
CLI tool for create special "dist" (distribution) branch from all local other branches merged into master.

Install this globally and you'll have access to the `distbranch` command anywhere on your system.

```shell
npm install -g distbranch
```

What does distbranch tool?
---------------
Chain of git commands (5, 7 - pseudo code):

1. git fetch upstream
* git checkout master
* git merge upstream/master (without exception if upstream not set)
* git branch -D dist && git checkout -b dist
* ``` for (b of local_branches) git checkout b && git pull origin b ```
* git checkout dist
* ``` for (b of local_branches) git merge -m "Merge branch 'b'" b ```
* git push -f origin dist
