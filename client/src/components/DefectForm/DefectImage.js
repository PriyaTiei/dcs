import { useSelector, useDispatch } from "react-redux";
import { Form, Input  } from "semantic-ui-react";
import { dcsSlice } from "../../redux/slices/dcsSlice";

export default function DefectImage() {

  const dispatch = useDispatch();

  const image = useSelector((state) => state.dcs.image);
  const imagePreview = useSelector((state) => state.dcs.imagePreview);

  const handleImageChange = (event) => {
    dispatch(dcsSlice.actions.setImage(event.target.files[0]));
    dispatch(
      dcsSlice.actions.setImagePreview(
        URL.createObjectURL(event.target.files[0])
      )
    );
  };

  const handleRemoveImage = (event) => {
    dispatch(dcsSlice.actions.setImage());
    dispatch(dcsSlice.actions.setImagePreview(""));
  };

  

  return (
    <>
      
       <Form.Field>
          <label>Image :</label>
          <div className="ui action input">
            <Input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              capture="camera"
            />
            {image && (
              <button onClick={handleRemoveImage}>
                <i className="ui icon remove" />
              </button>
            )}
          </div>
        </Form.Field>

        {image && (
          <div>
            <img src={imagePreview} alt={""} height={200} />
          </div>
        )}
      
    </>
  );
}
