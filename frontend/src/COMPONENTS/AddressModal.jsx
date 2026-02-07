import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import "../STYLES/AddressModal.css";

const labelOptions = [
  { label: "Home", color: "#16a34a", icon: "🏠" },
  { label: "Work", color: "#f59e0b", icon: "💼" },
  { label: "Hotel", color: "#f59e0b", icon: "🏨" },
  { label: "Other", color: "#fbbf24", icon: "📍" },
];

export default function AddressModal({ apiKey, onClose }) {
  const [form, setForm] = useState({
    label: "Home", flat: "", floor: "", area: "", landmark: "", name: "", phone: "",
    pincode: "", locality: "", city: "", state: "",
  });
  const mapRef = useRef(null);
  const inputRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [geocoder, setGeocoder] = useState(null);
  const [selected, setSelected] = useState({ name: "", address: "" });
  const [mapError, setMapError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const navigate = useNavigate();
  const { finalGrandTotal } = useCart();

  useEffect(() => {
    if (!apiKey || apiKey === "YOUR_GOOGLE_MAPS_API_KEY") {
      setMapError(true);
      return;
    }
    if (!window.google && !document.getElementById("gmap-js")) {
      const script = document.createElement("script");
      script.id = "gmap-js";
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.onload = () => window.dispatchEvent(new Event("gmap_loaded"));
      document.body.appendChild(script);
    } else if (window.google) {
      window.dispatchEvent(new Event("gmap_loaded"));
    }
  }, [apiKey]);

  useEffect(() => {
    function initMap() {
      if (window.google && mapRef.current && !map) {
        const defaultLocation = { lat: 20.5937, lng: 78.9629 }; // Center of India
        const gmap = new window.google.maps.Map(mapRef.current, {
          center: defaultLocation, zoom: 5, disableDefaultUI: true, zoomControl: true, gestureHandling: "greedy",
        });
        setMap(gmap);
        const gmarker = new window.google.maps.Marker({ map: gmap, draggable: true, position: defaultLocation });
        setMarker(gmarker);
        const ggeocoder = new window.google.maps.Geocoder();
        setGeocoder(ggeocoder);
        const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
          types: ["geocode"], componentRestrictions: { country: "in" },
        });
        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (place.geometry) {
            gmap.setZoom(15);
            gmap.setCenter(place.geometry.location);
            gmarker.setPosition(place.geometry.location);
            geocode(place.geometry.location, place.name);
          }
        });
        gmarker.addListener("dragend", (e) => geocode(e.latLng));
        if (!form.area) geocode(defaultLocation);
      }
    }
    const gmapLoadedHandler = () => initMap();
    window.addEventListener("gmap_loaded", gmapLoadedHandler);
    if (window.google && !map) initMap();
    return () => window.removeEventListener("gmap_loaded", gmapLoadedHandler);
  }, [map, form.area]);

  function geocode(pos, providedName) {
    if (!geocoder) return;
    geocoder.geocode({ location: pos }, (results, status) => {
      if (status === "OK" && results?.[0]) {
        const place = results[0];
        const locationName = providedName || place.address_components.find(c => c.types.includes("establishment"))?.long_name || place.address_components[0]?.long_name || "";
        const address = place.formatted_address?.split(",").slice(1).join(",").trim() || "";
        setSelected({ name: locationName, address });
        const addressParts = { pincode: "", locality: "", city: "", state: "" };
        place.address_components.forEach(c => {
          if (c.types.includes("postal_code")) addressParts.pincode = c.long_name;
          if (c.types.includes("locality")) addressParts.city = c.long_name;
          if (c.types.includes("sublocality_level_1")) addressParts.locality = c.long_name;
          if (c.types.includes("administrative_area_level_1")) addressParts.state = c.long_name;
        });
        setForm(f => ({
          ...f, area: locationName ? `${locationName}, ${address}` : address,
          pincode: addressParts.pincode, locality: addressParts.locality || addressParts.city,
          city: addressParts.city, state: addressParts.state,
        }));
      }
    });
  }

  const useCurrentLocation = () => {
    if (navigator.geolocation && map && marker) {
      navigator.geolocation.getCurrentPosition(pos => {
        const location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        map.setZoom(15);
        map.setCenter(location);
        marker.setPosition(location);
        geocode(location);
      });
    }
  };

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleLabel = (label) => setForm(f => ({ ...f, label }));
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.flat || !form.area || !form.name) return;
    setIsSaving(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;
      if (!userId) { alert('Please login first.'); setIsSaving(false); return; }
  const token = localStorage.getItem('token');
  const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/addresses`, { ...form, userId }, { headers: { Authorization: `Bearer ${token}` } });
      const newAddress = response.data;
      
      // Navigate to the payment page with the new address and total amount
      navigate('/payment', { state: { amount: finalGrandTotal, address: newAddress } });

    } catch (error) {
      console.error("Failed to save address:", error);
      alert("Could not save address. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <header className="modal-header">
          <h2>Enter complete address</h2>
          <button onClick={onClose} className="close-button">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </header>
        <div className="modal-body">
          <section className="modal-map-section">
            <div className="map-search-container">
              <input ref={inputRef} type="text" placeholder="Search for area, street name..." className="map-search-input" />
            </div>
            {mapError ? (
              <div className="map-error">Map could not be loaded. Please provide a valid API Key.</div>
            ) : (
              <div ref={mapRef} className="map-view-container" />
            )}
            <div className="map-footer">
              <div className="delivery-info">
                <strong>{selected.name || "Selected Location"}</strong>
                <small>{selected.address || "Move the pin to select an address"}</small>
              </div>
              <button onClick={useCurrentLocation} className="current-location-button">Use Current Location</button>
            </div>
          </section>
          <section className="modal-form-section">
            <form onSubmit={handleSubmit} className="address-form">
              <div className="form-scrollable-area">
                <div className="form-group">
                  <label>Save address as *</label>
                  <div className="label-button-group">
                    {labelOptions.map(o => <button type="button" key={o.label} onClick={() => handleLabel(o.label)} className={`label-button ${form.label === o.label ? "active" : ""}`}>{o.icon} {o.label}</button>)}
                  </div>
                </div>
                <div className="form-group"><input name="flat" type="text" placeholder="Flat / House no *" value={form.flat} onChange={handleChange} required /></div>
                <div className="form-group"><textarea name="area" placeholder="Area / Sector / Locality *" value={form.area} readOnly required /></div>
                <div className="form-group"><input name="pincode" type="text" placeholder="Pincode *" value={form.pincode} onChange={handleChange} required /></div>
                <div className="form-group"><input name="city" type="text" placeholder="City *" value={form.city} onChange={handleChange} required /></div>
                <div className="form-group"><input name="state" type="text" placeholder="State *" value={form.state} onChange={handleChange} required /></div>
                <div className="form-group"><input name="name" type="text" placeholder="Your name *" value={form.name} onChange={handleChange} required /></div>
                <div className="form-group"><input name="phone" type="tel" placeholder="Your phone (optional)" value={form.phone} onChange={handleChange} /></div>
              </div>
              <button type="submit" className="save-button" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Address"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}