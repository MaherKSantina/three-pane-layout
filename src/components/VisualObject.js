import { v4 as uuidv4 } from 'uuid';

function getRandomColor() {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 80%, 80%)`; // pastel-style
}

export default class VisualObject {
  constructor(value, isHighlighted = false) {
    this.id = uuidv4();
    this.value = value;

    // Highlighting
    this.isHighlighted = isHighlighted;
    this.highlightColor = getRandomColor(); // assigned on creation
  }

  clone(withID = true) {
    let obj = new VisualObject(this.value, this.isHighlighted)
    obj.highlightColor = this.highlightColor
    if(withID) {
        obj.id = this.id
    }
    
    return obj
  }

  changing(completion) {
    completion(this)
    return this
  }
}