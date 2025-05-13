import VisualStep from "./VisualStep"

export class VisualSteps {
    constructor() {
        this.steps = []
    }

    createStep(changes) {
        let s = new VisualStep(this.steps[this.steps.length - 1])
        changes?.(s)
        this.steps.push(s.publish())
        return this
    }
}