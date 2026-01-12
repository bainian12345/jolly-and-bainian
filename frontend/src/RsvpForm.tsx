import { useEffect, useRef, useState } from "react";
import "./RsvpForm.css";
import addButton from "./assets/add-button.png";
import minusButton from "./assets/minus-button.png";

interface Guest {
  firstName: string;
  lastName: string;
  email: string;
  meal: string;
}

interface Invitation {
  id: string;
  maxGuests: number;
  dateTimeAccepted?: Date;
  guests: Guest[];
}

function getInvitationId(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get("invitationId");
}

async function getInvitation(invitationId: string): Promise<Invitation> {
  const response = await fetch(`https://jolly-and-bainian.click/api/invitation/${invitationId}`);
  const data = await response.json();
  return data;
}

export default function RSVPForm() {
  const invitationId = getInvitationId();
  const [loading, setLoading] = useState(true);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [hasGuests, setHasGuests] = useState<boolean[]>([]);
  const [maxGuests, setMaxGuests] = useState(2);
  const [rsvpSuccessful, setRsvpSuccessful] = useState<boolean>(false);
  const plusOneRef = useRef<HTMLDivElement>(null);

  const mealOptions = ["Braised Beef Short Ribs", "Coal Roasted Salmon", "Red Thai Coconut Curry (Vegetarian)"];

  useEffect(() => {
    const loadInvitation = async () => {
      if (!invitationId) {
        initGuests(2);
        return;
      }

      const invitation = await getInvitation(invitationId);
      initGuests(invitation.maxGuests);
    };

    const initGuests = (count: number) => {
      setMaxGuests(count);
      setGuests(
        Array.from({ length: count }, () => ({ firstName: "", lastName: "", email: "", meal: "" }))
      );
      setHasGuests(
        Array.from({ length: count }, (_, i) => i === 0)
      );
      setLoading(false);
    };

    loadInvitation();
  }, [invitationId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index: number
  ) => {
    const { name, value } = e.target;
    
    setGuests(prev =>
      prev.map((guest, i) =>
        i === index ? { ...guest, [name]: value } : guest
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
      invitationId,
      guests: guests.filter((_, index) => hasGuests[index]),
    };

    try {
      const response = await fetch("https://jolly-and-bainian.click/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        if (response.status === 400) {
          alert("Seems like there might be some missing information in the form, please fill out all required fields and try again");
        } else if (response.status === 404) {
          alert("The invitation ID is missing or invalid, please use the link that you received with the proper ID in the url");
        } else if (response.status === 409) {
          alert("Seems like you have already RSVPed, if you need to change your RSVP, please contact Bainian");
        } else {
          throw new Error(`Server error: ${response.status}`);
        }
      }

      const data = await response.json();
      console.log("Response data:", data);
      alert("Thank you for your RSVP 🎉🎉🎉 Please check your inbox (most likely in your spam folder) soon for a confirmation email");
      setRsvpSuccessful(true);
    } catch (error) {
      console.error("Error submitting RSVP:", error);
      alert("Sorry there might be a bug 😅, please let Bainian know about it");
    }
  };

  const toggleHasGuests = (index: number) => {
    setHasGuests(prev =>
      prev.map((v, i) => (i === index ? !v : v))
    );

    setTimeout(() => {
      plusOneRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 200);
  };

  const getFormFields = (
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void,
    index: number
  ) => {
    return (
      <>
      <div className="form-field">
        <label>First Name<span className="required">*</span></label>
        <input name="firstName" value={guests[index].firstName} onChange={onChange} required={index === 0 || hasGuests[index]} />
      </div>

      <div className="form-field">
        <label>Last Name<span className="required">*</span></label>
        <input name="lastName" value={guests[index].lastName} onChange={onChange} required={index === 0 || hasGuests[index]} />
      </div>

      <div className="form-field">
        <label>Email{index === 0 ? <span className="required">*</span> : ""}</label>
        <input name="email" value={guests[index].email} onChange={onChange} required={index === 0} />
      </div>

      <div className="form-field">
        <label>Meal Option<span className="required">*</span></label>
        <select name="meal" value={guests[index].meal} onChange={onChange} required={index === 0}>
          <option value="">Select a meal</option>
          {mealOptions.map((meal) => (
            <option key={meal} value={meal}>{meal}</option>
          ))}
        </select>
      </div>
    </>
    );
  };

  if (loading) return <div>Loading…</div>;

  return (
    <form onSubmit={handleSubmit} className="rsvp-form">
      <div className="form-container">
        <div className="form-fields">
          {getFormFields((e) => handleChange(e, 0), 0)}
        </div>

        {
          Array.from({ length: maxGuests - 1 }, (_, index) => {
            return (
              <div key={index+1}>     
                <div className="toggle-plus-one-button" onClick={() => toggleHasGuests(index+1)}>
                  <img src={hasGuests[index+1] ? minusButton : addButton} alt="Toggle +1" />
                  {hasGuests[index+1] ? "Remove Plus One" : "Add Plus One"}
                </div>

                <div className={`form-fields plus-one-wrapper ${hasGuests[index+1] ? "open" : ""}`} ref={plusOneRef}>
                  {getFormFields((e) => handleChange(e, index+1), index+1)}
                </div>
              </div>
            )
          })
        }

        <button type="submit">RSVP</button>
        {rsvpSuccessful &&
          <div className="rsvp-success-message">
            <p>Thank you for your RSVP! 🎉🎉🎉</p>
            <p>Please check your email soon for a confirmation</p>
          </div>
        }
      </div>
    </form>
  );
}
