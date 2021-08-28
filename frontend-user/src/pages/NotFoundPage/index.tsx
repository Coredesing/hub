import React from "react";
import DefaultLayout from "../../components/Layout/DefaultLayout";
import { typeDisplayFlex } from "../../styles/CommonStyle";

const NotFoundPage = () => {
  return (
    <DefaultLayout>
      <div
        id="wrapper"
        style={{
          ...typeDisplayFlex,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          src="/images/404.png"
          alt="404"
          style={{
            width: 500,
            height: 500,
            objectFit: "contain",
          }}
        />
      </div>
    </DefaultLayout>
  );
};

export default NotFoundPage;
