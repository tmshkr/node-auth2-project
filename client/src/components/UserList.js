import React, { useEffect, useState } from "react";
import { Button, Table, Spinner } from "reactstrap";
import axios from "../utils/axios";

function UserList(props) {
  const [users, setUsers] = useState([]);
  const { history } = props;

  useEffect(() => {
    axios
      .get("/api/users")
      .then(({ data }) => setUsers(data))
      .catch((err) => {
        console.dir(err);
        history.push("/");
      });
  }, []);

  const logout = () => axios.post("/api/logout").then(() => history.push("/"));

  if (!users.length) return <Spinner color="primary" />;

  return (
    <div className="users-list">
      <header>
        <h2>Users</h2>
      </header>
      <Table>
        <thead>
          <tr>
            <th>id</th>
            <th>username</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button onClick={logout}>Logout</Button>
    </div>
  );
}

export default UserList;
