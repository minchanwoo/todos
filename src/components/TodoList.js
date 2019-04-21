import React, { Component } from 'react';

import '../App.css';

import { Link } from 'react-router-dom';

import querystring from 'querystring';

class Todo extends Component {
    render() {
      return (
        <tr>
          <td className={this.props.done ? 'strike': '' }>
            <Link to={`/todos/${this.props.id}`}>
                {this.props.title}
            </Link>
          </td>
          <td>
            <input type='checkbox' checked={this.props.done} onChange={()=> this.props.changeDone(this.props.id)} />
          </td>
        </tr>
      );
    }
  }

class TodoList extends Component {
    
    componentWillMount() {
        const page = Number(querystring.parse(this.props.location.search)['?page'] || 1);
        if(this.props.page !== page) {
            this.props.changePage(page);
        }
    }

    componentWillReceiveProps(newProps) {
        const page = Number(querystring.parse(newProps.location.search)['?page']);
        this.props.changePage(page);
    }

    render() {
        const pages_list = this.props.filtered_list.slice((this.props.page - 1) * this.props.items_per_page, this.props.page * this.props.items_per_page);
        return (
            <div className='App'>
                <table>
                    <tbody>
                        {pages_list.map((list)=> 
                            <Todo key={list.id} 
                                id={list.id} 
                                title={list.title} 
                                done={list.done} 
                                changeDone={this.props.changeDone}
                                changePage={this.props.changePage}   
                            />
                        )}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default TodoList;