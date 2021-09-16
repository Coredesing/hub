import React from "react";
import DefaultLayout from "../../components/Layout/DefaultLayout";
import ContentPage from "./ContentPage";

const NotFoundPage = () => {
  return (
    <DefaultLayout style={{backgroundColor: '#0A0A0A'}}>
      <ContentPage />
    </DefaultLayout>
  );
};

export default NotFoundPage;
