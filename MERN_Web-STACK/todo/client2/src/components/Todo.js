import React, { Component } from 'react';
import axios from 'axios';

import Input from './Input';
import ListTodo from './ListTodo';

class Todo extends Component {
  state = {
    todos: []
  };

  componentDidMount() {
    this.getTodos();
  }

  getTodos = () => {
    axios.get('/api/todos')
      .then(res => {
        if (res.data) {
          this.setState({
            todos: res.data
          });
        }
      })
      .catch(err => console.log(err));
  };

  deleteTodo = (id) => {
    axios.delete(`/api/todos/${id}`)  // Use backticks for template literals
      .then(res => {  // Change res.data to res
        if (res.data) {
          this.getTodos();
        }
      })
      .catch(err => console.log(err));
  };

  render() {
    const { todos } = this.state;

    return (
      <div>
        <h1>My Todo(s)</h1>
        <Input getTodos={this.getTodos} />  {/* Corrected prop name */}
        <ListTodo todos={todos} deleteTodo={this.deleteTodo} />  {/* Corrected prop name */}
      </div>
    );
  }
}

export default Todo;

