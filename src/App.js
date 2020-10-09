import React, { Component } from 'react';
import { Table, Button, Modal, ModalFooter, ModalHeader, ModalBody, Label, Input, FormGroup } from 'reactstrap';
import axios from 'axios';
import { NotificationContainer, NotificationManager } from 'react-notifications';

import 'react-notifications/lib/notifications.css';
import './App.css';

class App extends Component {
  state = {
    books: [],
    newBookData: {
      title: '',
      rating: ''
    },
    editBookData: {
      id: '',
      title: '',
      rating: ''
    },
    newBookModal: false,
    editBookModal: false,
  }

  componentWillMount() {
    this._refreshBooks();
  };

  toggleNewBookModal() {
    this.setState({
      newBookModal: !this.state.newBookModal
    })
  };

  toggleEditBookModal() {
    this.setState({
      editBookModal: !this.state.editBookModal
    });
  };

  addBook() {
    axios.post('http://localhost:3000/books', this.state.newBookData)
      .then(response => {
        if (response.status === 200) {
          let { books } = this.state;
          books.push(response.data);
          this.setState({
            books,
            newBookModal: false,
            newBookData: {
              title: '',
              rating: ''
            }
          });
          NotificationManager.success(`Successfully  added book with title: ${response.data.title}!`, 'Add', 3000);
        } else {
          NotificationManager.warning('The book cannot be added!', 'Error', 3000);
        };
      });
  };

  editBook(id, title, rating) {
    this.setState({
      editBookData: { id, title, rating },
      editBookModal: !this.state.editBookModal
    });
  };

  updateBookData() {
    const { id, title, rating } = this.state.editBookData;
    
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
          }
          this.setState({
            books,
            editBookData: { id: '', title: '', rating: '' },
            editBookModal: false
          })
          NotificationManager.success(`Successfully edited the book`, 'Update', 3000);
        }
      })
      .catch(err => {
        const { error } = err.response.data;
        NotificationManager.warning(error, 'Error', 3000);
      });
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
      }
    })
  };

  _refreshBooks() {
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

  render() {
    return (
      <div className="App container">
        <NotificationContainer />
        <h1>Books App</h1>
        <Button className="float-left my-3 mr-4" color="primary" onClick={this.toggleNewBookModal.bind(this)}>Add Book</Button>
        <Table>
          <Modal isOpen={this.state.newBookModal} toggle={this.toggleNewBookModal.bind(this)} >
            <ModalHeader toggle={this.toggleNewBookModal.bind(this)}>Add a new book</ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label for="title">Title</Label>
                <Input id="title" value={this.state.newBookData.title} onChange={(e) => {
                  const { newBookData } = this.state;
                  newBookData.title = e.target.value;
                  this.setState({ newBookData });
                }} />
              </FormGroup>
              <FormGroup>
                <Label for="rating">Rating</Label>
                <Input id="rating" value={this.state.newBookData.rating} onChange={(e) => {
                  let { newBookData } = this.state;
                  newBookData.rating = e.target.value;
                  this.setState({ newBookData });
                }} />
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={this.addBook.bind(this)}>Add Book</Button>{' '}
              <Button color="secondary" onClick={this.toggleNewBookModal.bind(this)}>Cancel</Button>
            </ModalFooter>
          </Modal>

          <Modal isOpen={this.state.editBookModal} toggle={this.toggleEditBookModal.bind(this)} >
            <ModalHeader toggle={this.toggleEditBookModal.bind(this)}>Edit a new book</ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label for="title">Title</Label>
                <Input id="title" value={this.state.editBookData.title} onChange={(e) => {
                  let { editBookData } = this.state;
                  editBookData.title = e.target.value;
                  this.setState({ editBookData });
                }} />
              </FormGroup>
              <FormGroup>
                <Label for="rating">Rating</Label>
                <Input id="rating" value={this.state.editBookData.rating} onChange={(e) => {
                  const { editBookData } = this.state;
                  editBookData.rating = e.target.value;
                  this.setState({ editBookData });
                }} />
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={this.updateBookData.bind(this)}>Update Book</Button>
              <Button color="secondary" onClick={this.toggleEditBookModal.bind(this)}>Cancel</Button>
            </ModalFooter>
          </Modal>

          <thead className="booksTheadContainer">
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Rating</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {this.state.books.map(book => <tr key={book.id}>
                  <td>{book.id}</td>
                  <td>{book.title}</td>
                  <td>{book.rating}</td>
                  <td>
                    <Button color="success" size="sm" className="mr-2"
                      onClick={this.editBook.bind(this, book.id, book.title, book.rating)}>Edit</Button>
                    <Button color="danger" size="sm"
                      onClick={this.deleteBook.bind(this, book.id)}>Delete</Button>
                  </td>
                </tr>)
            }
          </tbody>
        </Table>
      </div >
    );
  };
};

export default App;
