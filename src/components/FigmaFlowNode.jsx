import FigmaFlowScreen from './FigmaFlowScreen';

function FigmaFlowScreenNode({ data }) {
    return (<FigmaFlowScreen label={data.label} selected={data.selected}></FigmaFlowScreen>)
}

export default FigmaFlowScreenNode;
