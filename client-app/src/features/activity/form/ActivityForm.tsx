import React from "react";
import { Form, Segment } from "semantic-ui-react";

export const ActivityForm = () => {
  return (
    <Segment>
      <Form>
        <Form.Field>
          <label>Title</label>
          <input placeholder="Title" />
        </Form.Field>
        <Form.Field>
          <label>Description</label>
          <textarea rows={2} placeholder="Description"></textarea>
        </Form.Field>
        <Form.Field>
          <label>Category</label>
          <input placeholder="Category" />
        </Form.Field>
        <Form.Field>
          <label>Date</label>
          <input type="date" placeholder="Date" />
        </Form.Field>
        <Form.Field>
          <label>City</label>
          <input placeholder="City" />
        </Form.Field>
        <Form.Field>
          <label>Venue</label>
          <input placeholder="Venue" />
        </Form.Field>
      </Form>
    </Segment>
  );
};
