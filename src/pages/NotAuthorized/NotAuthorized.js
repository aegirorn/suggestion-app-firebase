import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Row, Col } from "react-bootstrap";

export const NotAuthorized = () => {
  const navigate = useNavigate();

  const handleCloseClick = () => {
    navigate("/");
  };

  return (
    <div className='mt-5'>
      <Row className='justify-content-center'>
        <Col xl={8} lg={10} className='form-layout'>
          <Row>
            <Col xs={11}>
              <div className='fw-bold mb-2 fs-5'>Authorization Required</div>
              <hr />
              <p>
                You are not authorized to access this section. You need to be
                logged in to vote and submit suggestions. You need to be an
                admin to mangage the suggestions.
              </p>
            </Col>
            <Col xs={1}>
              <Button
                variant='btn'
                className='btn-close'
                onClick={handleCloseClick}
              ></Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};
