import { useEffect, useState } from "react";
import { scuteClient } from "../scute";

export const Profile = ({ logout }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await scuteClient.getUser();
      console.log({ data, error });
      setUser(data.user);
    };
    getSession();
  }, []);

  return (
    <div>
      <h4>Profile</h4>

      <h4>Sessions</h4>
      <table
        style={{
          border: "1px solid black",
          "border-collapse": "collapse",
        }}
      >
        <thead>
          <tr>
            <th>Type</th>
            <th>UA</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {user &&
            user.sessions.map((session) => (
              <tr>
                <td>{session.type}</td>
                <td>{session.user_agent_shortname}</td>
                <td>{session.created_at}</td>
              </tr>
            ))}
        </tbody>
      </table>
      <button
        onClick={() => {
          logout();
        }}
      >
        Log Out
      </button>
    </div>
  );
};
