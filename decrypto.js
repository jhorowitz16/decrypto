var localization;
var lang;
var wordList;
var words;

function loadLocalization() {
  var localization;

  $.ajax({
    url: "localization.txt",
    dataType: "text",
    success: function (data) {
      localization = data.split("\n");
    },
    async: false
  });
  return localization;
}

function changeLanguage(language) {
  lang = language;
  $('#newGameButton').text(localization[0].split(",")[lang]);
  $('#newGameModalLabel').text(localization[0].split(",")[lang]);
  $('#dropdownMenuButton').text(localization[1].split(",")[lang]);
  $('#codeModalLongTitle').text(localization[1].split(",")[lang]);
  $('#revealCodeButton').text(localization[2].split(",")[lang]);
  $('#generateNewCodeButton').text(localization[3].split(",")[lang]);
  $('#languageButton').text(localization[4].split(",")[lang]);
  $('#newGameModalQuestion').text(localization[5].split(",")[lang]);
  $('#newGameModalCancelButton').text(localization[6].split(",")[lang]);
  $('#newGameModalStartButton').text(localization[7].split(",")[lang]);
  setWords();
}

function loadWordList() {
	var wordList;

	$.ajax({
            url : "wordlist.txt",
            dataType: "text",
            success : function (data) {
            	wordList = data.split("\n");
            },
            async: false
        });
	return wordList;
}

function pickWords(numWords) {
  const picks = [];
  for (let i = 0; i < numWords; i += 1) {
    picks.push(wordList.splice(~~(Math.random() * wordList.length), 1)[0]);
  }
  return picks;
	
	// return _.sample(wordList, numWords);
}

function generateCode() {
	var code = _.sample([1,2,3,4], 3);
	Cookies.set("code", code);
	setCode(code);
	$('#codeModal').modal('show');
}

function setCode(code) {
	for(idx = 0; idx < 3; idx++) {
		$('#code' + idx).text(code[idx]);
	}
	$('#revealCodeButton').show();
}

function setWords() {
	for(idx = 0; idx < 4; idx++) {
    $('#word' + idx).text(words[idx].split(",")[lang]);
	}
}

function loadWords() {
	// return Cookies.getJSON("words");
	return pickWords(4);
}

function loadCode() {
	var code = Cookies.getJSON("code");
	if (code) {
		setCode(code);
	} else {
		$('#revealCodeButton').hide();
	}
}

function newGame() {
	words = pickWords(4);
	// Cookies.set("words", words);
	Cookies.remove("code");
	$('#revealCodeButton').hide();
}

function toggleFullScreen() {
	if (screenfull.isFullscreen) {
		screenfull.exit();
	} else {
		screenfull.request();
	}
	setFullScreenIcon();
}

function setFullScreenIcon() {
    if (screenfull.isFullscreen) {
		$('#enableFullScreen').hide();
		$('#disableFullScreen').show();
    } else {
		$('#enableFullScreen').show();
		$('#disableFullScreen').hide();
    }
}

function startNewGame() {
  newGame();
	setWords();
}

function disableScreenLock() {
	var noSleep = new NoSleep();
	noSleep.enable();
}

function initScreenfull() {
	var noSleep = new NoSleep();

	if (screenfull.enabled) {
		screenfull.on('change', () => {
			if (screenfull.isFullscreen) {
				noSleep.enable();
			} else {
				noSleep.disable();
			}
		});
        setInterval(setFullScreenIcon, 200);
    } else {
        $('#fullScreenButton').hide();
        $('#disableScreenLockModal').modal('show');
    }
}

function initialize() {
	initScreenfull();

	localization = loadLocalization();
  lang = 0;
	wordList = loadWordList();
	loadCode();

	words = loadWords();

	if (words) {
		setWords(words);
	} else {
		/*
		startNewGame();
		$('#newGameModalCancelButton').hide();
		$('#newGameModal').modal({
			show: true,
			keyboard: false,
			backdrop: 'static'
		});
		*/
		$('#newGameModal').modal('show');
	}
}
