import { put, call } from "redux-saga/effects";
import { delay } from "redux-saga/effects";
import axios from "axios";

import * as actions from "../actions";

export function* logoutSaga(action) {
  yield call([localStorage, "removeItem"], "token");
  yield call([localStorage, "removeItem"], "expirationDate");
  yield call([localStorage, "removeItem"], "userId");
  yield put(actions.logoutSucceed());
}

export function* checkAuthTimeoutSaga(action) {
  yield delay(action.expirationTime);
  yield put(actions.logout());
}

export function* authUserSaga(action) {
  yield put(actions.authStart());
  const authData = {
    email: action.email,
    password: action.password,
    returnSecureToken: true,
  };
  let url =
    "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyB2b5YPewGNZ8cPXInYamA3bBnEkGPPS-I";

  if (!action.isSignUp) {
    url =
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyB2b5YPewGNZ8cPXInYamA3bBnEkGPPS-I";
  }

  try {
    const response = yield axios.post(url, authData);

    const expirationTime = yield response.data.expiresIn * 1000;
    const expirationDate = yield new Date(
      new Date().getTime() + expirationTime
    );
    yield localStorage.setItem("token", response.data.idToken);
    yield localStorage.setItem("expirationDate", expirationDate);
    yield localStorage.setItem("userId", response.data.localId);
    yield put(
      actions.authSuccess(response.data.idToken, response.data.localId)
    );
    yield put(actions.checkAuthTimeout(expirationTime));
  } catch (error) {
    yield put(actions.authFail(error.response.data.error));
  }
}

export function* authCheckStateSaga(action) {
  const token = yield localStorage.getItem("token");
  if (!token) {
    yield put(actions.logout());
  } else {
    const expirationDate = yield new Date(
      localStorage.getItem("expirationDate")
    );
    if (expirationDate > new Date()) {
      const userId = yield localStorage.getItem("userId");
      yield put(actions.authSuccess(token, userId));
      yield put(
        actions.checkAuthTimeout(
          expirationDate.getTime() - new Date().getTime()
        )
      );
    } else {
      yield put(actions.logout());
    }
  }
}
