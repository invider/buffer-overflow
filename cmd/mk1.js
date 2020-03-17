function mk1() {
    const bot = lab.world.getTarget()
    bot.cpu.installAndRun(lib.chip.mk1)
    lab.world.release()
}
