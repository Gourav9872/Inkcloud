import { EditorContent, useEditor } from "@tiptap/react";
import "highlight.js/styles/atom-one-dark.css";
import MenuBar from "./MenuBar";
import { extensions } from "../../constants/tiptapExtensions";

const Editor = ({ onDataChange, content, editable }) => {

  const editor = useEditor({    //useEditor -> to create editor instance
    editable,       //The editable property determines if users can write into the editor.
    extensions: extensions,
    editorProps: {          //You can use it to override various editor events or change editor DOM element attributes, for example to add some Tailwind classes
      attributes: {
        class:
          "!prose !dark:prose-invert prose-sm sm:prose-base max-w-none mt-7 focus:outline-none prose-pre:bg-[#282c34] prose-pre:text-[#abb2bf]",
      },
    },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();   // Returns the current editor document as JSON.
      onDataChange(json);
    },
    content: content,   //you can provide the initial content for the editor. This can be HTML or JSON.
  });

  return (
    <div className="w-full relative">
      {editable && <MenuBar editor={editor} />}
      <EditorContent editor={editor} /> {/* for displaying the content for body */}
    </div>
  );
};

export default Editor;