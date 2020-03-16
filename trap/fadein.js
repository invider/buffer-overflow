function fadein() {
    lab.spawn(dna.Transition, {
        Z: 1001,
        fadein: 0,
        keep: .5,
        fadeout: 1,

        onFadeout: function() {
            lab.spash.show()
        }
    })
}
