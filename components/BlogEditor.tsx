import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import 'quill/dist/quill.core.css'; // Import Quill styles
import 'quill/dist/quill.snow.css'; // Import Quill theme styles
import { useSDK } from '@metamask/sdk-react';
import { useUser } from './UserContext';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const BlogEditor = ({ onSave }: any) => {
  const [content, setContent] = useState('');
  const { sdk, connected, connecting, provider, chainId } = useSDK();
  const { account, setAccount } = useUser();

  useEffect(() => {
    if (connected && account) {
      // Do something if connected
    }
  }, [account, connected]);
  
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean'],
    ],
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
    },
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'link',
    'image',
  ];

  const handleSave = () => {
    const currentDate = new Date().toISOString();
    onSave({
      account,
      content, // Quill content
      date: currentDate,
    });
  };

  return (
    <div className="cs-card cs-style4 cs-box_shadow cs-white_bg">
      <ReactQuill
        theme="snow"
        value={content}
        onChange={setContent}
        modules={modules}
        formats={formats}
      />
      <div className="container">
        <div className="row">
          <div className="col-lg-12 text-center">
            <button onClick={handleSave} className="cs-btn cs-style1 cs-btn_lg m-3">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;

