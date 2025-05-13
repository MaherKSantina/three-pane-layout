import VisualObject from '../VisualObject';
import VisualStep from '../VisualStep';

export default function merge(nums1, m, nums2, n) {
    let nums1Objects = [...nums1.map((n) => new VisualObject(n))]
    let nums2Objects = [...nums2.map((n) => new VisualObject(n))]
  const steps = [
    { 
        nums1: [...nums1Objects],
        m: new VisualObject(m),
        nums2: [...nums2Objects],
        n: new VisualObject(n)
    }
];

  function getLastStep() {
    return steps[steps.length - 1]
  }

  function pushStep(changes) {
    let s = new VisualStep(getLastStep())
    changes(s)
    steps.push(s.publish())
  }

  for(let i = 0; i < n; i++) {
    pushStep((s) => {
        s
        .cloneArray("nums1", [...nums1Objects], [i + m])
        .maintain("m")
        .cloneArray("nums2", [...nums2Objects], [i])
        .maintain("n")
        .justChanged("i", i)
      })
    nums1Objects[i + m] = nums2Objects[i]
    nums2Objects[i] = nums1Objects[i + m].clone(false)
    pushStep((s) => {
        s
        .cloneArray("nums1", [...nums1Objects], [i + m])
        .maintain("m")
        .cloneArray("nums2", [...nums2Objects], [i])
        .maintain("n")
        .maintain("i")
      })
}

  return steps;
}
