import RenderMdl from "./renderMdl.js";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import Params from "../utils/params.js";
import RefsMdl from "./refsMdl.js";

function showNotification(message = "", type = "info") {
  RenderMdl.cleanOutput();
  hideLoadingInfo();
  Notify[type](message, Params.notiflixOpts);
}

function hideNotify() {
  const notifyMessage = document.getElementById("NotiflixNotifyWrap");
  if (notifyMessage) notifyMessage.style.opacity = 0;
}

function showLoadingInfo() {
  hideNotify();
  RefsMdl.loadingInfoEl.classList.remove("invisible");
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
