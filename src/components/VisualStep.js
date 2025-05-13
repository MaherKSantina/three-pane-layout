import { v4 as uuidv4 } from 'uuid';
import VisualObject from './VisualObject';

export default class VisualStep {
  constructor(previousStep) {
    this.previousStep = previousStep;
    this.step = {}
  }

  justChanged(key, value, highlighted = true) {
    this.step[key] = new VisualObject(value, highlighted)
    return this
  }

  deselect(key) {
    return this.maintain(key, (obj) => obj.isHighlighted = false)
  }

  cloneArray(key, array, highlightedIndices = []) {
    let newArray = []
    for(let a of array) {
        newArray.push(a.clone())
    }
    for(let i = 0; i < newArray.length; i++) {
        newArray[i].isHighlighted = highlightedIndices.includes(i)
    }
    this.step[key] = newArray
    return this
  }

  clonePreviousArray(key, highlightedIndices = []) {
    return this.cloneArray(key, this.previousStep[key], highlightedIndices)
  }

  maintain(key, changing = null) {
    if(this.previousStep[key]) {
        let item = this.previousStep[key].clone()
        changing?.(item)
        this.step[key] = item
    }
    
    return this
  }

  publish() {
    return this.step
  }
}