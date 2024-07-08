import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
});

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    api
      .get("/status")
      .then((res) => setUser(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="home">
      {!user && <Login />}
      {user && <h1>Hello, {user.fullname}!</h1>}
      {user && <Todos />}
    </div>
  );
}

export default App;

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function login(e) {
    e.preventDefault();
    api
      .post("/login", { email, password })
      .then((res) => window.location.reload())
      .catch((err) => console.log(err));
  }

  return (
    <form className="login__form" onSubmit={login}>
      <input
        type="email"
        placeholder="email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
}

function Todos() {
  const [todos, setTodos] = useState(null);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    api
      .get("/todos")
      .then((res) => setTodos(res.data))
      .catch((err) => console.log(err));
  }, []);

  function add() {
   api.post("/todos", {title: newTodo, status: false})
   .then(res => setTodos([...todos, res.data]))
   .catch(err => console.log(err)) 
  }

  return (
    <div>
      To-do List
      <input type="text" placeholder="New to do..." onChange={(e) => setNewTodo(e.target.value)} />
      <button onClick={add}>Add</button>
      <ul>{todos && todos.map((todo) => <li>{todo.title} <input type="checkbox" checked={todo.status} /></li>)}</ul>
    </div>
  );
}
