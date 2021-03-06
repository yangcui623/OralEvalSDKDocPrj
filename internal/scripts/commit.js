var version = require("./version.js").version;

var commitInfo = function(rslt){
    var self = this;
    this.hash = rslt[1];
    this.sdk = rslt[2];
    this.ver = new version([rslt[3] * 1, rslt[4] * 1, rslt[5] * 1]);
    this.bug = rslt[6]=='y';
    this.feature = rslt[7]=='y';
    this.api = rslt[8]=='y';
    this.msg = rslt[9];

    this.str = function(){
        return self.hash + ' ' + self.msg;
    }
}

var getInfos = function(commits){
    var reg = /^([a-f0-9]{40})[ \t]+([^ \t]+)[ \t]+([0-9]+)\.([0-9]+)\.([0-9]+)[ \t]+([yn])[ \t]+([yn])[ \t]+([yn])[ \t]+(.*)/;
    var commitLines = commits.split('\n');
    var newCommits = [];
    commitLines.forEach(function(l){
        var rslt = reg.exec(l);
        if(rslt && rslt.length == 10){
            var info = new commitInfo(rslt);
            newCommits.push(info);
        }
    });
    return newCommits;
}

var getNewVersion = function(commits, lastVer, s){
    var commitLines = commits.split('\n');
    var newCommits = [];
    var ver = new version([0,0,0]);
    var reg = /^([a-f0-9]{40})[ \t]+([^ \t]+)[ \t]+([0-9]+)\.([0-9]+)\.([0-9]+)[ \t]+([yn])[ \t]+([yn])[ \t]+([yn])[ \t]+(.*)/;
    commitLines.forEach(function(l){
        var rslt = reg.exec(l);
        if(rslt && rslt[2] == s){
            var info = new commitInfo(rslt);
            ver = ver.add(info.ver);
            if(ver.gt(lastVer)){
                newCommits.push(info);
            }
        }
    });
    if(newCommits.length > 0){
        ver.changes = newCommits;
        return ver;
    }
    return null;
}

exports.commit = commitInfo;
exports.getNewVersion = getNewVersion;
exports.getCommitInfos = getInfos;