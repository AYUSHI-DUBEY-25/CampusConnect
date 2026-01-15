import React, { Children } from "react";
import Header from "./Header";
import Footer from "./Footer";
import {Helmet} from "react-helmet"
import {Toaster} from "react-hot-toast"

const Layout= ({children,title,description,keywords, author})=>{
    return(
        <>
        <Helmet>
            <meta charSet="utf-8"/>
            <meta name="description" content={description}/> 
            <meta name="keywords" content={keywords}/>
            <meta name="author" ontent={author}/>
            <title>{title}</title>
        </Helmet>
        <Header/>
            <main style={{minHeight: "70vh", width: "100vw", overflowX: "hidden"}}>

            <Toaster/>
            {children}
        </main>
        <Footer/>
        </>
    )
}
Layout.defaultProps={
    title:"College_events",
    description:"MERN",
    keywords:"mern",
    author:"Ayushi"
}
export default Layout;