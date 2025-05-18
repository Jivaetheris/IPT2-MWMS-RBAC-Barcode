const Role = () => {
    return(
        <>
            <h1>Role</h1>
            <table border={1}>
                <tr>
                    <td>Name</td>
                    <td>Role</td>
                    <td>Actions</td>
                </tr>
                <tr>
                    <td>John Doe</td>
                    <td>Admin</td>
                    <td>
                        <button>Edit</button>
                        <button>Resign</button>
                    </td>
                </tr>
            </table>
        </>
    )
}

export default Role;