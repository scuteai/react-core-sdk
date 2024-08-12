import { useEffect, useState } from "react";
import { scuteClient } from "../scute";

export const SignInOrUp = ({ success }) => {
  const [email, setEmail] = useState("");
  const [metaFields, setMetaFields] = useState({});
  const [signed, setSigned] = useState(false);

  useEffect(() => {
    const getAppData = async () => {
      const { data, error } = await scuteClient.getAppData();
      if (error) {
        console.error(error);
        return;
      }

      if (!data.user_meta_data_schema || data.user_meta_data_schema === 0) {
        return;
      }

      const metaFormData = data.user_meta_data_schema.reduce(
        (acc, field) => ({
          ...acc,
          [field.field_name]: "",
        }),
        {}
      );

      setMetaFields(metaFormData);
    };

    getAppData();
  }, []);

  if (signed) {
    return (
      <div>
        <h4>Please Check Your Email</h4>
        <pre>
          <code>{JSON.stringify(signed, null, 2)}</code>
        </pre>
      </div>
    );
  }

  return (
    <div>
      <div>
        <input
          type="email"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* Renders metafields if set up in control.scute.io */}
      {Object.keys(metaFields).map((fieldName) => (
        <div key={fieldName}>
          <input
            value={metaFields[fieldName]}
            type="text"
            placeholder={fieldName}
            onChange={(e) =>
              setMetaFields({ ...metaFields, [fieldName]: e.target.value })
            }
          />
        </div>
      ))}
      <br />
      <div>
        <button
          onClick={async () => {
            const { data, error } = await scuteClient.signInOrUp(email, {
              userMeta: metaFields,
            });

            if (error) {
              console.error(error);
              return;
            }

            if (!data) {
              // webauthn
              success();
            } else {
              // magic link
              setSigned(data);
            }
          }}
        >
          Sign In or Sign Up
        </button>
      </div>
    </div>
  );
};
