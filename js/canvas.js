let runtimeCanvas = function() {
	let colors = [
		'#000000',
		'#ffffff',
		'#fbf305', // yellow
		'#ff6403', // orange
		'#dd0907', // red
		'#f20884', // magenta
		'#4700a5', // purple
		'#0000d3', // blue
		'#02abea', // cyan
		'#1fb714', // green
		'#006412', // dark green
		'#562c05', // brown
		'#90713a', // tan
		'#C0C0C0', // silver (light gray)
		'#808080', // gray (medium gray)
		'#404040' // dark gray
	]

	let ctx = null;
	let el = null;
	let width = null;
	let height = null;
	let widthInBlocks = 24;
	let heightInBlocks = 24;
	let blockSize = -1;

    let pixels = [];
    
    var crateImg = new Image();
    crateImg.src = './img/crate.png';

    var crateGreenImg = new Image();
    crateGreenImg.src = './img/crate_green.png';

    var characterImg = new Image();
    characterImg.src = './img/char.gif';

    var crossImg = new Image();
    crossImg.src = './img/cross.gif';

	function init(element) {
		if (element && el === null) {
			el = element
		}
		ctx = el.getContext('2d');
		width = el.width;
		height = el.height;
		ctx.fillStyle = "#000";
		ctx.fillRect(0, 0, width, height);
		blockSize = Math.floor(width / widthInBlocks);
	}

	function drawPixel(x, y, value) {
		if (x > widthInBlocks || x < 0 || y > heightInBlocks || y < 0) {
			return;
		}
		x = parseInt(x)
		y = parseInt(y)
		pixels[widthInBlocks*x+y] = value;
		ctx.fillStyle = colors[parseInt(value)];

        if (value === 3) {
            ctx.drawImage(crateImg, x * blockSize, y * blockSize, blockSize, blockSize);
        } else if (value === 8) {
            ctx.drawImage(characterImg, x * blockSize, y * blockSize, blockSize, blockSize);
        } else if (value === 12) {
            ctx.fillStyle = colors[13];
            ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
            ctx.globalAlpha = 0.2;
            ctx.drawImage(crossImg, x * blockSize, y * blockSize, blockSize, blockSize);
            ctx.globalAlpha = 1;
        } else if (value === 2) {
            ctx.drawImage(crateGreenImg, x * blockSize, y * blockSize, blockSize, blockSize);
        } else {
            ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
        }
		
	}

	function getPixel(x, y) {
		x = parseInt(x)
		y = parseInt(y)
		return pixels[widthInBlocks*x+y] | 0;
	}

	function clearCanvas(size=24) {
		widthInBlocks = size;
		heightInBlocks = size;
		init();
		for (let i = 0 ; i < widthInBlocks; i++) {
			for (let j = 0; j < heightInBlocks; j++) {
				drawPixel(i, j, 0);
			}
		}
	}

	return {
		init,
		drawPixel,
		getPixel,
		clearCanvas
	};
};
