import { useState } from 'react';
import Head from "next/head";
import dynamic from 'next/dynamic';
import Image from "next/image";
import { useRouter } from 'next/router';

import styles from "../../../styles/dashboard/index.module.css";
import Navbar from "../../../components/Navbar.js";
import Footer from "../../../components/footer/Footer.js";

import useAuth from "../../../lib/hooks/Auth.js";

import { EditorState } from 'draft-js';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const Editor = dynamic(
  () => import('react-draft-wysiwyg').then(mod => mod.Editor),
  { ssr: false }
);

export default function Article() {
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
