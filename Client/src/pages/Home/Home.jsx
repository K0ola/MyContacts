import React from "react";

import s from "./Home.module.scss";
import { FaEdit } from "react-icons/fa";


function Home() {
    
  return (
    <section className={s.app}>
      <div className={s.header}>

      </div>
      <div className= {s.container}>
        <div className={s.contactsList}>

            <div className={s.contact}>
              <div className={s.contactIllu}>
                
              </div>
              <div className={s.contactInfos}>
                  <h1 className={s.name}>John Doe</h1>
                  <h2 className={s.phoneNumber}>+33672395977</h2>
              </div>
              <FaEdit className={s.EditBTN}/>
            </div>

        </div>
      </div>
    </section>
    )
}

export default Home