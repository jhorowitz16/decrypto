var wordList;

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
	console.log(numWords);
	console.log(wordList.length);

	const queryString = window.location.search;
	const seed = queryString.split('=')[1];
	console.log(queryString);
	
	const PRIME = 37;
	
	return seed.split('').map(c => {
		const idx = (c.charCodeAt(i) * PRIME) % wordList.length;
		console.log(idx);
		return wordList[idx];
	}).slice(0, 4);
	
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

function setWords(words) {
	for(idx = 0; idx < 4; idx++) {
		$('#word' + idx).text(words[idx]);
	}
}

function loadWords() {
	return Cookies.getJSON("words");
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
	var words = pickWords(4);
	Cookies.set("words", words);
	Cookies.remove("code");
	$('#revealCodeButton').hide();
	return words;
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
	setWords(newGame());
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

	wordList = loadWordList();
	loadCode();

	var words = loadWords();

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
