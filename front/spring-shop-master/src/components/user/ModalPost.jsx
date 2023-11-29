import {useState} from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import DaumPostCode from 'react-daum-postcode';

const ModalPost = ({onPostcode})=> {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = (e) => {
        e.preventDefault();
        setShow(true);}
    const onComplete = (e)=>{
        console.log(e);
        const address=e.address;
        const building=e.buildingName && `(${e.buildingName})`;
        onPostcode(address + building);
        handleClose();
    }

    return (
      <>
        <button className="custom-input-group mb-2"   onClick={handleShow}>
          ADDR SEARCH
        </button>
  
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>
                <DaumPostCode onComplete={onComplete}/>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
  

export default ModalPost