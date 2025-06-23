import { useCraftLocalStore } from "../../stores/craft.local";
import { CraftVerticalCanvas } from "./craft/CraftVerticalCanvas";
import Craft from "../craft/Craft";
import { Button, Stack } from "@mui/material";
import { useNode } from "@craftjs/core";
import { CraftSingleItem } from "./craft/CraftSingleItem";

function Stage({children}) {
    return <CraftVerticalCanvas title={"Stage"} children={children}></CraftVerticalCanvas>
}

function StageSettings() {
    const {
        actions: { setProp },
    } = useNode();

    return (
        <Stack spacing={2} sx={{ p: 2 }}>
        <Button>Open</Button>
        </Stack>
    );
}

Stage.craft = {
    displayName: "Stage",
    props: {},
    canvas: true,
    related: {
        settings: StageSettings
    }
  };

  Stage.toolbox = (connectors) => {
    return (
      <div ref={ref => connectors.create(ref, <Stage></Stage>)}>
          <button style={{ width: "100%" }}>Stage</button>
      </div>
    )
  }

export default function TransactionsCraft() {
    return <Craft style={{ width: "100%", height: "100%" }} resolver={{
        Stage,
        CraftSingleItem
            }} toolbox={[Stage, CraftSingleItem]} craftStore={useCraftLocalStore("transactions/default")}></Craft>
}