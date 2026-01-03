import axios from "axios"
import { useEffect, useState } from "react"
import FlatItemsTableView from "./FlatItemsTableView"
import { useParams } from "react-router-dom"

export default function FlatItemsTableAPIView() {
    const [items, setItems] = useState([])
    const [open, setOpen] = useState(false)
    const { file } = useParams();
    useEffect(() => {
        reloadData()
    }, [])
    async function reloadData() {
        let res = await axios.get(`https://api-digitalsymphony.ngrok.pizza/curriculum/${file}`)
        setItems(res.data)
    }
    async function updateItem(item) {
        await axios.post(`https://api-digitalsymphony.ngrok.pizza/curriculum/${file}`, item)
        await reloadData()
        setOpen(false)
    }

    async function deleteItem(id) {
        await axios.delete(`https://api-digitalsymphony.ngrok.pizza/curriculum/${file}/${id}`)
        await reloadData()
        setOpen(false)
    }
    return <FlatItemsTableView items={items} open={open} onUpdate={() => {
        setOpen(true)
    }} onUpdateComplete={(data) => {
        updateItem(data)
    }} onOpenChange={(next) => {
        setOpen(next)
    }} onDelete={(id) => {
        deleteItem(id)
    }} basePath="/items" />
}