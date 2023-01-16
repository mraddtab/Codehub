import { useState, useEffect, useCallback } from "react";
// import { highlight, languages } from 'prismjs/components/prism-core';
// import 'prismjs/components/prism-clike';
// import 'prismjs/components/prism-javascript';
import CodeMirror from "@uiw/react-codemirror";
import Comment from "../comment/Comment.jsx";
import { oneDark } from "@codemirror/theme-one-dark";
import { handleSubmit } from "../comment/Comment.jsx";
import { python } from "@codemirror/legacy-modes/mode/python"; // npm i @codemirror/legacy-modes
import { swift } from "@codemirror/legacy-modes/mode/swift"; // npm i @codemirror/legacy-modes
import { javascript } from "@codemirror/legacy-modes/mode/javascript"; // npm i @codemirror/legacy-modes
import { go } from "@codemirror/legacy-modes/mode/go"; // npm i @codemirror/legacy-modes
import { c } from "@codemirror/legacy-modes/mode/clike"; // npm i @codemirror/legacy-modes
import { StreamLanguage } from "@codemirror/stream-parser"; // npm i @codemirror/stream-parser
import styles from "./note.module.css";
import { Link, use } from "react-router-dom";

// Icons
import IconButton from '@mui/material/IconButton';
import QueueOutlinedIcon from '@mui/icons-material/QueueOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Container, Icon } from "@mui/material";
import { padding } from "@mui/system";

