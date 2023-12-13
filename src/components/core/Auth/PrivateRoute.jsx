import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({children}) => {

    const {token} = useSelector((state) => state.auth);

    if(token !== null) //only allow if valid user(student/instructor/admin)
        return children
    else
        return <Navigate to="/login" />

}

export default PrivateRoute
