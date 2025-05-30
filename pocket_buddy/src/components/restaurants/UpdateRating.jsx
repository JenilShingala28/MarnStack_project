import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

export const UpdateRating = () => {
  const id = useParams().id;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: async () => {
      const res = await axios.get(
         "/rating/ratingby/" + id
      );
      return res.data.data;
    },
  });

  const navigate = useNavigate();

  const submitHandler = async (data) => {
    data.userId = localStorage.getItem("id");
    delete data._id;
    console.log(data);

    const res = await axios.put("/rating/updateratingby/" + id, data);
    console.log(res.data);

    navigate("/owner/myrating");
  };

  const ValidationSchema = {
    commentsvalidator: {
      required: { value: true, message: "comments is required" },
    },
    ratingvalidator: {
      required: { value: true, message: "rating is required" },
      min: { value: 1, message: "Rating must be at least 1" },
      max: { value: 5, message: "Rating cannot be more than 5" },
    },
  };

  return (
    <div className="form-container">
      <h1>OFFER SCREEN</h1>
      <form onSubmit={handleSubmit(submitHandler)}>
      <div className="form-group">
          <label>RESTAURANT NAME</label>
          <input
            type="text"
            placeholder="Enter title"
            {...register("restaurantName", ValidationSchema.titlevalidator)}
          ></input>
          <span style={{ color: "red", fontSize: "12px" }}>
            {errors.restaurantName?.message}
          </span>
        </div>
        <div className="form-group">
          <label>COMMENTS</label>
          <input
            type="text"
            placeholder="Enter comments"
            {...register("comments", ValidationSchema.commentsvalidator)}
          />
          <span style={{ color: "red", fontSize: "12px" }}>
            {errors.comments?.message}
          </span>
        </div>

        <div className="form-group">
          <label>RATING</label>
          <input
            type="number"
            placeholder="Enter rating 1 - 5"
            {...register("rating", ValidationSchema.ratingvalidator)}
          />
          <span style={{ color: "red", fontSize: "12px" }}>
            {errors.rating?.message}
          </span>
        </div>

        <div>
          <input type="submit" className="submit-button" />
        </div>
      </form>
    </div>
  );
};
