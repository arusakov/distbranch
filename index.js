var path = require('path');
var statSync = require('fs').statSync;
var execSync = require('child_process').execSync;
var exec = require('child_process').exec;

var REMOTES = 'remotes/';
var REMOTES_ORIGIN = 'remotes/origin/';
var UPSTREAM = 'upstream';
var MASTER = 'master';
var DIST = 'dist';

var cmds = {
  git_branch_all: 'git branch -a',
  git_branch_D: 'git branch -D ',
  git_checkout: 'git checkout ',
  git_fetch: 'git fetch',
  git_merge: 'git merge ',
  git_pull_origin: 'git pull origin ',
  git_push_origin: 'git push origin '
};

function filterBranches(branches) {
  var arr = branches.trim().split(/\*\s+|\s*\r?\n\s*/g);
  var filtered = [];
  var dict = {};
  for (var i = 0; i < arr.length; ++i) {
    var name = arr[i];
    if (!name || name.indexOf(REMOTES) === 0) {
      continue;
    }
    if (name !== 'master' && name !== 'dist' && !(name in dict)) {
      dict[name] = 1;
      filtered.push(name);
    }
  }
  return filtered;
}

function createDistBranch(pathToFolder) {
  statSync(path.join(pathToFolder, '.git'));

  execSync(cmds.git_fetch);

  execSync(cmds.git_checkout + MASTER);
  try {
    execSync(cmds.git_merge + UPSTREAM + '/' + MASTER);
  } catch (e) {
    // silently
  }

  try {
    execSync(cmds.git_branch_D + DIST);
  } catch (e) {
    // silently
  }
  execSync(cmds.git_checkout + '-b ' + DIST);

  var branches = execSync(cmds.git_branch_all).toString();
  branches = filterBranches(branches);

  branches.forEach((br) => {
    execSync(cmds.git_checkout + br);
    execSync(cmds.git_pull_origin + br);
  });

  execSync(cmds.git_checkout + DIST);

  branches.forEach((br) => {
    execSync(cmds.git_merge + '-m "Merge branch ' + br + '" ' + br);
  });

  execSync(cmds.git_push_origin + '-f ' + DIST)
}

createDistBranch(process.cwd());
