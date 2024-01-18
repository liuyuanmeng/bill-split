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
  const [selectedFriend, setSelectedFriend] = useState(null);
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
  function handleSelection(friend) {
    // setSelectedFriend(friend)
    // optional chaining operator?
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }
  // to update the balance of a specific friend in the friends array by adding the provided value.
  //  It follows the principles of immutability by creating a new array with the updated values instead of modifying the existing array directly.
  function handleSplitBill(value) {
    console.log(value)
    // new array will be based on the current array
    setFriends((friends) => friends.map((friend) =>
      friend.id === selectedFriend.id
        ? { ...friend, balance: friend.balance + value }
        : friend
    )
    )
    setSelectedFriend(null)
  }

  return (
    <div className="app">
      <div className="sidebar">
        {/* passing in friends as a prop */}
        <FriendsList
          friends={friends}
          selectedFriend={selectedFriend}
          onSelection={handleSelection}
        />
        {/* with short circuiting */}
        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}
        <Button onClick={handelShowAddFriend}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>
      {/* into our JSX conditionally render this form */}
      {selectedFriend && <FormSplitBill selectedFriend={selectedFriend} onSplitBill={handleSplitBill} />}
    </div>
  );
}
// receive friends
// we dont need (onSelection,selectedFriend)directly here in the list,but we will need it inside the friend so we can just pass that throug here (prop drilling)
function FriendsList({ friends, onSelection, selectedFriend }) {
  // const friends = initialFriends;
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          selectedFriend={selectedFriend}
          onSelection={onSelection}
        />
      ))}
    </ul>
  );
}
function Friend({ friend, onSelection, selectedFriend }) {
  // add optional chaining operator?
  const isSelected = selectedFriend?.id === friend.id;
  // It's a concise way to handle cases where cur might be null or undefined without causing a runtime error due to attempting to access properties on a nullish value.
  return (
    <li className={isSelected ? "selected" : ""}>
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
      <Button onClick={() => onSelection(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
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
      <label>👫 Friend name</label>
      {/* we set the value to that state so basiclly controlling that input field, and then
      we listen to the change event with the onChnage listener using that e.target.vale */}
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>🌄 Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}
function FormSplitBill({ selectedFriend, onSplitBill }) {
  // here are our controlled element
  // we use empty string here becuase these are input text elements
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  // first lets cheak if there is a bill
  const paidByFriend = bill ? bill - paidByUser : "";

  const [whoIsPaying, setWhoIsPaying] = useState("user");
  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !paidByUser) return;
    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>

      <label>💰 Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>🧍‍♀️ Your expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          //  checking if the entered vakue is > than the bill, if it is keep the current value of paidByUser
          //  otherwise, it updates paidByUser to the entered value.
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value),
          )
        }
      />

      <label>👫 {selectedFriend.name}'s expense</label>
      <input type="text" disabled value={paidByFriend} />

      <label>🤑 Who is paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Split bill</Button>
    </form>
  );
}
