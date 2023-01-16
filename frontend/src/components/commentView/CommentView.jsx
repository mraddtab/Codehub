import { useState, useEffect } from "react";
import styles from "./commentView.module.css";

const CommentView = ({length, newCommentHeight, allComments}) => {
  const [text, setText] = useState("");
  const [titleError, setTitleError] = useState(false);
  const [inputError, setInputError] = useState(false);
  const [type, setType] = useState("Comment");
  const [savedTitle, setSavedTitle] = useState("Comment");
  const [savedInput, setSavedInput] = useState("Comment");
  const [savedComments, setSavedComments ] = useState([]);

  // @desc
  // This makes the text area increase height automatically
  // https://stackoverflow.com/a/53426195/18401461
  const calculateHeight = (e) => {
    e.target.style.height = "inherit";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  // @desc
  // Make placeholder dynamic
  // const placeHolderText = () => {
  //   const text = [
  //     "What do you want to your reader to take away?",
  //     "How would you explain it to yourself when you first started coding?"
  //   ];

  //   const index = Math.floor(Math.random() * text.length);
  //   setText(text[index])
  // }

  // Disabling textarea https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea

  // @desc
  // Handles submitting a comment, editing, and setting errors for fields that are not filled
  const handleSubmit = () => {
    const title = document.getElementById("titleInput"+length);
    const input = document.getElementById("input"+length);
    const height = document.getElementById("height"+length);
    const commentid = document.getElementById("commentid"+length);
    console.log(commentid.value);
    if(newCommentHeight !== undefined){
      height.value = newCommentHeight;
    }

    if(!commentid.value){
      commentid.value = "000000000000000000000000"
    }

    // If clicking on Edit button, make the Comment component editable
    if (type === "Edit") {
      title.removeAttribute("readonly");
      input.removeAttribute("readonly");
      setType("Comment");
    }
    // If clicking on Comment button, make the Comment submit
    else {
      if (title.value === "" || input.value === "") {
        if (title.value === "") {
          setTitleError(true);
        }
        if (input.value === "") {
          setInputError(true);
        }
      } else {
        title.setAttribute("readonly", true);
        input.setAttribute("readonly", true);

        const token = localStorage.getItem("token");
        const url = window.location.pathname;
        const id = url.split("/")[3];
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}`  },
          body: JSON.stringify({ commentId: commentid.value, comments: [{ height: parseFloat(height.value), title: title.value, input: input.value}]})
        };

        fetch(process.env.REACT_APP_API + "/comment/" + id, requestOptions)
          .then((response) => {
            if (response.ok) {
              return response.json();
            }
            throw new Error('Something went wrong');
          })
          .catch((error) => console.log(error))
    

        setTitleError(false);
        setInputError(false);
        setType("Edit");
      }
    }
  };

  const handleDelete = () => {
    console.log("You have clicked the delete button");

    // implement functionality
    // The following video gives an idea https://youtu.be/sjAeLwuezxo
    // The will not delete comments but use 'filter' to remove from a database.
    // In his implementation the comments show up after a call to the database
  };

    //Get code from database
    useEffect(() => {
      console.log("HITS");
      const token = localStorage.getItem("token");
      const url = window.location.pathname;
      const id = url.split("/")[3];
      const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}`  },
      };
      fetch(process.env.REACT_APP_API + "/comment/" + id, requestOptions)
        .then(res => res.json())
        .then(
          result => {
            setSavedComments(result.comments);
            if(result.comments[length-1].title !== undefined){
              const title = document.getElementById("titleInput"+length);
              const input = document.getElementById("input"+length);
              const height = document.getElementById("height"+length);
              const commentid = document.getElementById("commentid"+length);
              title.value = result.comments[length-1].title;
              input.value = result.comments[length-1].input;
              height.value = result.comments[length-1].height;
              commentid.value = result.comments[length-1]._id;
              title.setAttribute("readonly", true);
              input.setAttribute("readonly", true);
              setTitleError(false);
              setInputError(false);
              setType("Edit");
            }
          },
        )
        .catch(error => console.log(error));
    }, []);

  return (
      <div className={styles.comment}>
        {titleError ? (
          <>
            <span className={styles.error}>Please populate this field</span>
          </>
        ) : (
          <></>
        )}
        <div className={styles.flexTitle}>
          <textarea
            id={"titleInput"+length}
            type="text"
            className={ `${styles.titleInput} ${styles.textareaInput}` }
            onChange={calculateHeight}
            placeholder="Title..."
          />
        </div>
        {inputError ? (
          <span className={styles.error}>Please populate this field</span>
        ) : (
          <></>
        )}
        <div className={styles.flexInput}>
          <textarea
            id={"input"+length}
            type="text"
            className={ `${styles.input} ${styles.textareaInput}` }
            onChange={calculateHeight}
            placeholder="Comment..."
          />
          <textarea
            id={"height"+length}
            className={styles.Hiddenvalueholder}
          />
          <textarea
            id={"commentid"+length}
            className={styles.Hiddenvalueholder}
          />
        </div>
      </div>
  );
};

export default CommentView;