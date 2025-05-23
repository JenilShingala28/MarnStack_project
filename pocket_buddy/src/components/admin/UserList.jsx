import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { CustomLoader } from "../common/CustomLoader";
import { Bounce, toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

export const UserList = () => {
  const [users, setUsers] = useState([]);
  const [isLoader, setIsLoader] = useState(false);

  const getAllUser = async () => {
    try {
      setIsLoader(true);
      const res = await axios.get("/users");
      setUsers(res.data.data);
    } catch (error) {
      console.error("Error fetching locations:", error);
    } finally {
      setIsLoader(false);
    }
  };

  useEffect(() => {
    getAllUser();
  }, []);

  const deleteUser = async (id) => {
    try {
      setIsLoader(true);

      const res = await axios.delete(`/delete/${id}`);
      if (res.status === 200) {
        toast.success("Record deleted successfully!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
          transition: Bounce,
        });

        // ✅ Remove deleted restaurant from state without re-fetching
        setUsers((prevLocations) =>
          prevLocations.filter((item) => item._id !== id)
        );
      }
    } catch (error) {
      console.error("Deletion error:", error);
      toast.error("Failed to delete record!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
        transition: Bounce,
      });
    } finally {
      setIsLoader(false);
    }
  };

  const columns = [
    { field: "_id", headerName: "ID", width: 90 },
    {
      field: "roleId",
      headerName: "role ID",
      width: 300,
      renderCell: (params) => <span>{params.row?.roleId?._id || "N/A"}</span>,
    },
    {
      field: "role Name",
      headerName: "role Name",
      width: 200,
      renderCell: (params) => <span>{params.row?.roleId?.name || "N/A"}</span>,
    },
    // { field: "roleId", headerName: "roleId", width: 90 },
    { field: "firstName", headerName: "first Name", width: 200 },
    { field: "lastName", headerName: "last Name", width: 200 },

    { field: "email", headerName: "email", width: 300 },
    { field: "contact", headerName: "contact", width: 200 },
    { field: "address", headerName: "address", width: 400 },

    {
        field: "imageURL",
        headerName: "Image",
        width: 150,
        renderCell: (params) => (
          <img
            src={params.row.imageURL || "https://via.placeholder.com/100"}
            alt="Restaurant"
            style={{
              width: "100px",
              height: "100px",
              objectFit: "cover",
              borderRadius: "8px",
              border: "1px solid #ddd",
              boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.1)",
            }}
          />
        ),
      },


    // // ✅ View Button
    // {
    //   field: "view",
    //   headerName: "View",
    //   width: 150,
    //   renderCell: (params) => (
    //     <Link to="/admin/alluser">
    //       <Button
    //         variant="contained"
    //         sx={{
    //           background: "#441752",
    //           color: "white",
    //           padding: "10px 15px",
    //           fontSize: "16px",
    //           border: "1px solid #EFB6C8",
    //           borderRadius: "5px",
    //           cursor: "pointer",
    //           width: "100%",
    //           boxShadow: "0 2px 15px #441752",
    //           "&:hover": {
    //             background: " #8174a0",
    //             color: " #fff",
    //             border: "1px solid #441752",
    //             boxShadow: "0 2px 15px #441752",
    //           },
    //         }}
    //       >
    //         View
    //       </Button>
    //     </Link>
    //   ),
    // },

    // ✅ Delete Button
    {
      field: "delete",
      headerName: "Delete",
      width: 100,
      renderCell: (params) => (
        <Button
          variant="contained"
          sx={{
            background: "#441752",
            color: "white",
            padding: "10px 15px",
            fontSize: "16px",
            border: "1px solid #EFB6C8",
            borderRadius: "5px",
            cursor: "pointer",
            width: "100%",
            boxShadow: "0 2px 15px #441752",
            "&:hover": {
              background: " #8174a0",
              color: " #fff",
              border: "1px solid #441752",
              boxShadow: "0 2px 15px #441752",
            },
          }}
          // color="secondary"

          onClick={() => deleteUser(params.row._id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <ToastContainer
        position="top-left"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
        transition={Bounce}
      />

      {isLoader == true && <CustomLoader />}

      <DataGrid
        rows={users}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        getRowId={(row) => row._id}
        getRowHeight={() => 110}
        sx={{
          "& .MuiDataGrid-root": {
            backgroundColor: "#441752", // Background color for the entire grid
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: " #fff", // Column header background
            color: " #441752", // White text for contrast
            fontSize: "16px",
          },
          "& .MuiDataGrid-cell": {
            // color: " #441752", // White text in cells
            fontSize: "20px",
          },
          "& .MuiDataGrid-row": {
            backgroundColor: " #8174a0", // Row background
            color: "#fff", // Text color in rows
            border: "1px solid black",
            boxShadow: "0 2px 15px #441752",
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: " #efb6c8", // Lighter purple on hover
            color: " #5a2673",
          },
          "& .MuiCheckbox-root": {
            color: "#fff !important", // White checkbox
          },
        }}
      />
    </div>
  );
};
