import React from "react";
import { Button, Modal } from "react-bootstrap";

const SureModal = ({ onClose, onDelete }) => {
  return (
    <Modal show onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Delete product</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={onDelete}>
          Yes,delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SureModal;
