import { useEffect, useState } from "react";
import RecipePage from "./Recipe";
import axios from "axios";

export default function APIRecipe({file}) {
    const [data, setData] = useState(null)
    async function reloadData() {
        const response = await axios.get(`https://api-digitalsymphony.ngrok.pizza/recipe/${file}`);
        setData(response.data);
    }
    useEffect(() => {
        reloadData();
    }, []);

    if (data) {
      return <RecipePage data={data} />;
    }
    return null;
}