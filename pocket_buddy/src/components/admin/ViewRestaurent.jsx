import axios from "axios";
import React, { useEffect, useState } from "react";
import { CustomLoader } from "../common/CustomLoader";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "../../assets/screencard.css";

export const ViewRestaurent = () => {
  

  // const deleteRestaurant = async (id) => {
  //   try {
  //     setisLoader(true);

  //     const res = await axios.delete("/location/delete/" + id);
  //     console.log(res);
  //     if (res.status == 200) {
  //       //alert("user deleted..");
  //       toast.success("record deleted successfully!!", {
  //         position: "top-center",
  //         autoClose: 5000,
  //         hideProgressBar: false,
  //         closeOnClick: false,
  //         pauseOnHover: true,
  //         draggable: true,
  //         progress: undefined,
  //         theme: "dark",
  //         transition: Bounce,
  //       });
  //       getAllMyScreen(); //get -->
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Failed to delete record!", {
  //       position: "top-center",
  //       autoClose: 5000,
  //     });
  //   } finally {
  //     setisLoader(false); // Stop loader
  //   }
  // };


  const [screen, setScreen] = useState([]);
  const [filteredScreens, setFilteredScreens] = useState([]);
  const [isLoader, setIsLoader] = useState(false);

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);

  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedArea, setSelectedArea] = useState("");

  // Fetch all restaurants
  const getAllMyScreen = async () => {
    setIsLoader(true);
    try {
      const res = await axios.get("/location/getall");
      setScreen(res.data.data);
      setFilteredScreens(res.data.data);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
    setIsLoader(false);
  };

  // Fetch all states, cities, and areas
  const getAllStates = async () => {
    const res = await axios.get("/state/getallstate");
    setStates(res.data.data);
  };

  const getAllCities = async () => {
    const res = await axios.get("/city/getallcity");
    setCities(res.data.data);
  };

  const getAllAreas = async () => {
    const res = await axios.get("/area/getallarea");
    setAreas(res.data.data);
  };

  useEffect(() => {
    getAllMyScreen();
    getAllStates();
    getAllCities();
    getAllAreas();
  }, []);

  // Handlers
  const handleStateChange = (e) => {
    const stateId = e.target.value;
    setSelectedState(stateId);
    setSelectedCity("");
    setSelectedArea("");

    const filtered = stateId
      ? screen.filter((sc) => sc.stateId?._id === stateId)
      : screen;

    setFilteredScreens(filtered);
  };

  const handleCityChange = (e) => {
    const cityId = e.target.value;
    setSelectedCity(cityId);
    setSelectedArea("");

    const filtered = cityId
      ? screen.filter((sc) => sc.cityId?._id === cityId)
      : screen.filter((sc) =>
          selectedState ? sc.stateId?._id === selectedState : true
        );

    setFilteredScreens(filtered);
  };

  const handleAreaChange = (e) => {
    const areaId = e.target.value;
    setSelectedArea(areaId);

    const filtered = areaId
      ? screen.filter((sc) => sc.areaId?._id === areaId)
      : screen.filter((sc) =>
          selectedCity ? sc.cityId?._id === selectedCity : true
        );

    setFilteredScreens(filtered);
  };


  return (
   
    <div className="screen-container">
      <ToastContainer
        position="top-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
          {isLoader && <CustomLoader />}
          <h2 className="title">OUR Restaurant</h2>
    
          {/* Filter Bar */}
          <div className="filter-bar">
            <label>Select State:</label>
            <select value={selectedState} onChange={handleStateChange}>
              <option value="">All States</option>
              {states.map((state) => (
                <option key={state._id} value={state._id}>
                  {state.name}
                </option>
              ))}
            </select>
    
            <label>Select City:</label>
            <select value={selectedCity} onChange={handleCityChange}>
              <option value="">All Cities</option>
              {cities
                .filter(
                  (city) =>
                    city.stateId === selectedState ||
                    city.stateId?._id === selectedState
                )
                .map((city) => (
                  <option key={city._id} value={city._id}>
                    {city.name}
                  </option>
                ))}
            </select>
    
            <label>Select Area:</label>
            <select value={selectedArea} onChange={handleAreaChange}>
              <option value="">All Areas</option>
              {areas
                .filter(
                  (area) =>
                    area.cityId === selectedCity ||
                    area.cityId?._id === selectedCity
                )
                .map((area) => (
                  <option key={area._id} value={area._id}>
                    {area.name}
                  </option>
                ))}
            </select>
          </div>
    
          {/* Restaurant Cards */}
          <div className="screen-grid">
            {Array.isArray(filteredScreens) && filteredScreens.length > 0 ? (
              filteredScreens.map((sc) => (
                <div className="screen-card" key={sc._id}>
                  <img
                    src={sc?.imageURL || "https://via.placeholder.com/200"}
                    alt="Screen"
                    className="screen-image"
                  />
                  <div className="screen-details">
                    <div className="info">
                      <strong>Restaurant Name:</strong> {sc.title || "N/A"}
                    </div>
                    <div className="info">
                      <strong>Description:</strong> {sc.description || "N/A"}
                    </div>
                    <div className="info">
                      <strong>State:</strong> {sc.stateId?.name || "N/A"}
                    </div>
                    <div className="info">
                      <strong>City:</strong> {sc.cityId?.name || "N/A"}
                    </div>
                    <div className="info">
                      <strong>Area:</strong> {sc.areaId?.name || "N/A"}
                    </div>
                    <div className="info">
                      <strong>Location:</strong> {sc.address || "N/A"}
                    </div>
                    <div className="info">
                      <strong>Timing:</strong> {sc.timing || "N/A"}
                    </div>
                     {/* <Link
    //             to={`/owner/updatescreen1/${sc._id}`}
    //             className="update-button"
    //           >
    //             Update
    //           </Link> */}
    //             {/* <button
    //             onClick={() => {
    //               deleteRestaurant(sc._id);
    //             }}
    //             className="update-button"
    //           >
    //             DELETE
    //           </button> */}
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">No restaurants available</p>
            )}
          </div>
        </div>
  );
};
