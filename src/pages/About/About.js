/* eslint-disable react/jsx-no-target-blank */
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Row, Col } from "react-bootstrap";

export const About = () => {
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
              <div className='fw-bold mb-2 fs-5'>
                Tim Corey's Suggestions Website
              </div>
              <hr />
              <p className='fw-bold'>Purpose</p>
              <p>
                This website is built as a clone of{" "}
                <a
                  href='https://suggestions.iamtimcorey.com/'
                  target='_blank'
                  style={{ color: "#0d6efd" }}
                >
                  Tim Corey's Suggestions website
                </a>
                . It was made as a training excersise, to practice programming
                in React.
              </p>
              <p className='fw-bold'>Tim Corey's course</p>
              <p>
                Mr. Tim Corey has kindly made a course public on YouTube, where
                he teaches how a real project that he actually uses himself, can
                be made using C#, .NET 6, Blazor Server, MongoDb and Azure
                Active Directory B2C.
              </p>
              <p>
                Corey explains both the web application and his course in the
                first lecture on YouTube that can be seen here:{" "}
                <a
                  href='https://youtu.be/eEyAKk4NeSg'
                  target='_blank'
                  style={{ color: "#0d6efd" }}
                >
                  https://youtu.be/eEyAKk4NeSg
                </a>
                .
              </p>
              <p className='fw-bold'>The Technology</p>
              <p>
                Apart from the obvious difference of using React instead of .NET
                here, we also have a different database and authentication
                system where Firebase replaces both MongoDb and Azure B2C. I
                found it a bit easier to work with Firebase than MongoDb in the
                contex of this application but Firebase also has some other
                things in it&#39;s favor. It is a &quot;One Stop Shop&quot; for
                a database, authentication and hosting. It also has the great
                feature of providing the option of listening to the data live so
                that changes in the database can be reflected immediately in the
                user&#39;s browser.
              </p>
              <p className='fw-bold'>Source Code</p>
              <p>
                The source code for the application is on Github:{" "}
                <a
                  href='https://github.com/aegirorn/suggestion-app-firebase'
                  target='_blank'
                  style={{ color: "#0d6efd" }}
                >
                  https://github.com/aegirorn/suggestion-app-firebase
                </a>{" "}
              </p>
              <p className='fw-bold'>Credits</p>
              <p>
                All the UI design here is Tim Corey&#39;s and most of the CSS
                that makes the website look good was created by him. He is also
                of course the author of the application logic and this website
                is therefore mostly a translation of that code and logic into
                the different context of the React/Javascript world.
              </p>
              <p>
                I also might &quot;borrow&quot; some suggestions or data from
                the real, live website, to have the data here looking a bit less
                silly.
              </p>
              <p>
                Making this website has been a great experience that I have
                learned a lot from doing.
              </p>
              <p className='fw-bold'>References</p>
              <ul>
                <li>
                  <p>
                    The playlist of this course can be found here on YouTube:{" "}
                    <a
                      href='https://youtube.com/playlist?list=PLLWMQd6PeGY0cZFMqx5ijmdaD87sJKCsU'
                      target='_blank'
                      style={{ color: "#0d6efd" }}
                    >
                      https://youtube.com/playlist?list=PLLWMQd6PeGY0cZFMqx5ijmdaD87sJKCsU
                    </a>
                    .
                  </p>
                </li>
                <li>
                  <p>
                    It is also possible to buy the full course at:{" "}
                    <a
                      href='https://www.iamtimcorey.com/p/build-a-suggestion-site-app'
                      target='_blank'
                      style={{ color: "#0d6efd" }}
                    >
                      https://www.iamtimcorey.com/p/build-a-suggestion-site-app
                    </a>
                    .
                  </p>
                </li>
              </ul>
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
