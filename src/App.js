import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  // by using the function form you, gurantee that the update is based on the most recent stat value.
  function handelShowAddFriend() {
    setShowAddFriend((show) => !show);
  }
  // receive a friend object,take the current friends, create a brand new array and add the new one at the end
  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    // close down the form once added a friend
    setShowAddFriend(false);
  }

  return (
    <div className="app">
      <div className="sidebar">
        {/* passing in friends as a prop */}
        <FriendsList friends={friends} />
        {/* with short circuiting */}
        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}
        <Button onClick={handelShowAddFriend}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>
      <FormSplitBill />
    </div>
  );
}
// receive friends
function FriendsList({ friends }) {
  // const friends = initialFriends;
  return (
    <ul>
      {friends.map((friend) => (
        <Friend friend={friend} key={friend.id} />
      ))}
    </ul>
  );
}
function Friend({ friend }) {
  return (
    <li>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} £{Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you £{Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      <Button>Select</Button>
    </li>
  );
}

// first thing is that we need to get the value of these input fields into our application
// we use contolled elements where we will have one piece of state for each of the inputs
// and then as the user types something here, that value here of the inout field will be synced with that state.

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");
  // prevent the default action , reload the emtire page
  function handleSubmit(e) {
    e.preventDefault();
    // generating random IDs right in the browser => this wont work in the older browsers
    // add guard clause here
    if (!name || !image) return;

    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    onAddFriend(newFriend);
    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>Friend name</label>
      {/* we set the value to that state so basiclly controlling that input field, and then
      we listen to the change event with the onChnage listener using that e.target.vale */}
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}
function FormSplitBill() {
  return (
    <form className="form-split-bill">
      <h2>Split a bill with x</h2>
      <label>Bill Value</label>
      <input type="text" />
      <label>You expense</label>
      <input type="text" />
      <label>x expense</label>
      <input type="text" disabled />
      <label>Who is paying the bill</label>
      <select>
        <option value="user">You</option>
        <option calue="friend">X</option>
      </select>
      <Button>Split bill</Button>
    </form>
  );
}
