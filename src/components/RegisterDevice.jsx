import { useEffect, useState } from "react";
import { scuteClient } from "../scute";

export const RegisterDevice = ({ magicLinkToken, success, payloads }) => {
  const [error, setError] = useState(null);
  const [device, setDevice] = useState(null);

  useEffect(() => {}, [magicLinkToken]);

  return (
    <div>
      <h4>Register your device with webauthn</h4>
      <pre>
        <code>
          {(device || error) && JSON.stringify(error ? error : device, null, 2)}
        </code>
      </pre>
      <br />
      <br />
      {device && <p>You will be redirected to Your Profile in soon...</p>}
      <>
        <button
          onClick={async () => {
            await scuteClient.signInWithTokenPayload(payloads.authPayload);
            success();
          }}
        >
          Skip Device Register
        </button>
        <button
          onClick={async () => {
            const a = await scuteClient.signInWithTokenPayload(
              payloads.authPayload
            );
            if (a.error) {
              setError(a.error);
              return;
            }

            const { data, error } = await scuteClient.addDevice();
            console.log({ data, error });
            if (error) {
              setError(error);
              return;
            }
            setDevice(data);

            setTimeout(() => {
              success();
            }, 5000);
          }}
        >
          Register Device
        </button>
      </>
    </div>
  );
};
