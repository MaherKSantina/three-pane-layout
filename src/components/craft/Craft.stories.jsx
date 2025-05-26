import { CraftContext } from '../../contexts/StoreContext';
import { useCraftLocalStore } from '../../stores/craft.local';
import Craft from './Craft';

const meta = {
  component: Craft,
};

export default meta;

export const Default = {
  render() {
    return (
      <CraftContext.Provider value={useCraftLocalStore("story/default")}>
        <Craft style={{width: "100%", height: "100%"}}></Craft>
      </CraftContext.Provider>
    )
  }
};