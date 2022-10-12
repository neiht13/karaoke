import React from "react";

// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";

// We import all the components we need in our app
import Navbar from "./components/navbar";
import RecordList from "./components/records/recordList";
import Edit from "./components/records/edit";
import Create from "./components/records/create";
import UserList from "./components/users/recordList"
import UserCreate from "./components/users/create"
import UserEdit from "./components/users/edit"
import Karaoke from "./components/karaoke/recordList";
import KaraokeEdit from "./components/karaoke/edit";
import KaraokeDetail from "./components/karaoke/table";

const App = () => {
  return (
    <div>
      <Navbar />
      <div style={{ margin: 20 }}>
      <Routes>
        <Route exact path="/" element={<Karaoke />} />
        <Route path="/edit/:id" element={<Edit />} />
        <Route path="/create" element={<Create />} />
        <Route exact path="/user" element={<UserList />} />
        <Route path="/users/edit/:id" element={<UserEdit />} />
        <Route path="/users/create" element={<UserCreate />} />
        <Route path="/karaoke" element={<Karaoke />} />
          <Route path="/karaoke/edit/:id" element={<KaraokeEdit />} />
          <Route path="/karaoke/chitiet" element={<KaraokeDetail />} />

      </Routes>
      </div>
    </div>
  );
};

export default App;
