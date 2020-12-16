import React, { Component } from 'react';
import { Table, Button } from 'reactstrap';
import axios from 'axios';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import BookModal from './BookModal';

import 'react-notifications/lib/notifications.css';
import './App.css';

class App extends Component {
  state = {
    books: [],
    selectedBook: null,
    showModal: false
  };


  componentDidMount() {
    axios.get('http://localhost:3000/books')
      .then(response => {
        if (response.status === 200) {
          this.setState({
            books: response.data
          });
        } else {
          NotificationManager.warning('Data access problem!', 'Error', 3000);
        };
      });
  };

  submitBook({ id, title, rating }) {
    if (id) {
      axios.put('http://localhost:3000/books/' + id, {
        title, rating
      }).then(response => {
        if (response.status === 200) {
          const books = [...this.state.books];
          const currentIndex = books.findIndex(x => x.id === id);
          books[currentIndex] = {
            ...books[currentIndex],
            title,
            rating
          };

          this.setState({
            books,
            showModal: false,
          })
          NotificationManager.success(`Successfully edited the book`, 'Update', 3000);
        };
      })
        .catch(err => {
          this.setState({
            showModal: false,
          });
          const { error } = err.response.data;
          NotificationManager.warning(error, 'Error', 3000);
        });
    } else {
      axios.post('http://localhost:3000/books', { id, title, rating })
        .then(response => {
          if (response.status === 200) {
            let { books } = this.state;
            books.push(response.data);
            this.setState({
              books,
              showModal: false,
            });
            NotificationManager.success(`Successfully  added book with title: ${response.data.title}!`, 'Add', 3000);
          } else {
            this.setState({
              showModal: false,
            });
            NotificationManager.warning('The book cannot be added!', 'Error', 3000);
          };
        });
    };
  };

  deleteBook(id) {
    axios.delete('http://localhost:3000/books/' + id).then(res => {
      if (res.status === 200) {
        this.setState({
          books: res.data
        });
        NotificationManager.success('Successfully deleting the book!', 'Delete', 3000);
      } else {
        NotificationManager.warning(`No book was found with this id: ${id}.`, 'Error', 3000);
      };
    });
  };
  
  render() {
    return (
      <div className="App container">
        <NotificationContainer />
        <h1>Books App</h1>
        <Button className="float-left my-3 mr-4" color="primary" onClick={() => this.setState({ selectedBook: null, showModal: true })}>Add Book</Button>
        <Table>
          <tbody>
            {this.state.showModal &&
              <BookModal
                book={this.state.selectedBook}
                onSubmit={this.submitBook.bind(this)}
                onClose={() => this.setState({ showModal: false })}
              />}
            <tr>
              <th>Id</th>
              <th>Title</th>
              <th>Rating</th>
              <th>Action</th>
            </tr>
            {this.state.books.map(book => <tr key={book.id}>
              <td>{book.id}</td>
              <td>{book.title}</td>
              <td>{book.rating}</td>
              <td>
                <Button color="success" size="sm" className="mr-2"
                  onClick={() => this.setState({ selectedBook: book, showModal: true })}>Edit</Button>
                <Button color="danger" size="sm"
                  onClick={this.deleteBook.bind(this, book.id)}>Delete</Button>
              </td>
            </tr>)}
          </tbody>
        </Table >
      </div >
    );
  };
};

export default App;
