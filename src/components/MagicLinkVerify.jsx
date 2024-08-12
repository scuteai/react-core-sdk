import { useEffect, useRef, useState } from "react";
import { scuteClient } from "../scute";
import { SCUTE_MAGIC_PARAM } from "@scute/core";

export const MagicLinkVerify = ({
  magicLinkToken,
  success,
  payloads,
  setPayloads,
}) => {
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(null);

  const timeout = useRef(null);

  const removeTokenFromUrl = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete(SCUTE_MAGIC_PARAM);
    window.history.replaceState(window.history.state, "", url.toString());
  };

  useEffect(() => {
    const verifyMagicLink = async () => {
      const { data, error } = await scuteClient.verifyMagicLinkToken(
        magicLinkToken
      );
      if (error && !payloads) {
        setError(error);
        return;
      }

      removeTokenFromUrl();

      if (data) {
        setVerified(true);
        setPayloads(data);

        if (timeout.current) {
          return;
        }
        timeout.current = setTimeout(() => {
          success();
        }, 5000);
      }
    };

    verifyMagicLink();
  }, [magicLinkToken, success, setPayloads, payloads]);

  return (
    <div>
      <h4>
        {error
          ? "Error"
          : verified
          ? "Magic Link Verified"
          : "Verifying Magic Link..."}
      </h4>
      {verified && (
        <p>You will be redirected to Device Registration in soon...</p>
      )}
      <pre>
        <code>{JSON.stringify(error ? error : payloads, null, 2)}</code>
      </pre>
    </div>
  );
};
