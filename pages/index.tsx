import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { Authenticator } from "@aws-amplify/ui-react";
import '@aws-amplify/ui-react/styles.css';
import TodoCreateForm from "@/ui-components/TodoCreateForm";

const client = generateClient<Schema>();

export default function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  function listTodos() {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }

  useEffect(() => {
    listTodos();
  }, []);

  function createTodo() {
    client.models.Todo.create({
      content: window.prompt("Todo content"),
    });
  }

  return (
        
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h1>楽々音声メモ</h1>
          <p>マイクボタンを押して伝えたいことを話してみてください。話したことが文字で入力されて、伝わりやすい文章に修正されます。</p>
          <TodoCreateForm />
          <ul>
            {todos.map((todo) => (
              <li key={todo.id}>{todo.content}</li>
            ))}
          </ul>
          <button onClick={signOut}>サインアウト</button>
        </main>
      )}
    </Authenticator>
  );
}
