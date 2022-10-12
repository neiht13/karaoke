import React, { useState } from "react";
import { useNavigate } from "react-router";

export default function Create() {
  const [form, setForm] = useState({
    user: "",
    pass: "",
  });
  const navigate = useNavigate();

  // These methods will update the state properties.
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  // This function will handle the submission.
  async function onSubmit(e) {
    e.preventDefault();

    // When a post request is sent to the create url, we'll add a new record to the database.
    const newPerson = { ...form };

    await fetch("http://localhost:5000/users/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({user:newPerson.user, pass:newPerson.pass}),
    })
    .catch(error => {
      window.alert(error);
      return;
    });

    setForm({ user: "", pass: ""});
    navigate("/user");
  }

  // This following section will display the form that takes the input from the user.
  return (
    <div>
      <h3>Create New Record</h3>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="name">Username</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={form.user}
            onChange={(e) => updateForm({ user: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="position">Password</label>
          <input
            type="text"
            className="form-control"
            id="position"
            value={form.pass}
            onChange={(e) => updateForm({ pass: e.target.value })}
          />
        </div>
        <div className="form-group">
          <input
            type="submit"
            value="Create Account"
            className="btn btn-primary"
          />
        </div>
      </form>
    </div>
  );
}
