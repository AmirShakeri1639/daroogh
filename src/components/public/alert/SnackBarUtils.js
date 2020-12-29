import { immediateToast } from "izitoast-react";
import "izitoast-react/dist/iziToast.css";

class Msgdialog {
  question(config) {
    config.rtl = true;
    config.position = "center";
    config.progressBar = false;
    config.theme = "dark";
    config.backgroundColor = "white";
    config.close = false;
    config.overlay = true;
    config.timeout = false;
    immediateToast("question", config);
  }

  message(config, type = "warning") {
    config.rtl = true;
    config.position = "center";
    config.progressBar = true;
    config.theme = "dark";

    switch (type) {
      case "error":
        config.backgroundColor = "red";
        config.messageColor = "#f3f3f3";
        break;
      case "success":
        config.backgroundColor = "green";
        config.messageColor = "white";
        break;
      default:
        config.backgroundColor = "white";
        config.messageColor = "black";
        break;
    }

    config.close = false;
    config.overlay = true;
    config.timeout = 5000;
    config.buttons = [
      [
        "<button>باشه</button>",
        (instance, toast) => {
          instance.hide(
            {
              transitionOut: "fadeOutUp",
            },
            toast,
            "no"
          );
        },
      ],
    ];
    immediateToast(type, config);
  }

  showOutputMessage(output) {
    const errorType = "";
    if (output && output.success) {
      errorType = "success";
    } else {
      errorType = "error";
    }
    this.message(
      {
        title: "کاربر گرامی",
        message: output.message,
      },
      errorType
    );
  }
}

const msgdialog = new Msgdialog();
export default msgdialog;
