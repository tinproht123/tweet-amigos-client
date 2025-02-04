import { useState } from "react";
import { FaSmile } from "react-icons/fa";
import { FaRegImage } from "react-icons/fa6";
import { TiDelete } from "react-icons/ti";
import EmojiPicker from "emoji-picker-react";
import { createTweet } from "../api";
import { useStore } from "../store";

const TextEditor = () => {
  const { showTextEditor, setShowTextEditor } = useStore();
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiClick = (emojiObject) => {
    setContent((prevContent) => prevContent + emojiObject.emoji);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleTextChange = (e) => {
    setContent(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("content", content);
    formData.append("user_id", 5);
    if (image) {
      formData.append("image", image);
    }

    try {
      const data = await createTweet(formData);
      if (data) {
        setContent("");
        if (showTextEditor === true) {
          setShowTextEditor();
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="px-4 py-6">
      <div className="flex">
        <div className="w-1/6">
          <img
            src="https://i.pinimg.com/736x/28/a2/83/28a2833ecb6a0766243329f4f44f2b8d.jpg"
            alt="profile image avatar"
            className="profile-image-small"
          />
        </div>
        <textarea
          value={content}
          onChange={handleTextChange}
          placeholder="What's happening?"
          className="text-[18px] w-full focus:outline-none whitespace-pre-wrap"
          rows={4}
        ></textarea>
      </div>
      {imagePreview && (
        <div className="relative">
          <button
            className="absolute top-5 right-5 p-1 rounded-full text-primary hover:bg-opacity-35 hover:bg-black"
            onClick={() => setImagePreview(null)}
          >
            <TiDelete size={40} />
          </button>
          <img src={imagePreview} alt="preview" className="py-3 mx-auto" />
        </div>
      )}
      <div className="flex justify-between border-t border-primary py-3 mt-3">
        <div className="flex gap-x-1">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 hover:bg-primary rounded-full cursor-pointer transition"
          >
            <FaSmile />
          </button>
          <label
            htmlFor="image-upload"
            className="p-2 hover:bg-primary rounded-full cursor-pointer transition"
          >
            <FaRegImage />
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>
        <button
          onClick={handleSubmit}
          disabled={content.trim() === "" || content === null}
          className="bg-primary text-white rounded-full py-1 px-5 disabled:bg-gray-300 tracking-wider font-semibold"
        >
          Post
        </button>
      </div>
      {showEmojiPicker && (
        <div className="absolute z-10 bg-white border shadow-md rounded mt-2">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
    </div>
  );
};

export default TextEditor;
