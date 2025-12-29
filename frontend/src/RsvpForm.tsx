import { useState } from "react";
import "./RsvpForm.css";
export default function RSVPForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    meal: "",
  });

  const mealOptions = ["Chicken", "Beef", "Vegetarian", "Vegan"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert(`Thank you, ${formData.firstName}!`);
  };

  return (
    <form onSubmit={handleSubmit} className="rsvp-form">
      <div className="form-field">
        <label htmlFor="firstName">First Name<span className="required">*</span></label>
        <input
          id="firstName"
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor="lastName">Last Name<span className="required">*</span></label>
        <input
          id="lastName"
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor="email">Email</label>
        <input
          id="lastName"
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor="meal">Meal Option<span className="required">*</span></label>
        <select
          id="meal"
          name="meal"
          value={formData.meal}
          onChange={handleChange}
          required
        >
          <option value="">Select a meal</option>
          {mealOptions.map((meal) => (
            <option key={meal} value={meal}>
              {meal}
            </option>
          ))}
        </select>
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}
