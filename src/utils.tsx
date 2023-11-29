import { OrderJson, PartInOrder, OrderObj, DataType } from "./App";

export const editOrderJson = async (orderList: OrderObj) => {
    const orderJson: OrderJson = { selectedParts: [] };
    const list = Object.keys(orderList).reduce((acc: PartInOrder[], e: string) => {
        let partObj: PartInOrder = { id: parseInt(e), quantity: orderList[parseInt(e)] }
        acc.push(partObj);
        return acc;
    }, [])
    orderJson.selectedParts = list;
    return orderJson
}