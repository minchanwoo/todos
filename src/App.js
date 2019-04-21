import React, { Component } from 'react';

import {BrowserRouter as Router, Route, Link} from 'react-router-dom';

import TodoList from './components/TodoList';
import TodoDetail from './components/TodoDetail';


const LOCALSTORAGE_LIST_NAME = 'list';

class App extends Component {

  constructor(props) {
    super(props);
    let list_data = localStorage.getItem(LOCALSTORAGE_LIST_NAME);
    if(!list_data) {
      list_data = [];
    } else {
      list_data = JSON.parse(list_data);
    }
    this.state = {
      list: list_data,
      filter: 'all',
      page: 1,
      last: 1,
      filtered_list: [],
      items_per_page: 5,
      pages: [],
    }
  }

  componentDidMount() {
    this.getFilteredList();
    this.getPages();
  }

  componentDidUpdate() {
    this.getFilteredList();
    this.getPages();
  }

  getFilteredList() {
    const filtered_list = this.state.list.filter((item) => {
      if(this.state.filter === 'done') {
        if(item.done === false) {
          return false;
        }
      }
      if(this.state.filter === 'not_done') {
        if(item.done === true) {
          return false;
        }
      }
      return true;
    })
    const last = Math.ceil(filtered_list.length / this.state.items_per_page);
    if(last !== this.state.last) {
      this.setState({
        last,
      })
    }
    if(filtered_list.length !== this.state.filtered_list.length ) {
      this.setState({
        filtered_list,
      });
    }
  }

  getPages() {
    let pages = [this.state.page];

    if(1 <= this.state.page -1) {
        pages.unshift(this.state.page-1);
    }
    if(this.state.page+1 <= this.state.last) {
        pages.push(this.state.page + 1);
    }
    if(pages.indexOf(1) < 0) {
        pages.unshift(1);
    }

    if(pages.indexOf(this.state.last) < 0) {
        pages.push(this.state.last);
    }

    let result = []

    for(var i=0; i < pages.length; i++) {
      if(i === pages.length - 1) {
          result.push(pages[i]);
      } else if(pages[i]+1 === pages[i+1]) {
          result.push(pages[i]);
      } else {
          result.push(pages[i]);
          result.push('...');
      }
    }
    if(JSON.stringify(this.state.pages) !== JSON.stringify(result)) { //깊은비교이다 원래는 true가 나오지만 JSON.stringify 로 비교를 하면 false가 나온다
      this.setState({
        pages: result
      })
    }
  }

  changeDone = (id) => {
    const newList = this.state.list;
    newList.forEach((item)=> {
      if(item.id === id) {
        item.done = !item.done
      }
    });
    this.setState({
      list: newList
    });
    localStorage.setItem(LOCALSTORAGE_LIST_NAME, JSON.stringify(newList));
  }

  threeBtn = (text) => {
    this.setState({
      filter: text,
    });
  }

  changeTitle = (id, newTitle) => {
    const newList = this.state.list;
    newList.forEach((item)=> {
      if(item.id === id) {
        item.title = newTitle;
      }
    });
    this.setState({
      list: newList
    });
    localStorage.setItem(LOCALSTORAGE_LIST_NAME, JSON.stringify(newList));
  }

  threeBtn = (text) => {
    this.setState({
      filter: text,
    });
  }

  renderButton = (value, label) => {
    return (
      <div className=
        {`btn ${this.state.filter === value ? 'selected' : ''}`} 
        onClick={()=> this.threeBtn(value)}>
        <Link to={`/todos?filter=${value}`}>
         {label}
        </Link>         
      </div>
    );
  }

  add=()=> {
    const title = window.prompt('제목을 입력하세요');
    if(title) {
      const lists = this.state.list;
      const last_id = lists.length ? lists[lists.length -1].id : 0;
      lists.push({title, done: false, description: '', id: last_id +1})
      this.setState({
        lists,
      });
      localStorage.setItem(LOCALSTORAGE_LIST_NAME, JSON.stringify(lists));
    }
  }

  remove = (id) => {
    const newList = this.state.list.filter((item)=> item.id !== id);
    this.setState({
      list: newList
    });
    localStorage.setItem(LOCALSTORAGE_LIST_NAME, JSON.stringify(newList));
  }

  changePage = (newPage) => {
    this.setState({
      page: newPage,
    });
  }

  render() {
    return (
      <Router>
        <div>
          <select onChange={(v)=> this.setState({items_per_page: v.target.value})}>
            <option>5</option>
            <option>10</option>
            <option>20</option>
          </select>개씩 보기
          <div>
            <Route exact 
              path='/todos' 
              component={(props)=> 
              <TodoList 
                {...props} 
                changeDone={this.changeDone} 
                threeBtn={this.threeBtn} 
                filter={this.state.filter} 
                changePage={this.changePage} 
                page={this.state.page}
                filtered_list={this.state.filtered_list}
                items_per_page={this.state.items_per_page}
              />} 
            />

            <Route 
              path='/todos/:id'
              component={(props)=>
              <TodoDetail
                {...props}
                list={this.state.list}
                changeDone={this.changeDone}
                changeTitle={this.changeTitle} 
                remove={this.remove} 
              />} 
            />

          </div>
          <hr />
          {this.state.page}페이지
          <div style={{textAlign:'center'}}>
            {this.state.pages.map((page, i) => {
              return <div key={i} style={{display: 'inline-block', marginRight:'5px'}}>
                {Number.isInteger(page)
                  ?
                  this.state.page === page
                    ? <strong>{page}</strong>
                    : <Link to={`/todos?page=${page}`}>{page}</Link>
                  : <span style={{letterSpacing:'5px', marginLeft:'8px'}}>{page}</span>
                }
              </div>
            })}
          </div>
          
          <button onClick={this.add}>추가</button>
          <hr/>
          {this.renderButton('all', '전체')}
          {this.renderButton('done', '완료')}
          {this.renderButton('not_done', '미완료')}
        </div>
      </Router>
    );
  }
}

export default App;
