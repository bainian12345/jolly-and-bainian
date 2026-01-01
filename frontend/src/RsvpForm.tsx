import { useRef, useState } from "react";
import "./RsvpForm.css";
import addButton from "./assets/add-button.png";
import minusButton from "./assets/minus-button.png";

interface Guest {
  firstName: string;
  lastName: string;
  email: string;
  meal: string;
}

export default function RSVPForm() {
  const [guest, setGuest] = useState<Guest>(
    { firstName: "", lastName: "", email: "", meal: "" },
  );
  const [plusOne, setPlusOne] = useState<Guest>({ firstName: "", lastName: "", email: "", meal: "" });
  const [hasPlusOne, setHasPlusOne] = useState<boolean>(false);
  const plusOneRef = useRef<HTMLDivElement>(null);

  const mealOptions = ["Braised Beef Short Ribs", "Coal Roasted Salmon", "Red Thai Coconut Curry (Vegetarian)"];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    type: "guest" | "plusOne"
  ) => {
    const { name, value } = e.target;
    
    if (type === "guest") {
      setGuest((prev) => ({ ...prev, [name]: value }));
    } else {
      setPlusOne((prev) => prev && { ...prev, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(`Form submitted for ${guest.firstName} ${plusOne ? `and ${plusOne.firstName}` : ""}`);
    alert(`Thank you, ${guest.firstName}!`);
  };

  const togglePlusOne = () => {
    if (hasPlusOne) {
      setHasPlusOne(false);
    } else {
      setHasPlusOne(true);
      setTimeout(() => {
        requestAnimationFrame(() => {
          plusOneRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        });
      }, 200);
    }
  };

  const getFormFields = (guest: Guest, onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void) => {
    return (
      <>
      <div className="form-field">
        <label>First Name<span className="required">*</span></label>
        <input name="firstName" value={guest.firstName} onChange={onChange} required />
      </div>

      <div className="form-field">
        <label>Last Name<span className="required">*</span></label>
        <input name="lastName" value={guest.lastName} onChange={onChange} required />
      </div>

      <div className="form-field">
        <label>Email</label>
        <input name="email" value={guest.email} onChange={onChange} />
      </div>

      <div className="form-field">
        <label>Meal Option<span className="required">*</span></label>
        <select name="meal" value={guest.meal} onChange={onChange} required>
          <option value="">Select a meal</option>
          {mealOptions.map((meal) => (
            <option key={meal} value={meal}>{meal}</option>
          ))}
        </select>
      </div>
    </>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="rsvp-form">
      <div className="form-container">
        <div className="form-fields">
          {/* <div className="guest-header">Guest Details</div> */}
          {getFormFields(guest, (e) => handleChange(e, "guest"))}
        </div>

        <div className="toggle-plus-one-button" onClick={() => togglePlusOne()}>
          <img src={hasPlusOne ? minusButton : addButton} alt="Add a +1" />
          {hasPlusOne ? "Remove Plus One" : "Add Plus One"}
        </div>

        <div className={`form-fields plus-one-wrapper ${hasPlusOne ? "open" : ""}`} ref={plusOneRef}>
          {getFormFields(plusOne, (e) => handleChange(e, "plusOne"))}
        </div>
      </div>

      <button type="submit">RSVP</button>
    </form>
  );
}