const Note = () => {
  
  // Variables for highlighting page
  const [commentButtonPoint, setCommentButtonPoint] = useState({ x: 0, y: 0 }); // Tells Comment button where to position
  const [highlightPoint, setHighlightPoint] = useState({ x: 0 }); // Tells Comment button where to position
  const [commentHover, setCommentHover] = useState(false); // Shows Comment button on true. Removes in false
  const [commentsList, setCommentsList] = useState([]); // Comment list that shows on the left
  const [visibleComments, setVisibleComments] = useState(true); // Hides or unhides the comments for viewing
  const [codefield, setCodeField] = useState("");
  const [savedComments, setSavedComments] = useState([]);
  const [commentHeight, setCommentHeight] = useState(0);
  const [commentAmount, setCommentAmount] = useState();
  const [language, setLanguage] = useState(javascript); // Used for syntax highlighting
  const [count, setCount] = useState(0);
  const [highlights, setHighlights] = useState([]);

  // Code that is shown on the CodeMirror editor. Can use MongoDB to make dynamic
  var code = codefield;
  var i = 200;

  const lang = {
    py: python,
    swift: swift,
    js: javascript,
    go: go,
    c: c,
  };

  // Handles what to do when the an HTML element comes into view (https://codepen.io/ryanfinni/pen/VwZeGxN) (https://codepen.io/ryanfinni/pen/jONBEdX)
  const handleIntersection = (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("fadeIn");
      } else {
        entry.target.classList.remove("fadeIn");
      }
    }
  };

  //Store code in database
  const handleSave = (event) => {
    // console.log(code);
    event.preventDefault();
    const token = localStorage.getItem("token");
    const url = window.location.pathname;
    const id = url.split("/")[2];
    const requestOptions = {

      method: "POST",
      headers: { "Content-Type": "application/json", authorization: `Bearer ${token}`  },
      body: JSON.stringify({
        code: code,
      }),
    };
    fetch(process.env.REACT_APP_API + "/note/" + id, requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Something went wrong");
      })
      .catch((error) => console.log(error));
  };

  //Get code from database
  useEffect(() => {
    document.body.className="notePageBodyBackground";
    const token = localStorage.getItem("token");
    const url = window.location.pathname;
    const id = url.split("/")[2];
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json", authorization: `Bearer ${token}`  },
    };

    fetch(process.env.REACT_APP_API + "/note/" + id, requestOptions)
    .then((res) => res.json())
    .then((result) => {
      if (result.comments.length > 0) {
        setSavedComments(result.comments);
        //console.log("getComments" + savedComments);
        // console.log(result);
        setCommentHeight(result.comments.height);
      }
      setCodeField(result.code);
      setCount(count + 1);
    });
  }, []);

  useEffect(() => {
    if (savedComments !== undefined && savedComments.length !== 0) {
      // console.log(savedComments);
      loadComment(savedComments[count - 1].height, savedComments);
      // console.log(savedComments[count - 1].height);
      if (count < savedComments.length) {
        setCount(count + 1);
      }
    }
  }, [count]);

  // Provides options for when to show an HTML element (https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
  const handleOptions = {
    threshold: 1, // Show element when you scrolled its entire height
  };

  // Creates new Intersection Oberserver object. We are using this for the scrolling feature (https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
  const observer = new IntersectionObserver(handleIntersection, handleOptions);

  // Provides the x and y coordinates where the comment button should be. It is not the exact x and y position but the position relative to the div that has the className "code".
  // Disallows highlighting feature for 1. Highlighting blanks, 2. Highlighting '\n', 3. Highlighting anywhere outside the code section
  const handleHover = useCallback( (event) => {
      const codeEditor = document.getElementsByClassName("cm-content")[0];
      const selection = window.getSelection();
      if (selection.anchorNode) {
        if ( (codeEditor.contains(event.target) && selection.toString().length > 0) || ( (selection.anchorNode.cmView !== undefined) && selection.toString().length > 0) ) {
          const codeSelection = selection.getRangeAt(0).getBoundingClientRect();
          const codeEditorTop = document.getElementsByClassName("cm-gutter cm-lineNumbers")[0].getBoundingClientRect().top;
          const headerHeight = document.getElementById("codeEditorHeader").getBoundingClientRect().height;
          const gutterWidth = document.getElementsByClassName("cm-gutter")[0].getBoundingClientRect().width;
          
          const x = 0 - gutterWidth;
          const y = headerHeight + codeSelection.top - codeEditorTop;
  
          setCommentButtonPoint({ x: x, y: y });
          setCommentHover(true);
          setHighlightPoint({ x: 38 });
        }
      }
    },
    [setCommentButtonPoint, setCommentHover, setHighlightPoint]
  );

  // Removes the comment button after clicking anywhere that is not the button itself
  const handleClick = useCallback( (event) => {
      const tag = event.target.tagName;
      console.log(tag === "path")
      if (tag === "path" || tag === "svg") {
        setCommentHover(true);
      }
      else {
        setCommentHover(false);
      }
    },
    [setCommentHover]
  );

  // Handles highlighting and clicking for commenting feature
  useEffect(() => {
    window.addEventListener("mouseup", handleHover); // This is for highlighting
    window.addEventListener("mousedown", handleClick); // This is for clicking
    return () => {
      window.removeEventListener("mouseup", handleHover);
      window.removeEventListener("mousedown", handleClick);
    };
  });

  const addComment = (savedComments) => {
    const codeHighlights = document.getElementsByClassName("cm-selectionLayer")[0].childNodes;
    const section = document.getElementById("highlightSection");
    
    const subContainer = document.createElement("div");
    subContainer.className = "cm-selectionLayer";
    subContainer.style.position = "relative";
    subContainer.style.zIndex = "10000000000";
    subContainer.style.top = `${commentButtonPoint.y}px`;
    subContainer.style.left = `${highlightPoint.x}px`;
    
    for(let i = 0; i < codeHighlights.length; i++) {
      const temp = codeHighlights[i];
      temp.style.backgroundColor = "aqua";
      temp.style.opacity = "0.2";
      subContainer.appendChild(temp);
    }

    section.append(subContainer);

    console.log((subContainer));
    console.log((section));

    setHighlights(highlights.concat(codeHighlights));

    setCommentsList(
      commentsList.concat(
        // This is a hack :/

        <div
          className={styles.commentsArray}
          key={commentsList.length}
          id={commentsList.length}
          style={{
            position: "absolute",
            top: commentButtonPoint.y,
            left: "50%",
            transform: "translate(-50%)",
          }}
        >
          <Comment
            length={commentsList.length + 1}
            newCommentHeight={commentButtonPoint.y}
            allComments={savedComments}
          />
        </div>
      )
    );
    i += 100;
    setCommentHover(false);
  };

  const loadComment = (commentHeight, savedComments) => {
    setCommentsList(
      commentsList.concat(
        // This is a hack :/

        <div
          className={styles.commentsArray}
          key={commentsList.length}
          id={commentsList.length}
          style={{
            position: "absolute",
            top: commentHeight,
            left: "50%",
            transform: "translate(-50%)",
          }}
        >
          <Comment
            length={commentsList.length + 1}
            allComments={savedComments}
          />
        </div>
      )
    );

    i += 100;
    setCommentHover(false);
  };

  const handleViewButton = () => {
    if (visibleComments === true) {
      // console.log("Listening for intersections (don't add new comments)");
      setVisibleComments(false);
      for (const element of commentsList) {
        const id = element.props.id;
        const comment = document.getElementById(`${id}`);
        comment.classList.add("original");
        observer.observe(comment);
      }
    }

    if (visibleComments === false) {
      setVisibleComments(true);
      // console.log("Not listening for intersections (you can add comments)");
      for (const element of commentsList) {
        const id = element.props.id;
        const comment = document.getElementById(`${id}`);
        comment.classList.remove("original");
        observer.unobserve(comment);
      }
    }
  };

  const handleSelectLanguage = (event) => {
    setLanguage(lang[event.target.value]);
  };

  return (
    <div className={styles.App}>

      <Link to={`/note/view/${window.location.pathname.split("/")[2]}`}>
        <div className={styles.viewButton} onClick={handleViewButton}>
          <VisibilityOutlinedIcon style={{ color: "black"}}></VisibilityOutlinedIcon>
        </div>
      </Link>

      {/* This is diving into two sections. This is for dividing one section left and the other right */}
      <div className={styles.row}>
        <div className={styles.comments}>{commentsList}</div>
        <div className={styles.code}>
          <div className={styles.codeEditor}>
            <div id="highlightSection" style={{position: "absolute"}}></div>
            <div id="codeEditorHeader" className={styles.codeEditorHeader}>
              <select className={styles.codeEditorHeaderLanguageSelection} name="" id="" onChange={handleSelectLanguage}>
                <option value="py">Python</option>
                <option value="swift">Swift</option>
                <option value="js">Javascript</option>
                <option value="go">Go</option>
                <option value="c">C</option>
              </select>
              <button className={styles.codeEditorHeaderSave} onClick={handleSave}>Save</button>
            </div>
            {commentHover ? (
              <>
                <QueueOutlinedIcon style={{zIndex:1000000, position: "absolute", left: commentButtonPoint.x, top: commentButtonPoint.y,}} onClick={addComment} className={styles.addComment}/>
              </>

            ) : (
              <></>
            )}

            <CodeMirror
              value={code}
              height="auto"
              // height="100vh"
              // width="55vw"
              theme={oneDark}
              autoFocus={true}
              extensions={StreamLanguage.define(language)}
              placeholder="Put code"
              onChange={(value, viewUpdate) => {
                // console.log("value:", value);
                setCodeField(value);
              }}
            />
            <div className={styles.codeEditorFooter}></div>
          </div>
        
        
          {/* <div className="cm-selectionLayer" style={{position:"relative" , zIndex: 10000000000, top: -100}} aria-hidden="true">
            <div className="cm-selectionBackground" style={{backgroundColor: "aqua", opacity: 0.2, left: 68.484375, top: 76.99, width: 732.515625, height: 15.01}}></div>
            <div className="cm-selectionBackground" style={{backgroundColor: "aqua", opacity: 0.2,left: 37.484375, top: 91.99, width: 763.515625, height: 57.01}}></div>
            <div className="cm-selectionBackground" style={{backgroundColor: "aqua", opacity: 0.2, left: 37.484375, top: 148.99, width: 94, height: 15.01}}></div>
          </div>

          <div className="cm-selectionLayer" style={{position:"relative" , zIndex: 1000000, top: -100}} aria-hidden="true">
            <div className="cm-selectionBackground" style={{ backgroundColor: "aqua", opacity: 0.2, left: 37.484375, top: 148.99, width: 763.515625, height: 15.01}}></div>            
            <div className="cm-selectionBackground" style={{ backgroundColor: "aqua", opacity: 0.2, left: 37.484375, top: 163.99, width: 763.515625, height: 57.01}}></div> 
            <div className="cm-selectionBackground" style={{ backgroundColor: "aqua", opacity: 0.2, left: 37.484375, top: 220.99, width: 79, height: 15.01}}></div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Note;