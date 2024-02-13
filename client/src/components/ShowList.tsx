import { useEffect, useState } from "react";
import IDataList from "../model/IDataList";
import { getDataFromServer, pushDataFromUser } from "../services/menu";
import ExpenseTracker from "./ExpenseTracker";

export default function ShowData(){

    const [items, setItems] = useState<IDataList[]>([]);
    const [error, setError] = useState<Error|null>(null);
    const [sum, setSum] = useState<number|null>(0);
    const [RishabhSpent, setRishabhSpent] =  useState<number>(0);
    const [ChauhanSpent, setChauhanSpent] =  useState<number>(0);
    const [showForm, setShowForm] = useState<boolean>(false);

    useEffect(()=>{
        const fetchMenu = async () => {
            try{
                const data = await getDataFromServer();
                console.log(data);
                setItems(data);
                // data.reduce
                setSum(data.reduce((result,v) =>  result + v.price , 0 ))
                calculateShares(data);
                // let newPurchase = {
                //     "payeeName": "Rishabh",
                //     "product": "water",
                //     "price": 100,
                //     "setDate": "2022-10-30",
                // }
                // const purchasedData = await pushDataFromUser(newPurchase);
                // console.log(purchasedData);
            }
            catch(error: any){
                console.error(error);
                setError(error);
            }
        }
        fetchMenu();
    },[showForm]);
 
    const calculateShares = (data: IDataList[]) => {
        // Use data.map... 
        // figure out how much Rishabh, Chauhan spent
        // setRishabhSpent
        //setChauhanSpent
        var Rishabhspent1 : number = 0
        var Chauhanspent1 : number = 0
        data.map(
            sams => (
                sams.payeeName === "Rishabh" ? (
                    Rishabhspent1 = Rishabhspent1 + sams.price
                ):
                (
                    Chauhanspent1 = Chauhanspent1 + sams.price
                )
            )
        )
        setRishabhSpent(Rishabhspent1)
        setChauhanSpent(Chauhanspent1)
    }
    

    //header... Expense Tracker
    // headers of the table
    // create rows for the table
    // Display total, Rishabh paid, Chauhan paid 
    return (
        <>
            <header id="page-Header">Expense Tracker</header>
            {/* Add button */}
            <button id="Add-Button" onClick={()=>setShowForm(true)}>Add</button>
            {
                showForm && (
                    <div className="form">
                        <ExpenseTracker onTrue={()=>setShowForm(false)} onClose={()=>setShowForm(false)}></ExpenseTracker>
                    </div>
                )
            }
            <>
                <div className="use-inline date header-color">Date</div>
                <div className="use-inline header-color">Product Purchased</div>
                <div className="use-inline price header-color">Price</div>
                <div className="use-inline header-color" style={{width: 112}}>Payee</div>
            </>
            {
                items && items.map ((user,idx)=>{
                    return (<div key={idx}>
                        <div className="use-inline date">{user.setDate}</div>
                        <div className="use-inline">{user.product}</div>
                        <div className="use-inline price">{user.price}</div>
                        <div className={`use-inline ${user.payeeName}`}>{user.payeeName}</div>
                    </div>)
                })
            }
        <hr/>
        <div className="use-inline ">Total: </div>
        <span className="use-inline total">{sum}</span> <br />
        <div className="use-inline ">Rishabh paid: </div>
        <span className="use-inline total Rishabh">{RishabhSpent}</span> <br />
        <div className="use-inline ">Chauhan paid: </div>
        <span className="use-inline total Chauhan">{ChauhanSpent}</span> <br />
        <span className="use-inline payable">{RishabhSpent>ChauhanSpent? "Pay Rishabh " : "Pay Chauhan"}</span>
        <span className="use-inline payable price"> {Math.abs((RishabhSpent-ChauhanSpent)/2)}</span>
        {
               error && (
                    <>
                        {error?.message}
                    </>
                )
            } 
        </>
    );
}