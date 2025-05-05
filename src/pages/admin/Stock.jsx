const Stock = () => {
    return(
        <>
            <div>
                <button>Add Stocks</button>
            </div>


            <div>
                <table border={1}>
                    <tr>
                        <td>Stock List</td>
                        <td>Stocks</td>
                        <td>Action</td>
                    </tr>
                    <tr>
                        <td>{/* get from database basta su query*/}Bakal na bote</td>
                        <td>{/* get from database basta su query*/}40</td>
                        <td>
                            <button>Update</button>
                            <button>Delete</button>
                        </td>
                    </tr>
                </table>
            </div>
            
        </>
    )
}

export default Stock;