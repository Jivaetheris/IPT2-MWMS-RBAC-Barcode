const Warehouse = () => {

    return(
        <>
            <div>
                <div>
                    <button>Add new Warehouse</button>
                </div>

                <div>
                    <table border={1}>
                        <tr>
                            <td>Warehouse Name</td>
                            <td>Location</td>
                            <td>Capacity</td>
                            <td>Action</td>
                        </tr>
                        <tr>
                            <td>{/* get from database basta su query*/}Legazpi Warehouse 1</td>
                            <td>{/* get from database basta su query*/}John Doe</td>
                            <td>{/* get from database basta su query*/}400</td>
                            <td><button>Update</button><button>Delete</button></td>
                        </tr>
                    </table>
                </div>
            </div>
        </>
    )
}

export default Warehouse;