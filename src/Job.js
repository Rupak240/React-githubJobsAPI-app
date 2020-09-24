import React, { useState } from "react";
import { Card, Badge, Button, Collapse } from "react-bootstrap";
import ReactMarkdown from "react-markdown";

const Job = ({
  job: {
    company,
    type,
    created_at,
    location,
    title,
    how_to_apply,
    company_logo,
    description,
  },
}) => {
  // console.log(job)
  const [open, setOpen] = useState(false);

  return (
    <Card className="mb-4">
      <Card.Body>
        <div className="d-flex justify-content-between">
          <div>
            <Card.Title>
              {title} -{" "}
              <span className="text-muted font-weight-light">{company}</span>
            </Card.Title>

            <Card.Subtitle className="text-muted mb-2">
              {new Date(created_at).toLocaleDateString()}
            </Card.Subtitle>

            <Badge variant="secondary" className="mr-2">
              {type}
            </Badge>
            <Badge variant="secondary">{location}</Badge>

            <div style={{ wordBreak: "break-all" }}>
              <ReactMarkdown source={how_to_apply} />
            </div>
          </div>
          <img
            className="d-none d-md-block"
            height="50"
            src={company_logo}
            alt={company}
          />
        </div>

        <Card.Text>
          <Button onClick={() => setOpen(!open)} variant="primary">
            {open ? "Hide Details" : "View Details"}
          </Button>
        </Card.Text>

        <Collapse in={open}>
          <div className="mt-4">
            <ReactMarkdown source={description} />
          </div>
        </Collapse>
      </Card.Body>
    </Card>
  );
};

export default Job;
