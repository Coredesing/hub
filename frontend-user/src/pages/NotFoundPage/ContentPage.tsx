import React from "react";
import { typeDisplayFlex } from "../../styles/CommonStyle";
import { makeStyles } from "@material-ui/core";
const useStyles = makeStyles({
  notfound: {
    ...typeDisplayFlex,
    justifyContent: "center",
    alignItems: "center",
  }
})

const ContentPage = () => {
  const styles = useStyles();
  return (
    <div
      id="wrapper"
      className={styles.notfound}
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
  );
};

export default ContentPage;
