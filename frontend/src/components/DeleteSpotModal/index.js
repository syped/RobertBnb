import { useState } from "react";
import { deleteOneSpot } from "../../store/spots";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";

function DeleteButton({ spot }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [exists, setExists] = useState(true);

  const confirmDelete = (e) => {
    e.preventDefault();
    dispatch(deleteOneSpot(spot.id)).then(closeModal);
    setExists(false);
  };

  const cancelDelete = (e) => {
    e.preventDefault();
    closeModal();
  };

  // useEffect(() => {
  //   return spots;
  // }, [spots]);

  return (
    <>
      {exists && (
        <>
          <h2>Confirm Delete</h2>
          <div>Are you sure you want to remove this spot?</div>
          <button onClick={confirmDelete}>Yes (Delete Spot)</button>
          <button onClick={cancelDelete}>No (Keep Spot)</button>
        </>
      )}
    </>
  );
}

export default DeleteButton;
