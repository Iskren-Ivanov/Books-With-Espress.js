import React, { Component } from 'react';
import { Button, Modal, ModalFooter, ModalHeader, ModalBody, Label, Input, FormGroup } from 'reactstrap';

class BookModal extends Component {
  state = {
    id: null,
    title: null,
    rating: null
  };

  componentDidMount() {
    if (this.props.book) {
      const { id, title, rating } = this.props.book;
      this.setState({ id, title, rating });
    }
  }

  render() {
    return (
      <Modal isOpen>
        <ModalHeader> {this.props.book ? 'Edit a book' : 'Add a book'}</ModalHeader >
        <ModalBody>
          <FormGroup>
            <Label for="title">Title</Label>
            <Input
              value={this.state.title}
              onChange={(e) => this.setState({
                title: e.target.value
              })}
            />
          </FormGroup>
          <FormGroup>
            <Label for="rating">Rating</Label>
            <Input
              type="number"
              step={0.1}
              value={this.state.rating}
              onChange={(e) => this.setState({
                rating: e.target.value
              })}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => this.props.onSubmit(this.state)}>{this.props.book ? 'Update' : 'Add'}</Button>
          <Button color="secondary" onClick={this.props.onClose}>Cancel</Button>
        </ModalFooter>
      </Modal>
    );
  };
};


export default BookModal;
