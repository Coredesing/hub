import { useMediaQuery, useTheme } from "@material-ui/core";
import { typeDisplayFlex } from "../../../styles/CommonStyle";
import useStyles from "./styles";

const Instruction = () => {
  const theme = useTheme();
  const isMdScreen = useMediaQuery(theme.breakpoints.down("md"));
  const isSMScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const styles = { ...useStyles() };
  return (
    <div className={styles.instruction}>
      <div className={styles.gridInstruction}>
        {!isSMScreen && (
          <div
            style={{
              ...typeDisplayFlex,
              justifyContent: "flex-end",
              alignItems: "center",
              marginRight: "24px",
            }}
          >
            <span className="text">How It Works</span>
          </div>
        )}
        <div className={styles.instructionCenter}>
          <div className={styles.instructionStep}>
            <img
              className="instructionIcon"
              src="/images/icons/instruction_user.png"
              alt=""
            />
            <div className={styles.description}>
              <span className="textCenter">KYC</span>
              {!isMdScreen && <span className="smallText">Verify status</span>}
            </div>
          </div>
          <div className={styles.instructionStep}>
            <img
              className="instructionIcon"
              src="/images/icons/instruction_ticket.png"
              alt=""
            />
            <div className={styles.description}>
              <span className="textCenter">Buy Ticket</span>
              {!isMdScreen && (
                <span className="smallText">Join Ticket pool</span>
              )}
            </div>
          </div>
          <div className={styles.instructionStep}>
            <img
              className="instructionIcon"
              src="/images/icons/instruction_coin.png"
              alt=""
            />
            <div className={styles.description}>
              <span className="textCenter">Buy Token/NFT</span>
              {!isMdScreen && (
                <span className="smallText">Join Token/NFT pool</span>
              )}
            </div>
          </div>
        </div>
        {!isSMScreen && (
          <div
            style={{
              ...typeDisplayFlex,
              alignItems: "center",
              marginLeft: "24px",
            }}
          >
            <img
              className="makesureIcon"
              src="/images/icons/instruction_makesure.png"
              alt=""
            />
            <span className="textEnd">
              Make sure you have ticket to join IGO
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Instruction;
