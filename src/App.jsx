import { useEffect, useState } from "react";
import "./App.css";
import { SignInOrUp } from "./components/SignInOrUp";
import { MagicLinkVerify } from "./components/MagicLinkVerify";
import { scuteClient } from "./scute";
import { RegisterDevice } from "./components/RegisterDevice";
import { Profile } from "./components/Profile";

const router = {
  SIGN_IN_OR_UP: "SIGN_IN_OR_UP",
  VERIFY_MAGIC_LINK: "VERIFY_MAGIC_LINK",
  REGISTER_DEVICE: "REGISTER_DEVICE",
  PROFILE: "PROFILE",
};

const appStates = {
  LOADING: "loading",
  READY: "ready",
  ERROR: "error",
};

function App() {
  const [route, setRoute] = useState(router.SIGN_IN_OR_UP);
  const [magicLinkToken, setMagicLinkToken] = useState("");
  const [payloads, setPayloads] = useState(null);
  const [appState, setAppState] = useState(appStates.LOADING);
  const [error] = useState(null);

  const handleVerifyMagicLink = (magicLinkToken) => {
    setRoute(router.VERIFY_MAGIC_LINK);
    setMagicLinkToken(magicLinkToken);
  };

  useEffect(() => {
    const getSession = async () => {
      const { data } = await scuteClient.getAuthToken();

      setAppState(appStates.READY);

      if (data) {
        console.log("Session Data", data);
        setRoute(router.PROFILE);
      }
    };
    getSession();
  }, []);

  useEffect(() => {
    const magicLinkToken = scuteClient.getMagicLinkToken();

    magicLinkToken && handleVerifyMagicLink(magicLinkToken);
  }, []);

  if (appState === appStates.ERROR) {
    return <div>Error: {JSON.stringify(error, null, 2)}</div>;
  }

  if (appState === appStates.LOADING) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      {route === router.SIGN_IN_OR_UP && (
        <SignInOrUp success={() => setRoute(router.PROFILE)} />
      )}
      {route === router.VERIFY_MAGIC_LINK && (
        <MagicLinkVerify
          magicLinkToken={magicLinkToken}
          payloads={payloads}
          setPayloads={setPayloads}
          success={() => setRoute(router.REGISTER_DEVICE)}
        />
      )}
      {route === router.REGISTER_DEVICE && (
        <RegisterDevice
          payloads={payloads}
          setPayloads={setPayloads}
          success={() => setRoute(router.PROFILE)}
        />
      )}
      {route === router.PROFILE && (
        <Profile
          logout={() => {
            setRoute(router.SIGN_IN_OR_UP);
            scuteClient.signOut();
          }}
        />
      )}
    </div>
  );
}

export default App;
