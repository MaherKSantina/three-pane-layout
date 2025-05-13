import bubbleSortSteps from './algorithms/bubbleSortSteps';
import merge from './algorithms/merge';
import ArraySwapVisualizer from './ArraySwapVisualizer';

import VisualObject from './VisualObject';
import VisualStep from './VisualStep';
import { VisualSteps } from './VisualSteps';

const a = new VisualObject(5);
const b = new VisualObject(2);
const c = new VisualObject(8);
const d = new VisualObject(4);

const steps = [
  {
    mainArray: [a, b, c, d],
    i: new VisualObject(0),
    j: new VisualObject(1),
  },
  {
    mainArray: [b, a, c, d],
    i: new VisualObject(1),
    j: new VisualObject(2),
  },
  {
    mainArray: [b, a, d, c],
    i: new VisualObject(2),
    j: new VisualObject(3),
  },
  {
    mainArray: [b, a, d, c],
    i: new VisualObject(null),
    j: new VisualObject(null),
  },
];

const meta = {
  component: ArraySwapVisualizer,
};

export default meta;

export const Bubble = {
  args: {
    numbers: [1, 5, 3, 4],
  },
  render: ({ numbers }) => {
    const steps = bubbleSortSteps(numbers);
    return <ArraySwapVisualizer steps={steps} />;
  },
};

export const Merge = {
  args: {
    nums1: [1, 5, 3, 0, 0, 0],
    m: 3,
    nums2: [2, 4, 6],
    n: 3,
  },
  render: ({ nums1, m, nums2, n }) => {
    const steps = merge(nums1, m, nums2, n);
    return <ArraySwapVisualizer steps={steps} />;
  },
};

export const Manual = {
  args: {},
  render: () => {
    let nums1Objects = [1, 5, 4].map((n) => new VisualObject(n))
    let nums2Objects = [2, 4, 5].map((n) => new VisualObject(n))
    let visualSteps = new VisualSteps()
    visualSteps
    .createStep(s => {
      s.cloneArray("nums1", nums1Objects)
      s.cloneArray("nums2", nums2Objects)
    })
    .createStep(s => {
      let newNums1 = [...nums1Objects, nums2Objects[0].clone()]
      let newNums2 = [nums2Objects[0].clone(false), nums2Objects[1], nums2Objects[2]]
      s.cloneArray("nums1", newNums1)
      s.cloneArray("nums2", newNums2)
    })
    return <ArraySwapVisualizer steps={visualSteps.steps} />;
  },
};