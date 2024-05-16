import React, { useContext, useState } from 'react'
import { UserContext } from '../App'
import { Navigate } from 'react-router-dom'
import BLogEditor from '../components/blog-editor.component';
import PublishForm from '../components/publish-form.component';

export default function Editor() {

    const [editorState, setEditorState] = useState("editor");
    let { userAuth: { access_token } = {}} = useContext(UserContext)



  return (
    access_token === null ? <Navigate to="/signin"/> 
    : editorState == "editor" ? <BLogEditor/> : <PublishForm/>
  )
}
