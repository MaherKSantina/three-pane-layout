import { useEffect, useState } from "react"
import SplitPane from "./SplitPane3"
import FullHeightListWithAddDialog from "./FullHeightListWithAddDialog"
import NetworkGraphEditor from "./NetworkGraphEditor"
import axios from "axios"

export default function DefaultRender() {
  const [currentItem, setCurrentItem] = useState(null)
  const [initialNodes, setInitialNodes] = useState([])
  const [initialEdges, setInitialEdges] = useState([])

  async function getNodesAndEdges() {
    if(!currentItem) return
    let response = await axios.get(`http://localhost:3000/items/${currentItem.id}/graph`)
    const { nodes, edges } = response.data
    setInitialNodes(nodes)
    setInitialEdges(edges.map(x => {
      return {
        id: x.id,
        label: x.label,
        from: x.sourceNodeId,
        to: x.targetNodeId,
        font: {align: "top"},
        arrows: "to"
      }
    }))
  }

  async function saveNodesAndEdges(nodes, edges) {
    if(!currentItem) return
    let response = await axios.post(`http://localhost:3000/items/${currentItem.id}/graph`, {
      nodes,
      edges
    })
  }

  useEffect(() => {
    getNodesAndEdges()
  }, [currentItem])
  return <SplitPane initialSplit={0.2} left={<FullHeightListWithAddDialog listKey={"processes"} onItemClick={(i) => {
    // if(i.id !== currentItem?.id) {
      setCurrentItem(i)
    // }
    
  }}></FullHeightListWithAddDialog>} right={<NetworkGraphEditor initialNodes={initialNodes} initialEdges={initialEdges} onSave={(nodes, edges) => {
    saveNodesAndEdges(nodes, edges)
  }}></NetworkGraphEditor>}></SplitPane>
}