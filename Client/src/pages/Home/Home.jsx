import React from "react";

import Header from "../../components/Header/Header";

import s from "./Home.module.scss";
import { FaEdit } from "react-icons/fa";


function Home() {

  const modifContact = () => {
    console.log("test");
  };
    
  return (
    <section className={s.app}>
      <Header />
      <div className={s.container}>
        <div className={s.contactsList}>

            <div className={s.contact}>
              <div className={s.contactDetails}>
                <div className={s.contactIllu}>
                
                </div>
                <div className={s.contactInfos}>
                    <h1 className={s.name}>John Doe</h1>
                    <h2 className={s.phoneNumber}>+33672395977</h2>
                    <div className={s.groupsList}>
                      
                    </div>
                </div>
              </div>
              <button onClick={modifContact} className={s.EditBTN}><FaEdit/></button>
            </div>

        </div>
      </div>
    </section>
  )
}

export default Home