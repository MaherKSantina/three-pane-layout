import { Button } from "@mui/material";
import MatrixListWithDetails from "../MatrixListWithDetails";
import SplitPane from "../SplitPane3";
import { useEffect, useState } from "react";
import DataPartCreateDialog from "./DataPartCreateDialog";
import axios from "axios";
import DataPartBoard from "./DataPartBoard";

function LeftView({parentId, onReload}) {

    const [items, setItems] = useState([])

    useEffect(() => {
        fetchData()
    }, [parentId])

    async function fetchData() {
        const res = await axios.get(`https://api-digitalsymphony.ngrok.pizza/api/dataparts/${parentId}/experiment`)
        setItems(res.data || [])
    }

    async function addMainDataPart(data, addParentId) {
        // console.log(data)
        await axios.post(`https://api-digitalsymphony.ngrok.pizza/api/dataparts/${addParentId ?? parentId}/experiment`, data)
        fetchData()
    }

    async function addDataDataPart(data, addParentId) {
        await axios.post(`https://api-digitalsymphony.ngrok.pizza/api/dataparts`, {
            ...data,
            parent: {
                id: addParentId
            }
        })
        fetchData()
    }

    async function deleteDatapart(childId) {
        await axios.delete(`https://api-digitalsymphony.ngrok.pizza/api/dataparts/${childId}`)
        fetchData()
    }

    return (
      <DataPartBoard
        onReload={onReload}
          items={items}
          onRequestAddMain={(data, pId) => addMainDataPart(data, pId)}
          onRequestAddChild={(data, pId) => addDataDataPart(data, pId)}
          onDeleteDataPart={(childId) => deleteDatapart(childId)}
        />
    );
}

function RightView({currentRequestId}) {
    return currentRequestId ? <MatrixListWithDetails
          identifier="requestsMatrices"
          matrixId={currentRequestId}
        /> : <div style={{padding: 20}}>Select a request to see details</div>
}

export default function ExperimentView({parentId}) {

    const [dataPartDialogOpen, setDataPartDialogOpen] = useState(false);
    const [currentRequestId, setCurrentRequestId] = useState(null);

    async function saveData(data) {
        await axios.post("https://api-digitalsymphony.ngrok.pizza/api/dataparts", data)
        setDataPartDialogOpen(false);
    }

    async function handleReload() {
        if(currentRequestId) {
            await axios.delete(`https://api-digitalsymphony.ngrok.pizza/api/requests/${currentRequestId}`)
            setCurrentRequestId(null)
        }
        
        let res = await axios.post(`https://api-digitalsymphony.ngrok.pizza/api/requests/experiment/${parentId}`)
        setCurrentRequestId(res.data.id)
    }

    return <><SplitPane initialSplit={0.5} left={
        <LeftView parentId={parentId} onReload={handleReload}></LeftView>
    } right={<RightView currentRequestId={currentRequestId}></RightView>}>
        
    </SplitPane>
    <DataPartCreateDialog open={dataPartDialogOpen} onClose={() => setDataPartDialogOpen(false)} onSave={saveData}></DataPartCreateDialog> </> 
}