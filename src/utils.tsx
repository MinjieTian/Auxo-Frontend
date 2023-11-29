import { FormInstance } from "antd";
import { OrderJson, PartInOrder, OrderObj, DataType, NewPartsType, OrderResult } from "./App";
import axios from 'axios';

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

export const useCreatePart = (setLoading: React.SetStateAction<any>, setShowModal: React.SetStateAction<any>, setParts: React.SetStateAction<any>, form: FormInstance<any>) => {
    const onCreatePart = async (value: NewPartsType) => {
        setLoading(true);
        try {
            const result = await axios.post('http://localhost:5189/parts', {
                price: value.price,
                description: value.description,
                quantity: value.quantity
            })
            form.resetFields();
            setLoading(false);
            setShowModal(false);
            setParts(result.data.result)
        } catch (err) {
            console.log(err);
        }
        setShowModal(false);
        setLoading(false);
    }
    return { onCreatePart }
}

export const usePlaceOrder = (setLoading: React.SetStateAction<any>, setParts: React.SetStateAction<any>, setOrderList: React.SetStateAction<any>, orderList: OrderObj) => {

    const onPlaceOrder = async () => {
        const orderJson = await editOrderJson(orderList);
        setLoading(true);
        try {
            const result: OrderResult = (await axios.post('http://localhost:5189/orders', orderJson)).data;
            const parts = await axios.get('http://localhost:5189/parts');
            setParts(parts.data.result)
            let resultString = `Your total price is ${(result.totalPrice).toFixed(2)}\n`;
            result.items.forEach((e) => { resultString = resultString + `${e.description}    Quantity: ${e.quantity}    Price: ${e.price.toFixed(2)} \n` })
            alert(resultString);
        } catch (err: any) {
            console.log(err)
        }
        setOrderList({});
        setLoading(false);
    }
    return { onPlaceOrder };
}