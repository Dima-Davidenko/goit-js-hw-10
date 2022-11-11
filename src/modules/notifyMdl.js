import { Notify } from "notiflix/build/notiflix-notify-aio";
import Params from "../utils/params.js";
import RefsMdl from "./refsMdl.js";

function showNotification(message = "", type = "info") {
  hideLoadingInfo();
  Notify[type](message, Params.notiflixOpts);
}

function hideNotify() {
  const notifyMessage = document.getElementById("NotiflixNotifyWrap");
  if (notifyMessage) notifyMessage.style.opacity = 0;
}

function hideLoadingInfo() {
  if (!RefsMdl.loadingInfoEl.classList.contains("invisible")) {
    RefsMdl.loadingInfoEl.classList.add("invisible");
  }
}

function showLoadingInfo() {
  hideNotify();
  if (RefsMdl.loadingInfoEl.classList.contains("invisible")) {
    RefsMdl.loadingInfoEl.classList.remove("invisible");
  }
}

export default {
  hideNotify,
  showLoadingInfo,
  hideLoadingInfo,
  showNotification,
};
