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
          <div className="delete-modal">
            <h2 className="delete-spot">Confirm Delete</h2>
            <div>Are you sure you want to remove this spot?</div>
            <button className="yes-delete" onClick={confirmDelete}>
              Yes (Delete Spot)
            </button>
            <button className="no-delete" onClick={cancelDelete}>
              No (Keep Spot)
            </button>
          </div>
        </>
      )}
    </>
  );
}

export default DeleteButton;
