import React, { Component } from 'react';

import { Link } from 'react-router-dom';



class TodoDetail extends Component {
    state = {
        id: 0,
        title:'',
        done: false,
        description: '',
        previous_id: null,
        next_id: null,
    }

    componentWillMount() {
        const id = Number(this.props.match.params.id);
        this.getDetail(id);
    }

    componentWillReceiveProps(newProps) {
        const new_id = Number(newProps.match.params.id);
        if(this.state.id !== new_id) {
            this.getDetail(new_id);
        }
    }

    getDetail(id) {
        const data = this.props.list.find((data)=> data.id === id);
        const first_id = this.props.list[0].id;
        const last_id = this.props.list[this.props.list.length -1].id;

        if(!data) {
            return;
        }
        const {title, description, done} = data;
        

        let previous_id;
        let next_id;

        if(first_id < id) {
            previous_id = id - 1;
        }
        if(id < last_id) {
            next_id= id + 1;
        }

        this.setState({
            id,
            title,
            description,
            done,
            previous_id,
            next_id,
        })
    }

    remove = () => {
        if(window.confirm('삭제하시겠습니까?')) {
            this.props.remove(this.state.id);
            this.props.history.push('/todos');
        }
    }

    render() {
        const { id, title, description, done, previous_id, next_id } = this.state;
        return (
            <div>
                <Link to='/todos'>목록으로</Link>
                <hr />
                <div>
                    제목: <input type='text' value={title} onChange={(e)=> this.props.changeTitle(id, e.target.value)} />
                </div>
                <div>
                    상세: {description}
                </div>
                <div>
                    완료여부: <input type='checkbox' checked={done} onChange={()=> this.props.changeDone(id)} />
                </div>
                <hr />
                {previous_id && <Link to={`/todos/${previous_id}`}>이전으로</Link> }
                {next_id && <Link to={`/todos/${next_id}`}>다음으로</Link> }
                <hr/>
                <button onClick={this.remove}>삭제</button>
            </div>
        );
    }
}

export default TodoDetail;