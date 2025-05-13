import VisualObject from '../VisualObject';
import VisualStep from '../VisualStep';
import { VisualSteps } from '../VisualSteps';

export default function bubbleSortSteps(numbers) {
  const objects = numbers.map((n) => new VisualObject(n));
  let controller = new VisualSteps()
  controller.createStep(s => {
    s
    .cloneArray("array", [...objects])
  })
  const steps = [{ array: [...objects] }];

  const arr = [...objects]; // Use references

  for (let j = 0; j < arr.length - 1; j++) {
    let swapped = false
    controller.createStep(s => {
      s
      .cloneArray("array", arr)
      .justChanged("j", j)
      .justChanged("swapped", `${swapped}`)
    })
    for (let i = 0; i < arr.length - j - 1; i++) {
      controller.createStep(s => {
        s
        .cloneArray("array", arr, [i, i+1])
        .deselect("j")
        .justChanged("i", i)
        .deselect("swapped")
      })
      if (arr[i].value > arr[i + 1].value) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        swapped = true
        controller.createStep(s => {
          s
          .cloneArray("array", arr, [i, i+1])
          .maintain("j")
          .deselect("i")
          .justChanged("swapped", `${swapped}`)
        })
      }
      // else {
      //   pushStep(s => {
      //     s
      //     .cloneArray("array", arr, [i, i+1])
      //     .maintain("j")
      //     .deselect("i")
      //   })
      // }
      
    }
    if(!swapped) {
      break
    }
  }

  return controller.steps;
}
