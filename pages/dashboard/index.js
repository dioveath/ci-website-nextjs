import { useState } from 'react';
import Head from "next/head";
import Image from "next/image";
import styles from "../../styles/dashboard/index.module.css";
import Navbar from "../../components/Navbar.js";
import Footer from "../../components/footer/Footer.js";

import useAuth from "../../lib/hooks/Auth.js";

import { Editor } from "react-draft-wysiwyg";
import { EditorState } from 'draft-js';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default function Dashboard() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const onEditorStateChange = (editState) => {
    setEditorState(editState);

  };

  return (
    <div className={styles.container}>
      <Head>
        <title> Charicha Institute | Dashboard </title>
        <meta name="description" content="User Dashboard" />
        <meta property="og:image" itemProp="image" content="_image.png" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <main className="main">
        <Editor
          editorState={editorState}
          wrapperClassName="demo-wrapper"
          editorClassName="demo-editor"
          onEditorStateChange={onEditorStateChange}
        />
      </main>

      <Footer />
    </div>
  );
}
