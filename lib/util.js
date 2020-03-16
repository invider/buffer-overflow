function loadChipFile(file) {
	let input = file.target

	let reader = new FileReader()
	reader.onload = function(){
		let src = reader.result
        const chip = lib.ext.sneeze(src)
        const bot = lab.status.selectedTarget()

        if (!bot) {
            log.warn('no target for the chip!')
            // TODO denied sfx
            return
        }

        bot.cpu.installAndRun(chip)
        log('loaded new chip into ' + bot.name)
        console.dir(chip)
        log(chip.toString())
	};
	reader.readAsText(input.files[0]);
}

function loadChip() {
	let input = document.createElement('input')
	input.setAttribute('type', 'file')
	input.setAttribute('accept', 'text/sneeze')
	input.setAttribute('onchange', "$.lib.util.loadChipFile(event)")
	input.click()
}
