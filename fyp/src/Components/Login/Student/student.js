import React, { useState } from "react";

const Student = () => {
  return (
    <div>
      <h2>Login</h2>
      <form
      //  onSubmit={handleFormSubmit}
      >
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            // value={username}
            // onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            // value={password}
            // onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Log In</button>
      </form>
    </div>
  );
};
export default Student;
