import { Notify } from "notiflix/build/notiflix-notify-aio";
import Params from "../utils/params.js";
import RefsMdl from "./refsMdl.js";

function showNotification(message = "", type = "info") {
  hideLoadingInfo();
  const windowInnerWidth = +window.innerWidth;
  let fontSize = "15px";
  if (windowInnerWidth >= 768) {
    fontSize = "20px";
  }
  Notify[type](message, { ...Params.notiflixOpts, fontSize });
}

function hideNotify() {
  const notifyMessage = document.getElementById("NotiflixNotifyWrap");
  if (notifyMessage) notifyMessage.style.opacity = 0;
}

function hideLoadingInfo() {
  RefsMdl.loadingInfoEl.classList.add("invisible");
}

function showLoadingInfo() {
  hideNotify();
  RefsMdl.loadingInfoEl.classList.remove("invisible");
}

export default {
  hideNotify,
  showLoadingInfo,
  hideLoadingInfo,
  showNotification,
};
